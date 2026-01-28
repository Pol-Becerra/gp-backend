import fs from 'fs';
import fetch from 'node-fetch';
import ndjson from 'ndjson';
import { Client } from 'pg';

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'tu_usuario',
    password: 'tu_password',
    database: 'tu_base',
});

const NDJSON_URL = 'https://apis.datos.gob.ar/georef/api/v2.0/localidades.ndjson';
const BATCH_SIZE = 500;
const RETRY_LIMIT = 3;
const LOG_FILE = './localidades_faltantes.log';

async function main() {
    await client.connect();
    console.log('Conectado a la base de datos.');

    // Crear tabla temporal
    await client.query(`
    CREATE TEMP TABLE tmp_localidades_georef (
      id text PRIMARY KEY,
      nombre text,
      provincia text,
      departamento text,
      codigo_postal text
    )
  `);

    // Limpiar log
    fs.writeFileSync(LOG_FILE, '');

    const res = await fetch(NDJSON_URL);
    if (!res.ok) throw new Error(`Error descargando NDJSON: ${res.statusText}`);

    const stream = res.body.pipe(ndjson.parse());
    let batch = [];
    let total = 0;
    let faltantes = 0;

    for await (const obj of stream) {
        const { id, nombre, provincia, departamento, codigo_postal } = obj;

        if (!nombre || !id) continue;

        batch.push([
            id,
            nombre,
            provincia?.nombre || null,
            departamento?.nombre || null,
            codigo_postal || null
        ]);

        if (batch.length >= BATCH_SIZE) {
            const { inserted, missing } = await insertBatch(batch);
            total += inserted;
            faltantes += missing;
            console.log(`Procesadas ${total + faltantes} filas (insertadas: ${total}, faltantes: ${faltantes})`);
            batch = [];
        }
    }

    // Insertar lo que quedó pendiente
    if (batch.length > 0) {
        const { inserted, missing } = await insertBatch(batch);
        total += inserted;
        faltantes += missing;
        console.log(`Procesadas ${total + faltantes} filas finales (insertadas: ${total}, faltantes: ${faltantes})`);
    }

    // Actualizar tabla principal
    await client.query(`
    UPDATE localidades l
    SET codigo_postal = t.codigo_postal
    FROM tmp_localidades_georef t
    WHERE l.nombre = t.nombre
      AND l.provincia = t.provincia
      AND l.departamento = t.departamento
      AND t.codigo_postal IS NOT NULL
  `);

    console.log('Códigos postales actualizados en la tabla localidades.');
    console.log(`Revisar log de faltantes en: ${LOG_FILE}`);

    await client.end();
    console.log('Conexión cerrada.');
}

async function insertBatch(batch) {
    let attempts = 0;
    let inserted = 0;
    let missing = 0;

    while (attempts < RETRY_LIMIT) {
        try {
            const values = [];
            const placeholders = batch.map((row, i) => {
                const start = i * row.length + 1;
                return `(${row.map((_, j) => `$${start + j}`).join(',')})`;
            }).join(',');

            batch.forEach(row => values.push(...row));

            const query = `
        INSERT INTO tmp_localidades_georef (id, nombre, provincia, departamento, codigo_postal)
        VALUES ${placeholders}
        ON CONFLICT (id) DO NOTHING
      `;

            const result = await client.query(query, values);
            inserted += result.rowCount;

            // Log de filas sin código postal
            batch.forEach(row => {
                if (!row[4]) {
                    fs.appendFileSync(LOG_FILE, `${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}\n`);
                    missing++;
                }
            });

            break; // Salir del loop si se insertó correctamente
        } catch (err) {
            attempts++;
            console.warn(`Batch falló (intento ${attempts}): ${err.message}`);
            if (attempts >= RETRY_LIMIT) throw err;
        }
    }

    return { inserted, missing };
}

main().catch(console.error);
