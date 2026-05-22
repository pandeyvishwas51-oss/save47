import type { FastifyInstance } from 'fastify';
import type { JobProgress } from 'bullmq';
import { downloadQueue, downloadQueueEvents } from '../services/queue.js';

// SSE progress channel for queued (async) download jobs.
// The synchronous /download route streams bytes directly; this endpoint is
// reserved for future use where a job is enqueued and a client polls progress.

type ProgressArgs = { jobId: string; data: JobProgress };
type CompletedArgs = { jobId: string; returnvalue: string };
type FailedArgs = { jobId: string; failedReason: string };

export async function streamRoutes(app: FastifyInstance) {
  app.get<{ Params: { jobId: string } }>('/stream/:jobId', async (req, reply) => {
    const { jobId } = req.params;

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    reply.raw.flushHeaders?.();

    const send = (data: Record<string, unknown>) => {
      reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const job = await downloadQueue.getJob(jobId);
    if (!job) {
      send({ stage: 'error', message: 'Unknown job id' });
      reply.raw.end();
      return;
    }

    // Initial state
    const state = await job.getState();
    send({ stage: state, progress: typeof job.progress === 'number' ? job.progress : 0 });

    const onProgress = ({ jobId: id, data }: ProgressArgs) => {
      if (id !== jobId) return;
      const progress = typeof data === 'number' ? data : 0;
      send({ stage: 'downloading', progress });
    };

    const onCompleted = ({ jobId: id, returnvalue }: CompletedArgs) => {
      if (id !== jobId) return;
      send({ stage: 'complete', progress: 100, downloadUrl: returnvalue });
      cleanup();
      reply.raw.end();
    };

    const onFailed = ({ jobId: id, failedReason }: FailedArgs) => {
      if (id !== jobId) return;
      send({ stage: 'error', message: failedReason });
      cleanup();
      reply.raw.end();
    };

    const heartbeat = setInterval(() => {
      reply.raw.write(': keep-alive\n\n');
    }, 15000);

    const cleanup = () => {
      clearInterval(heartbeat);
      downloadQueueEvents.off('progress', onProgress);
      downloadQueueEvents.off('completed', onCompleted);
      downloadQueueEvents.off('failed', onFailed);
    };

    downloadQueueEvents.on('progress', onProgress);
    downloadQueueEvents.on('completed', onCompleted);
    downloadQueueEvents.on('failed', onFailed);

    req.raw.on('close', () => {
      cleanup();
      if (!reply.raw.writableEnded) reply.raw.end();
    });
  });
}
