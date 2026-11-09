# Ruang Tenang

Aplikasi Next.js untuk pre-test, panduan relaksasi, dan post-test APAIS. Inisial dan jawaban dikirim ke backend, disimpan di Supabase, dan dapat dilihat melalui dashboard `/admin`.

## Menyiapkan database dan aplikasi

1. Buat proyek Supabase, kemudian jalankan isi `supabase/schema.sql` di SQL Editor. Tabel memakai Row Level Security dan tidak memberikan akses langsung kepada peran `anon` atau `authenticated`.
2. Salin `.env.example` menjadi `.env.local`, lalu isi `SUPABASE_URL` dan legacy `service_role` key dari pengaturan API Supabase. Kunci ini hanya boleh berada di server. Isi juga `ADMIN_PASSWORD` dengan kata sandi acak yang kuat dan `SESSION_SECRET` dengan nilai acak minimal 32 karakter yang berbeda dari kata sandi. Contoh membuat nilai acak: `openssl rand -base64 32`.
3. Jalankan `npm install`, lalu `npm run dev`. Buka http://localhost:3000 dan http://localhost:3000/admin.
4. Jalankan `npm run build` untuk memeriksa build produksi.

Form meminta inisial sebelum setiap tes. Hasil baru disimpan setelah seluruh jawaban dikirim. Dashboard menampilkan hingga 1.000 hasil terbaru beserta jawaban dan waktu dalam WIB. ID acak di browser ikut tersimpan untuk membantu menghubungkan tes dari perangkat dan browser yang sama; ID ini bukan identitas pasien yang terverifikasi. Inisial juga tidak menjamin identitas pasien unik.

## Deploy

**Vercel:** impor repository sebagai proyek Next.js. Tambahkan empat variabel dari `.env.example` di Project Settings > Environment Variables, lalu deploy ulang. Gunakan nilai berbeda untuk setiap lingkungan bila memungkinkan. Jangan gunakan prefix `NEXT_PUBLIC_` untuk rahasia.

**Cloudflare Workers:** proyek menggunakan adapter OpenNext. Atur build command `npm run cf:build` dan deploy command `npm run cf:deploy` pada Workers Builds, lalu tambahkan empat variabel dari `.env.example` sebagai secret runtime. Build adapter dapat diuji lokal dengan `npm run cf:build`. Lihat [panduan OpenNext](https://opennext.js.org/cloudflare/get-started).

## Data dan akses admin

Jawaban dan inisial termasuk data sensitif dalam konteks ini. Login admin menggunakan satu kata sandi bersama dan cookie sesi selama delapan jam. Belum ada pembatasan percobaan login, akun individual, audit log, pengelolaan retensi/penghapusan data, atau verifikasi identitas pasien. Sebelum dipakai untuk pasien sungguhan, tambahkan kontrol akses dan pembatasan percobaan login di platform, tentukan kebijakan privasi dan retensi, serta tinjau persyaratan pengelolaan data kesehatan. Jangan menganggap inisial sebagai anonimisasi.

## Perhitungan APAIS

Setiap pertanyaan dinilai 1–5. Skor kecemasan menjumlahkan pertanyaan 1, 2, 4, dan 5 (rentang 4–20). Skor minimal 11 ditampilkan sebagai mencapai batas skrining; ini bukan diagnosis atau kategori derajat kecemasan. Pertanyaan 3 dan 6 dijumlahkan terpisah sebagai skor kebutuhan informasi (rentang 2–10). Ambang dapat bergantung pada populasi dan versi instrumen. Rujukan: https://pmc.ncbi.nlm.nih.gov/articles/PMC2736533/

Verifikasi konten kesehatan dan hak penggunaan aset sebelum digunakan di luar portofolio.
