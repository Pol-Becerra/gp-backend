require('dotenv').config()
const fetch = require('node-fetch') // obligatorio en Node <20
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const GEOREF = 'https://apis.datos.gob.ar/georef/api'

async function fetchJSONSafe(url) {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            console.warn('❌ Fetch error:', res.status, url)
            return null
        }
        return await res.json()
    } catch (e) {
        console.warn('❌ Fetch exception:', e.message)
        return null
    }
}

async function main() {
    console.log('📮 Importando códigos postales desde GeoRef')

    const { data: localidades, error } = await supabase
        .from('localidades')
        .select('id, nombre, partidos(nombre, provincias(nombre))')

    if (error) throw error
    console.log(`🏠 Localidades encontradas: ${localidades.length}`)

    for (const loc of localidades) {
        const provincia = loc.partidos.provincias.nombre
        const localidad = loc.nombre

        let codigos = []

        // 1️⃣ CABA
        if (provincia === 'Ciudad Autónoma de Buenos Aires') {
            const url = `${GEOREF}/barrios?nombre=${encodeURIComponent(localidad)}&campos=nombre,codigo_postal&max=5`
            const data = await fetchJSONSafe(url)
            if (data?.barrios) codigos = data.barrios.map(b => b.codigo_postal).filter(Boolean)
        }
        // 2️⃣ Resto del país
        else {
            const url = `${GEOREF}/localidades-censales?provincia=${encodeURIComponent(provincia)}&nombre=${encodeURIComponent(localidad)}&campos=nombre,codigo_postal&max=5`
            const data = await fetchJSONSafe(url)
            if (data?.localidades_censales) codigos = data.localidades_censales.map(l => l.codigo_postal).filter(Boolean)
        }

        codigos = [...new Set(codigos)]
        if (codigos.length === 0) {
            console.log(`⚠️ Sin CP para: ${provincia} / ${localidad}`)
            continue
        }

        for (const codigo of codigos) {
            console.log(`  ↪ Insertando CP ${codigo} para ${localidad}`)

            // Insertar código postal
            const { data: cp, error: cpError } = await supabase
                .from('codigos_postales')
                .upsert({ codigo }, { onConflict: 'codigo' })
                .select('id')
                .single()

            if (cpError || !cp) {
                console.warn('❌ Error CP:', codigo, cpError?.message)
                continue
            }

            // Relacionar localidad ↔ CP
            const { error: relError } = await supabase
                .from('localidades_codigos_postales')
                .upsert(
                    { localidad_id: loc.id, codigo_postal_id: cp.id },
                    { onConflict: 'localidad_id,codigo_postal_id' }
                )

            if (relError) console.warn('❌ Error relación:', relError.message)
        }
    }

    console.log('🎉 Importación de códigos postales finalizada')
}

main()
