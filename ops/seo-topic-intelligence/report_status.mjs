import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const args = parseArgs({
  options: {
    db: { type: 'string' },
    'low-water': { type: 'string', default: '15' },
  },
});

const DB_PATH = args.values.db || process.env.SANTI_BLOG_DB || path.resolve(process.env.HOME || '.', '.hermes/profiles/don-santo/scripts/blog_topics.db');
const LOW_WATER = parseInt(args.values['low-water'], 10);

function runSql(dbPath, sql) {
    return execFileSync("sqlite3", [dbPath, sql], { encoding: "utf8" }).trim();
}

function getStats() {
    try {
        const topicsReady = parseInt(runSql(DB_PATH, "SELECT COUNT(*) FROM topics WHERE status = 'ready';"), 10);
        const accepted = parseInt(runSql(DB_PATH, "SELECT COUNT(*) FROM topic_candidates WHERE status = 'accepted';"), 10);
        const rejected = parseInt(runSql(DB_PATH, "SELECT COUNT(*) FROM topic_candidates WHERE status = 'rejected';"), 10);
        
        return { topicsReady, accepted, rejected, blocked: 0 };
    } catch (e) {
        return { blocked: 1 };
    }
}

const stats = getStats();
let state = 'HEALTHY';

if (stats.blocked) {
    state = 'BLOCKED';
} else if (stats.topicsReady < LOW_WATER) {
    state = 'LOW_WATER';
} else if (stats.accepted + stats.rejected > 0 && (stats.rejected / (stats.accepted + stats.rejected)) > 0.5) {
    state = 'QUARANTINED';
} else if (stats.topicsReady >= LOW_WATER && stats.accepted === 0) {
    state = 'NO_OP';
}

console.log(`state=${state}|ready_before=${stats.topicsReady || 0}|ready_after=${stats.topicsReady || 0}|accepted=${stats.accepted || 0}|rejected=${stats.rejected || 0}|blocked=${stats.blocked}|db=${DB_PATH}`);
