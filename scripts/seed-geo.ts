// scripts/seed-geo.ts
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for bulk inserts/bypassing RLS or if write access is restricted

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    try {
        console.log('Fetching provinces...')
        const provRes = await fetch('https://apis.datos.gob.ar/georef/api/provincias')
        const provData = await provRes.json()
        const provincias = provData.provincias.map((p: any) => ({
            id: p.id,
            nombre: p.nombre
        }))

        const { error: pErr } = await supabase.from('provincias').upsert(provincias)
        if (pErr) throw pErr
        console.log(`Seeded ${provincias.length} provinces.`)

        for (const prov of provincias) {
            console.log(`Fetching partidos for ${prov.nombre}...`)
            const partRes = await fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${prov.id}&max=1000`)
            const partData = await partRes.json()
            const partidos = partData.municipios.map((m: any) => ({
                id: m.id,
                nombre: m.nombre,
                provincia_id: prov.id
            }))

            if (partidos.length > 0) {
                const { error: mErr } = await supabase.from('partidos').upsert(partidos)
                if (mErr) throw mErr
                console.log(`  Seeded ${partidos.length} partidos in ${prov.nombre}.`)
            }

            // Note: Fetching ALL localities might be too much for a single seed run if done naively.
            // But let's try municipios first. If user wants "Ciudades", Georef has "localidades".
            // Georef Localidades can be many.
        }

        console.log('Seed completed successfully.')
    } catch (error) {
        console.error('Error seeding:', error)
    }
}

seed()
