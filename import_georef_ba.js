require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// ===============================
// SUPABASE
// ===============================
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ===============================
// GEOREF
// ===============================
const GEOREF_BASE = 'https://apis.datos.gob.ar/georef/api'

// ===============================
// HELPERS
// ===============================
async function fetchJSON(url) {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`Error al fetch ${url}`)
    }
    return res.json()
}

// ===============================
// PROVINCIAS (TODAS)
// ===============================
async function insertProvincias() {
    console.log('📍 Importando provincias')

    const data = await fetchJSON(
        `${GEOREF_BASE}/provincias?campos=id,nombre&max=100`
    )

    const provincias = data.provincias.map(p => ({
        nombre: p.nombre
    }))

    const { error } = await supabase
        .from('provincias')
        .upsert(provincias, { onConflict: 'nombre' })

    if (error) throw error

    console.log(`✅ Provincias importadas: ${provincias.length}`)
}

// ===============================
// PARTIDOS / DEPARTAMENTOS
// ===============================
async function insertPartidos() {
    console.log('🏘️ Importando partidos / departamentos')

    const { data: provincias, error } = await supabase
        .from('provincias')
        .select('id, nombre')

    if (error) throw error

    for (const prov of provincias) {
        console.log(`  ↳ ${prov.nombre}`)

        const data = await fetchJSON(
            `${GEOREF_BASE}/departamentos?provincia=${encodeURIComponent(
                prov.nombre
            )}&campos=id,nombre&max=500`
        )

        const rows = data.departamentos.map(d => ({
            provincia_id: prov.id,
            nombre: d.nombre
        }))

        if (rows.length === 0) continue

        const { error: e } = await supabase
            .from('partidos')
            .upsert(rows, { onConflict: 'provincia_id,nombre' })

        if (e) throw e
    }

    console.log('✅ Partidos / departamentos importados')
}

// ===============================
// LOCALIDADES (DEDUPLICADAS)
// ===============================
async function insertLocalidades() {
    console.log('🏠 Importando localidades')

    const { data: partidos, error } = await supabase
        .from('partidos')
        .select('id, nombre, provincias(nombre)')

    if (error) throw error

    for (const p of partidos) {
        const provNombre = p.provincias.nombre
        console.log(`  ↳ ${provNombre} / ${p.nombre}`)

        const data = await fetchJSON(
            `${GEOREF_BASE}/localidades?provincia=${encodeURIComponent(
                provNombre
            )}&departamento=${encodeURIComponent(
                p.nombre
            )}&campos=id,nombre&max=1000`
        )

        // 🔥 DEDUPLICACIÓN DEFINITIVA
        const seen = new Set()
        const rows = []

        for (const l of data.localidades) {
            const nombre = l.nombre.trim()
            const key = `${p.id}|${nombre.toLowerCase()}`

            if (seen.has(key)) continue
            seen.add(key)

            rows.push({
                partido_id: p.id,
                nombre
            })
        }

        if (rows.length === 0) continue

        const { error: e } = await supabase
            .from('localidades')
            .upsert(rows, { onConflict: 'partido_id,nombre' })

        if (e) throw e
    }

    console.log('✅ Localidades importadas')
}

// ===============================
// MAIN
// ===============================
async function main() {
    try {
        await insertProvincias()
        await insertPartidos()
        await insertLocalidades()
        console.log('🎉 Importación COMPLETA de Argentina finalizada')
    } catch (e) {
        console.error('💥 Error general:', e)
    }
}

main()
