import { NextResponse } from 'next/server';
import { configured, db, sameOrigin } from '../../../lib/server';
export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!configured()) return NextResponse.json({ error: 'Penyimpanan belum dikonfigurasi.' }, { status: 503 });
  try {
    const { initials, phase, answers, participantId } = await request.json();
    if (typeof initials !== 'string' || !/^(?:[\p{L}]{1,4}|[\p{L}](?:[ .-][\p{L}]){1,3})$/u.test(initials.trim()) || !['pre', 'post'].includes(phase) || !Array.isArray(answers) || answers.length !== 6 || !answers.every(v => Number.isInteger(v) && v >= 1 && v <= 5) || typeof participantId !== 'string' || !/^[a-f0-9-]{36}$/i.test(participantId)) return NextResponse.json({ error: 'Data tidak valid. Periksa inisial dan jawaban.' }, { status: 400 });
    await db('results', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ initials: initials.trim().toUpperCase(), phase, answers, participant_id: participantId, anxiety_score: [0,1,3,4].reduce((s,i) => s + answers[i], 0), information_score: answers[2] + answers[5] }) });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Jawaban belum berhasil disimpan. Silakan coba lagi.' }, { status: 500 }); }
}
