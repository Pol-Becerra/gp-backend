import fs from 'fs';
import fetch from 'node-fetch';
import ndjson from 'ndjson';
import { Client } from 'pg';

// Configuración de tu base de datos PostgreSQL
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'tu_usuario',
    password: 'tu_password',
    database: 'tu_base',
});

const NDJSON_URL = 'https://apis.datos.gob.ar/georef/api/v2.0/localidades.ndjson';
const BATCH_SIZE = 500; // Cantidad de filas por insert

async function main() {
    await client.connect();
    console.log('Conectado a la base de datos.');

    // Crear tabla temporal
    await client.query(`
    CREATE TEMP TABLE tmp_localidades_georef (
      id text,
      nombre text,
      provincia text,
      departamento text,
      codigo_postal text
    )
  `);

    const res = await fetch(NDJSON_URL);
    if (!res.ok) throw new Error(`Error descargando NDJSON: ${res.statusText}`);

    const stream = res.body.pipe(ndjson.parse());
    let batch = [];
    let total = 0;

    for await (const obj of stream) {
        const { id, nombre, provincia, departamento, codigo_postal } = obj;

        if (!nombre) continue;

        batch.push([
            id,
            nombre,
            provincia?.nombre || null,
            departamento?.nombre || null,
            codigo_postal || null
        ]);

        if (batch.length >= BATCH_SIZE) {
            await insertBatch(batch);
            total += batch.length;
            console.log(`Insertadas ${total} filas...`);
            batch = [];
        }
    }

    // Insertar lo que quedó pendiente
    if (batch.length > 0) {
        await insertBatch(batch);
        total += batch.length;
        console.log(`Insertadas ${total} filas finales.`);
    }

    // Actualizar tabla localidades
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
    await client.end();
    console.log('Conexión cerrada.');
}

// Función para insertar un batch de filas
async function insertBatch(batch) {
    const values = [];
    const placeholders = batch.map((row, i) => {
        const start = i * row.length + 1;
        return `(${row.map((_, j) => `$${start + j}`).join(',')})`;
    }).join(',');

    batch.forEach(row => values.push(...row));

    const query = `
    INSERT INTO tmp_localidades_georef (id, nombre, provincia, departamento, codigo_postal)
    VALUES ${placeholders}
  `;

    await client.query(query, values);
}

main().catch(console.error);
