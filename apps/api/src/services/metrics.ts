import { redis } from './redis.js';

// Metrics — counters in Redis. Cheap to read for the admin dashboard.
//
//   metrics:total:<probes|downloads|errors>             -> int
//   metrics:daily:<probes|downloads|errors>:<YYYY-MM-DD> -> int (TTL 60 days)
//   metrics:platform:<platform>                          -> int
//   metrics:errors:<code>                                -> int
//   metrics:recent                                       -> LIST of JSON events (cap 200)

type Counter = 'probes' | 'downloads' | 'errors';

const RECENT_LIMIT = 200;

export interface RecentEvent {
  ts: number;
  kind: Counter;
  platform?: string;
  code?: string;
  ip?: string;
  via?: 'web' | 'api';
  url?: string; // truncated
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function record(event: {
  kind: Counter;
  platform?: string;
  code?: string;
  ip?: string;
  via?: 'web' | 'api';
  url?: string;
}): Promise<void> {
  const day = today();
  const pipe = redis.pipeline();
  pipe.incr(`metrics:total:${event.kind}`);
  pipe.incr(`metrics:daily:${event.kind}:${day}`);
  pipe.expire(`metrics:daily:${event.kind}:${day}`, 60 * 24 * 3600);
  if (event.platform) pipe.zincrby('metrics:platforms', 1, event.platform);
  if (event.code) pipe.zincrby('metrics:errors', 1, event.code);

  const recent: RecentEvent = {
    ts: Date.now(),
    kind: event.kind,
    platform: event.platform,
    code: event.code,
    ip: event.ip,
    via: event.via,
    url: event.url ? event.url.slice(0, 120) : undefined,
  };
  pipe.lpush('metrics:recent', JSON.stringify(recent));
  pipe.ltrim('metrics:recent', 0, RECENT_LIMIT - 1);
  await pipe.exec();
}

export async function summary(): Promise<{
  totals: Record<Counter, number>;
  today: Record<Counter, number>;
  last14: Array<{ day: string; probes: number; downloads: number; errors: number }>;
  topPlatforms: Array<{ platform: string; count: number }>;
  topErrors: Array<{ code: string; count: number }>;
  recent: RecentEvent[];
}> {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const [
    totalProbes,
    totalDownloads,
    totalErrors,
    todayProbes,
    todayDownloads,
    todayErrors,
    platforms,
    errors,
    recentRaw,
    ...dailyRaw
  ] = await Promise.all([
    redis.get('metrics:total:probes'),
    redis.get('metrics:total:downloads'),
    redis.get('metrics:total:errors'),
    redis.get(`metrics:daily:probes:${today()}`),
    redis.get(`metrics:daily:downloads:${today()}`),
    redis.get(`metrics:daily:errors:${today()}`),
    redis.zrange('metrics:platforms', 0, 9, 'REV', 'WITHSCORES'),
    redis.zrange('metrics:errors', 0, 9, 'REV', 'WITHSCORES'),
    redis.lrange('metrics:recent', 0, 49),
    ...days.flatMap((d) => [
      redis.get(`metrics:daily:probes:${d}`),
      redis.get(`metrics:daily:downloads:${d}`),
      redis.get(`metrics:daily:errors:${d}`),
    ]),
  ]);

  const last14 = days.map((day, i) => ({
    day,
    probes: Number(dailyRaw[i * 3] ?? 0),
    downloads: Number(dailyRaw[i * 3 + 1] ?? 0),
    errors: Number(dailyRaw[i * 3 + 2] ?? 0),
  }));

  const zsetToList = (arr: string[]): Array<{ key: string; count: number }> => {
    const out: Array<{ key: string; count: number }> = [];
    for (let i = 0; i < arr.length; i += 2) {
      out.push({ key: arr[i], count: Number(arr[i + 1]) });
    }
    return out;
  };

  return {
    totals: {
      probes: Number(totalProbes ?? 0),
      downloads: Number(totalDownloads ?? 0),
      errors: Number(totalErrors ?? 0),
    },
    today: {
      probes: Number(todayProbes ?? 0),
      downloads: Number(todayDownloads ?? 0),
      errors: Number(todayErrors ?? 0),
    },
    last14,
    topPlatforms: zsetToList(platforms).map((x) => ({ platform: x.key, count: x.count })),
    topErrors: zsetToList(errors).map((x) => ({ code: x.key, count: x.count })),
    recent: recentRaw
      .map((r) => {
        try {
          return JSON.parse(r) as RecentEvent;
        } catch {
          return null;
        }
      })
      .filter((r): r is RecentEvent => !!r),
  };
}
