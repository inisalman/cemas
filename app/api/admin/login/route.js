import { NextResponse } from 'next/server';
import { configured, passwordMatches, sameOrigin, sessionToken } from '../../../../lib/server';
export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!configured()) return NextResponse.json({ error: 'Server belum dikonfigurasi.' }, { status: 503 });
  try {
    const { password } = await request.json();
    if (typeof password !== 'string' || password.length > 1024 || !passwordMatches(password)) return NextResponse.json({ error: 'Kata sandi salah.' }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_session', sessionToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60 });
    return response;
  } catch { return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 }); }
}
