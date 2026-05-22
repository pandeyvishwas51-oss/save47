import { Queue, QueueEvents } from 'bullmq';
import { redisConnection } from './redis.js';

const connection = {
  host: redisConnection.host,
  port: redisConnection.port,
  password: redisConnection.password,
};

// Probe queue (fast, metadata only)
export const probeQueue = new Queue('probe', { connection });

// Download queue (slower, actual extraction)
export const downloadQueue = new Queue('download', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

// Queue events for SSE-driven progress updates
export const downloadQueueEvents = new QueueEvents('download', { connection });
