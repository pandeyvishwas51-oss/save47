import { NextRequest, NextResponse } from 'next/server';

// Thin same-origin proxy to the Fastify backend. The frontend can call this
// instead of hitting the backend directly when CORS is undesirable.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ code: 'no_video_found', message: 'Missing url' }, { status: 400 });
  }
  try {
    const res = await fetch(`${API_BASE}/probe?url=${encodeURIComponent(url)}`, {
      cache: 'no-store',
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (e) {
    return NextResponse.json(
      { code: 'default', message: (e as Error).message },
      { status: 502 }
    );
  }
}
