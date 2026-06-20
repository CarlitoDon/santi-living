
import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config({ path: '.env.local' });

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
await client.connect();

const res = await client.query('SELECT event_id, event_type, source, medium, campaign, city, gclid, wbraid, gbraid, event_timestamp FROM lead_events ORDER BY event_timestamp DESC LIMIT 20');
console.log(JSON.stringify(res.rows, null, 2));
await client.end();
