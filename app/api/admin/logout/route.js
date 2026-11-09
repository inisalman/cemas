import { NextResponse } from 'next/server';
import { sameOrigin } from '../../../../lib/server';
export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
