import { execFileSync, spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFileSync, mkdirSync } from 'node:fs';

const tempDir = join(tmpdir(), 'seo-topic-test-' + Date.now());
mkdirSync(tempDir);

function createDb(name, ready, pending, accepted, rejected) {
    const dbPath = join(tempDir, name + '.db');
    writeFileSync(dbPath, '');
    execFileSync('sqlite3', [dbPath, 'CREATE TABLE topics (id INTEGER, status TEXT); CREATE TABLE topic_candidates (id TEXT, status TEXT);']);
    for (let i = 0; i < ready; i++) execFileSync('sqlite3', [dbPath, `INSERT INTO topics VALUES (${i}, 'ready');`]);
    for (let i = 0; i < pending; i++) execFileSync('sqlite3', [dbPath, `INSERT INTO topic_candidates VALUES ('p${i}', 'pending');`]);
    for (let i = 0; i < accepted; i++) execFileSync('sqlite3', [dbPath, `INSERT INTO topic_candidates VALUES ('a${i}', 'accepted');`]);
    for (let i = 0; i < rejected; i++) execFileSync('sqlite3', [dbPath, `INSERT INTO topic_candidates VALUES ('r${i}', 'rejected');`]);
    return dbPath;
}

const tests = [
    { name: 'healthy', ready: 20, pending: 0, accepted: 1, rejected: 0, expected: 'HEALTHY' },
    { name: 'noop', ready: 20, pending: 0, accepted: 0, rejected: 0, expected: 'NO_OP' },
    { name: 'low', ready: 5, pending: 0, accepted: 0, rejected: 0, expected: 'LOW_WATER' },
    { name: 'quarantine', ready: 20, pending: 0, accepted: 2, rejected: 10, expected: 'QUARANTINED' },
];

for (const t of tests) {
    const db = createDb(t.name, t.ready, t.pending, t.accepted, t.rejected);
    const result = spawnSync('node', ['ops/seo-topic-intelligence/report_status.mjs', '--db', db], { encoding: 'utf8' });
    if (!result.stdout.includes(`state=${t.expected}`)) {
        console.error(`Test ${t.name} failed: expected ${t.expected}, got ${result.stdout}`);
        process.exit(1);
    }
    console.log(`Test ${t.name} passed`);
}

// Missing DB test
const result = spawnSync('node', ['ops/seo-topic-intelligence/report_status.mjs', '--db', 'nonexistent.db'], { encoding: 'utf8' });
if (!result.stdout.includes('state=BLOCKED')) {
    console.error('Test blocked failed');
    process.exit(1);
}
console.log('All tests passed');
