import { readFile, readdir } from 'node:fs/promises';
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
const migrationsDir = join(__dirname, '..', 'db', 'migrations');
const migrationFiles = (await readdir(migrationsDir))
  .filter((filename) => filename.endsWith('.sql'))
  .sort();

for (const filename of migrationFiles) {
  const migrationPath = join(migrationsDir, filename);
  const migrationSql = await readFile(migrationPath, 'utf8');
  const statements = migrationSql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
}

console.log(`lead_events migrations applied: ${migrationFiles.join(', ')}`);
