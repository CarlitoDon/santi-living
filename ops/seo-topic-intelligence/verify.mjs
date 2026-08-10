import { ensureSchema, recordCandidate, acceptCandidate, queueCounts } from '/Users/wecik/.hermes/profiles/don-santo/scripts/santi-blog-topic-queue.mjs';

async function verify() {
  console.log('Running verification...');
  ensureSchema();
  recordCandidate({
    id: 'test-topic-1',
    source: 'GSC',
    raw_query: 'sewa kasur test',
    intent_cluster: 'test-topic',
    search_volume: 10,
    relevance_score: 0.8,
    status: 'pending'
  });
  acceptCandidate('test-topic-1');
  const counts = queueCounts();
  console.log('Counts:', counts);
  console.log('Verification successful.');
}

verify().catch(console.error);
