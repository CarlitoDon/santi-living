import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const __dirname = dirname(fileURLToPath(import.meta.url));
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required before running the lead_events migration.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const migrationPath = join(__dirname, '..', 'db', 'migrations', '001_lead_events.sql');
const migrationSql = await readFile(migrationPath, 'utf8');

await sql.query(migrationSql);
console.log('lead_events migration applied');
