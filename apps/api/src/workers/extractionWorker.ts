import { Worker } from 'bullmq';
import { redisConnection } from '../services/redis.js';
import { streamVideo } from '../services/ytdlp.js';
import { buildFormatSelector } from '../services/formats.js';

// Optional async extraction worker. Used when we want to spool a download
// into temporary storage (e.g. Cloudflare R2) and surface a download link
// rather than streaming bytes synchronously through the API.

interface ExtractionJobData {
  url: string;
  formatId: string;
  quality: string;
}

new Worker<ExtractionJobData>(
  'download',
  async (job) => {
    const { url, formatId, quality } = job.data;
    const { selector, audioOnly } = buildFormatSelector(formatId, quality);
    const handle = streamVideo(url, selector, audioOnly);

    let bytes = 0;
    handle.stream.on('data', (chunk: Buffer) => {
      bytes += chunk.length;
      // BullMQ progress is just a number; clients see 'downloading' state.
      void job.updateProgress(Math.min(99, Math.floor(bytes / 1024 / 1024) % 100));
    });

    return new Promise<string>((resolve, reject) => {
      handle.process.on('close', (code) => {
        if (code === 0) resolve(`completed:${bytes}`);
        else reject(new Error(handle.stderrBuffer.value || 'extraction failed'));
      });
      handle.process.on('error', reject);
    });
  },
  { connection: redisConnection, concurrency: 2 }
);

// eslint-disable-next-line no-console
console.log('[worker] extraction worker started');
