import { NextRequest, NextResponse } from 'next/server';

// Server-side Turnstile token verification. The frontend may use this to
// short-circuit before opening a download URL.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function POST(req: NextRequest) {
  const secret = process.env.CF_TURNSTILE_SECRET_KEY;
  if (!secret) return NextResponse.json({ success: true });

  const { token } = (await req.json().catch(() => ({}))) as { token?: string };
  if (!token) {
    return NextResponse.json({ success: false, error: 'missing-token' }, { status: 400 });
  }

  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? '';
  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return NextResponse.json({ success: !!data.success });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: (e as Error).message },
      { status: 502 }
    );
  }
}
