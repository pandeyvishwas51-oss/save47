import type { FastifyInstance } from 'fastify';

// Image proxy for hotlink-protected thumbnails (Instagram, TikTok, FB).
// Whitelist platform CDNs so the proxy can't be abused as an open relay.
const ALLOWED_HOSTS = [
  /\.cdninstagram\.com$/i,
  /\.fbcdn\.net$/i,
  /^pbs\.twimg\.com$/i,
  /^i\.ytimg\.com$/i,
  /\.ytimg\.com$/i,
  /\.tiktokcdn\.com$/i,
  /\.tiktokcdn-us\.com$/i,
  /^preview\.redd\.it$/i,
  /^external-preview\.redd\.it$/i,
  /^i1\.sndcdn\.com$/i,
  /^i\.pinimg\.com$/i,
  /^i\.vimeocdn\.com$/i,
  /\.dmcdn\.net$/i,
  /^clips-media-assets2\.twitch\.tv$/i,
];

function isAllowed(hostname: string): boolean {
  return ALLOWED_HOSTS.some((re) => re.test(hostname));
}

export async function proxyRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { url?: string } }>('/proxy/thumb', async (req, reply) => {
    const raw = req.query.url?.trim();
    if (!raw) return reply.code(400).send({ code: 'bad_request', message: 'url required' });
    let target: URL;
    try {
      target = new URL(raw);
    } catch {
      return reply.code(400).send({ code: 'bad_request', message: 'invalid url' });
    }
    if (!['http:', 'https:'].includes(target.protocol)) {
      return reply.code(400).send({ code: 'bad_request', message: 'http(s) only' });
    }
    if (!isAllowed(target.hostname)) {
      return reply.code(403).send({ code: 'forbidden', message: 'host not allowed' });
    }

    try {
      const upstream = await fetch(target.toString(), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          Referer: `${target.protocol}//${target.hostname}/`,
        },
      });
      if (!upstream.ok || !upstream.body) {
        return reply.code(upstream.status).send({ code: 'upstream_error', message: 'thumbnail fetch failed' });
      }
      const ct = upstream.headers.get('content-type') ?? 'image/jpeg';
      reply.header('Content-Type', ct);
      reply.header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      reply.header('X-Proxy', 'save47');
      return reply.send(Buffer.from(await upstream.arrayBuffer()));
    } catch (err) {
      return reply.code(502).send({ code: 'upstream_error', message: (err as Error).message });
    }
  });
}
