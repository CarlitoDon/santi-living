import { execFileSync } from "node:child_process";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'blog_topics.db');

function runSql(dbPath, sql) {
    return execFileSync("sqlite3", [dbPath, sql], { encoding: "utf8" }).trim();
}

function sqlQuote(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'number') return str.toString();
    return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * Initializes the SQLite database and ensures the topic_candidates table exists.
 */
export function ensureSchema() {
    // Create candidate table for staging topics before they are accepted
    runSql(DB_PATH, `
        CREATE TABLE IF NOT EXISTS topic_candidates (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL,
            raw_query TEXT NOT NULL,
            intent_cluster TEXT NOT NULL,
            search_volume INTEGER DEFAULT 0,
            relevance_score REAL DEFAULT 0.0,
            evidence_json TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            processed_at DATETIME
        );
    `);
    
    // Ensure the main topics table exists as well (if this is run standalone)
    runSql(DB_PATH, `
        CREATE TABLE IF NOT EXISTS topics (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            slug        TEXT    NOT NULL UNIQUE,
            title       TEXT    NOT NULL,
            description TEXT    NOT NULL DEFAULT '',
            tags        TEXT    NOT NULL DEFAULT '[]',
            intent      TEXT    NOT NULL DEFAULT '[]',
            audience    TEXT    NOT NULL DEFAULT '',
            scenario    TEXT    NOT NULL DEFAULT '',
            item_focus  TEXT    NOT NULL DEFAULT '',
            area        TEXT    NOT NULL DEFAULT '',
            service     TEXT    NOT NULL DEFAULT '',
            topic_type  TEXT    NOT NULL DEFAULT 'general',
            status      TEXT    NOT NULL DEFAULT 'ready',
            used_at     TEXT,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
            en_title TEXT NOT NULL DEFAULT '',
            en_description TEXT NOT NULL DEFAULT '',
            en_audience TEXT NOT NULL DEFAULT '',
            en_scenario TEXT NOT NULL DEFAULT '',
            en_item_focus TEXT NOT NULL DEFAULT ''
        );
    `);
}

/**
 * Returns the counts of current candidates and ready topics.
 */
export function queueCounts() {
    let candidates = { pending: 0, accepted: 0, rejected: 0 };
    try {
        const rows = runSql(DB_PATH, `SELECT status, COUNT(*) as count FROM topic_candidates GROUP BY status;`);
        // Basic parser for SQL output
        rows.split('\n').filter(Boolean).forEach(line => {
             const parts = line.split('|');
             if (parts.length >= 2) candidates[parts[0]] = parseInt(parts[1], 10);
        });
    } catch(e) {}
    
    let topics = { ready: 0, used: 0, draft: 0 };
    try {
        const rows = runSql(DB_PATH, `SELECT status, COUNT(*) as count FROM topics GROUP BY status;`);
        rows.split('\n').filter(Boolean).forEach(line => {
             const parts = line.split('|');
             if (parts.length >= 2) topics[parts[0]] = parseInt(parts[1], 10);
        });
    } catch (e) {}
    
    return { candidates, topics };
}

/**
 * Stages a new candidate topic.
 */
export function recordCandidate(candidate) {
    const jsonStr = candidate.evidence_json || '{}';
    runSql(DB_PATH, `
        INSERT INTO topic_candidates 
        (id, source, raw_query, intent_cluster, search_volume, relevance_score, evidence_json, status)
        VALUES (
            ${sqlQuote(candidate.id)}, 
            ${sqlQuote(candidate.source)}, 
            ${sqlQuote(candidate.raw_query)}, 
            ${sqlQuote(candidate.intent_cluster)}, 
            ${Number(candidate.search_volume || 0)}, 
            ${Number(candidate.relevance_score || 0.0)}, 
            ${sqlQuote(jsonStr)}, 
            ${sqlQuote(candidate.status || 'pending')}
        )
        ON CONFLICT(id) DO UPDATE SET
            search_volume = excluded.search_volume,
            relevance_score = excluded.relevance_score,
            evidence_json = excluded.evidence_json,
            processed_at = CURRENT_TIMESTAMP;
    `);
    return true;
}

/**
 * Promotes an accepted candidate into the main topics queue.
 */
export function acceptCandidate(candidateId) {
    runSql(DB_PATH, `
        BEGIN IMMEDIATE;
        INSERT INTO topics (slug, title, status) 
        SELECT id, intent_cluster, 'ready' FROM topic_candidates WHERE id = ${sqlQuote(candidateId)} AND status = 'pending'
        ON CONFLICT(slug) DO NOTHING;
        
        UPDATE topic_candidates SET status = 'accepted', processed_at = CURRENT_TIMESTAMP WHERE id = ${sqlQuote(candidateId)};
        COMMIT;
    `);
    return true;
}
