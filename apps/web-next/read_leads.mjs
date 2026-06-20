
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
dotenv.config({ path: '../../.env.local' });

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  SELECT event_id, event_type, source, medium, campaign, city, gclid, wbraid, gbraid, event_timestamp 
  FROM lead_events 
  ORDER BY event_timestamp DESC 
  LIMIT 20
`;
console.log(JSON.stringify(rows, null, 2));
