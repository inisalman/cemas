import { createHmac, timingSafeEqual } from 'node:crypto';

export function configured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);
}
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
export function sessionToken() {
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expiry}.${createHmac('sha256', process.env.SESSION_SECRET).update(expiry).digest('hex')}`;
}
export function isAdmin(request) {
  if (!configured()) return false;
  const token = request.cookies.get('admin_session')?.value || '';
  const [expiry, signature] = token.split('.');
  if (!expiry || !signature || Number(expiry) < Date.now()) return false;
  const expected = createHmac('sha256', process.env.SESSION_SECRET).update(expiry).digest('hex');
  const a = Buffer.from(signature); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function passwordMatches(password) {
  const a = Buffer.from(password); const b = Buffer.from(process.env.ADMIN_PASSWORD || '');
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function db(path, options = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...options, cache: 'no-store', headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', ...options.headers }
  });
  if (!response.ok) throw new Error('Database request failed');
  return response.status === 204 ? null : response.json();
}
