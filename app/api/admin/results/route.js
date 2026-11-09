import { NextResponse } from 'next/server';
import { db, isAdmin } from '../../../../lib/server';
export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Silakan masuk sebagai admin.' }, { status: 401 });
  try {
    const results = await db('results?select=id,initials,phase,answers,anxiety_score,information_score,participant_id,created_at&order=created_at.desc&limit=1000');
    return NextResponse.json({ results }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Data belum berhasil dimuat.' }, { status: 500 }); }
}
