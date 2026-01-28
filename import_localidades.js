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

    // Descargar NDJSON y procesar streaming
    const res = await fetch(NDJSON_URL);
    if (!res.ok) throw new Error(`Error descargando NDJSON: ${res.statusText}`);

    const stream = res.body.pipe(ndjson.parse());

    for await (const obj of stream) {
        const { id, nombre, provincia, departamento, codigo_postal } = obj;

        if (!nombre) continue;

        await client.query(
            `INSERT INTO tmp_localidades_georef(id, nombre, provincia, departamento, codigo_postal)
       VALUES($1,$2,$3,$4,$5)`,
            [id, nombre, provincia?.nombre || null, departamento?.nombre || null, codigo_postal || null]
        );
    }

    console.log('Importación completada.');

    // Ejemplo de cruce con tu tabla "localidades"
    // Ajusta nombres de columnas según tu base
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

main().catch(console.error);
