import { Worker } from 'bullmq';
import { redisConnection } from '../services/redis.js';
import { probeUrl } from '../services/ytdlp.js';
import { buildMediaInfo } from '../services/formats.js';

// Optional async probe worker. Currently the synchronous /probe route handles
// metadata directly, but this worker can absorb load if we move probes async.

interface ProbeJobData {
  url: string;
}

new Worker<ProbeJobData>(
  'probe',
  async (job) => {
    const raw = await probeUrl(job.data.url);
    return buildMediaInfo(raw, job.data.url);
  },
  { connection: redisConnection }
);

// eslint-disable-next-line no-console
console.log('[worker] probe worker started');
