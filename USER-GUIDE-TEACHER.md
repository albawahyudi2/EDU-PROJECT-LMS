# 👨‍🏫 PANDUAN PENGGUNA GURU
**EDU LMS - Sistem Manajemen Pembelajaran**  
**Versi**: 1.0  
**Terakhir Diperbarui**: 12 Maret 2026

---

## 📖 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Login](#login)
3. [Dashboard Guru](#dashboard-guru)
4. [Mengelola Kelas](#mengelola-kelas)
5. [Membuat Tugas](#membuat-tugas)
6. [Menilai Tugas](#menilai-tugas)
7. [Menulis Laporan Harian](#menulis-laporan-harian)
8. [Memantau Progress Siswa](#memantau-progress-siswa)
9. [Tips & Trik](#tips--trik)
10. [Troubleshooting](#troubleshooting)

---

## 📚 Pendahuluan

### Apa itu EDU LMS?

EDU LMS adalah sistem manajemen pembelajaran yang dirancang khusus untuk anak berkebutuhan khusus (ABK). Sistem ini membantu guru untuk:

- ✅ Membuat dan mengelola tugas
- ✅ Menilai pekerjaan siswa secara online
- ✅ Menulis laporan perkembangan harian
- ✅ Memantau progress siswa dengan sistem XP dan Level
- ✅ Berkomunikasi dengan orang tua

### Fitur Utama untuk Guru

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard** | Ringkasan kelas, siswa, dan tugas yang perlu dinilai |
| **Manajemen Tugas** | Buat, edit, hapus tugas dengan mudah |
| **Penilaian** | Beri nilai dan feedback untuk siswa |
| **Laporan Harian** | Catat perkembangan siswa setiap hari |
| **Sistem Gamifikasi** | Berikan XP dan bantu siswa naik level |
| **Progress Tracking** | Lihat statistik dan kemajuan setiap siswa |

---

## 🔐 Login

### Langkah 1: Akses Website

1. Buka browser (Chrome, Firefox, atau Edge)
2. Ketik URL: **https://edu-lms.vercel.app** (atau sesuai URL sekolah)
3. Tekan Enter

### Langkah 2: Masukkan Kredensial

1. **Email**: Gunakan email guru yang sudah didaftarkan
   - Contoh: `guru@lms-abk.com`
2. **Password**: Masukkan password Anda
3. Klik tombol **"Masuk"**

### Langkah 3: Verifikasi Login Berhasil

Setelah login berhasil, Anda akan melihat:
- ✅ Dashboard guru dengan nama Anda di pojok kanan atas
- ✅ Menu navigasi (Dashboard, Kelas, Tugas, Laporan)
- ✅ Ringkasan data siswa dan kelas

### ⚠️ Troubleshooting Login

**Masalah**: Lupa password
- **Solusi**: Klik "Lupa Password?" → Masukkan email → Ikuti instruksi reset

**Masalah**: Email tidak terdaftar
- **Solusi**: Hubungi admin sekolah untuk registrasi

**Masalah**: Login berhasil tapi muncul halaman siswa
- **Solusi**: Akun Anda mungkin terdaftar sebagai siswa, hubungi admin

---

## 📊 Dashboard Guru

### Tampilan Dashboard

Setelah login, Anda akan melihat:

#### 1. **Ringkasan Statistik**
```
┌─────────────────────────────────────────┐
│  👥 Total Siswa: 25                     │
│  📚 Total Kelas: 3                      │
│  📝 Tugas Perlu Dinilai: 8              │
│  ✅ Laporan Hari Ini: 12/25             │
└─────────────────────────────────────────┘
```

#### 2. **Kelas Anda**
Daftar kelas yang Anda ajar:
- Nama kelas (contoh: "Kelas 1A - Matematika")
- Jumlah siswa
- Jumlah tugas aktif
- Tombol "Lihat Detail"

#### 3. **Tugas Perlu Dinilai**
Daftar tugas yang sudah dikumpulkan siswa tapi belum dinilai:
- Nama tugas
- Nama siswa
- Waktu pengumpulan
- Tombol "Nilai Sekarang"

#### 4. **Laporan Terbaru**
5 laporan harian terakhir yang Anda tulis:
- Tanggal
- Nama siswa
- Cuplikan isi laporan
- Tombol "Lihat/Edit"

### Navigasi Menu

| Menu | Fungsi |
|------|--------|
| 🏠 **Dashboard** | Halaman utama (ringkasan) |
| 📚 **Kelas** | Lihat dan kelola kelas Anda |
| 📝 **Tugas** | Buat dan kelola tugas |
| 📋 **Laporan** | Tulis laporan harian siswa |
| 👤 **Profil** | Lihat dan edit profil Anda |

---

## 📚 Mengelola Kelas

### Melihat Daftar Kelas

1. Klik menu **"Kelas"** di navigasi atas
2. Anda akan melihat semua kelas yang Anda ajar
3. Setiap kartu kelas menampilkan:
   - Nama kelas
   - Mata pelajaran
   - Jumlah siswa
   - Jumlah tugas aktif

### Melihat Detail Kelas

1. Klik **"Lihat Detail"** pada kelas yang ingin dilihat
2. Halaman detail kelas menampilkan:

#### Tab: Siswa
- Daftar semua siswa di kelas
- Level dan XP setiap siswa
- Progress penyelesaian tugas
- Tombol "Lihat Profil Siswa"

#### Tab: Tugas
- Semua tugas untuk kelas ini
- Status: Draft, Aktif, Ditutup
- Jumlah siswa yang sudah mengumpulkan
- Tombol "Buat Tugas Baru"

#### Tab: Progress
- Grafik rata-rata nilai kelas
- Siswa dengan performa terbaik
- Siswa yang perlu perhatian khusus
- Statistik pengumpulan tugas

### Melihat Profil Siswa

1. Di tab "Siswa", klik nama siswa
2. Anda akan melihat:
   - **Info Siswa**: Nama, email, level, total XP
   - **Progress**: Grafik perkembangan
   - **Tugas**: Daftar tugas dan nilai
   - **Laporan Harian**: Riwayat laporan dari Anda
   - **Orang Tua**: Info kontak orang tua

---

## 📝 Membuat Tugas

### Langkah-langkah Membuat Tugas Baru

#### 1. Buka Form Tugas

Dari Dashboard:
- Klik tombol **"+ Buat Tugas"** di pojok kanan atas

ATAU

Dari Halaman Kelas:
- Pilih kelas → Tab "Tugas" → Klik **"+ Tugas Baru"**

#### 2. Isi Detail Tugas

**Judul Tugas** (Wajib)
```
Contoh: "Latihan Penjumlahan 1-10"
```

**Deskripsi** (Opsional)
```
Contoh: "Tugas ini untuk melatih kemampuan 
penjumlahan angka 1 sampai 10."
```

**Instruksi** (Wajib)
```
Contoh:
1. Kerjakan semua soal di lembar jawaban
2. Foto hasil pekerjaan
3. Upload foto ke sistem
4. Pastikan foto jelas dan terbaca
```

**Kelas** (Wajib)
- Pilih kelas dari dropdown
- Contoh: "Kelas 1A - Matematika"

**Tenggat Waktu (Deadline)** (Wajib)
- Pilih tanggal dari kalender
- Pilih jam (format 24 jam)
- Contoh: 20 Maret 2026, pukul 23:59

**Nilai Maksimal** (Wajib)
- Masukkan nilai maksimal (biasanya 100)
- Digunakan untuk perhitungan persentase

**Reward XP** (Wajib)
- Masukkan jumlah XP yang akan diberikan
- Rekomendasi: 50 XP untuk tugas standar
- 100 XP untuk tugas besar/ulangan

**Lampiran** (Opsional)
- Upload file soal dalam format PDF/gambar
- Maksimal ukuran: 10 MB
- Format yang didukung: PDF, JPG, PNG

#### 3. Pratinjau dan Simpan

Sebelum menyimpan, Anda bisa:
- **Simpan sebagai Draft**: Belum terlihat oleh siswa
- **Publish Langsung**: Langsung terlihat oleh siswa
- **Jadwalkan**: Pilih kapan tugas akan otomatis muncul

Klik **"Simpan"** atau **"Publish"**

### Contoh Lengkap Tugas

```
═══════════════════════════════════════════
TUGAS MATEMATIKA
═══════════════════════════════════════════

Judul: Latihan Penjumlahan dan Pengurangan

Deskripsi:
Tugas ini melatih kemampuan dasar 
penjumlahan dan pengurangan untuk angka 
1 sampai 20.

Instruksi:
1. Download lembar soal di bawah ini
2. Kerjakan 10 soal penjumlahan
3. Kerjakan 10 soal pengurangan
4. Tulis nama dan tanggal di atas kertas
5. Foto hasil pekerjaan dengan jelas
6. Upload foto melalui tombol "Upload Jawaban"

Kelas: Kelas 1A - Matematika
Deadline: 25 Maret 2026, 23:59
Nilai Max: 100
Reward: 50 XP

Lampiran: [📄 soal-matematika.pdf]

═══════════════════════════════════════════
```

---

## ✅ Menilai Tugas

### Cara Akses Tugas yang Perlu Dinilai

**Opsi 1: Dari Dashboard**
1. Lihat bagian "Tugas Perlu Dinilai"
2. Klik **"Nilai Sekarang"** pada tugas yang ingin dinilai

**Opsi 2: Dari Menu Tugas**
1. Klik menu **"Tugas"**
2. Pilih tugas yang ingin dinilai
3. Klik tab **"Pengumpulan"**
4. Klik siswa yang sudah mengumpulkan

### Halaman Penilaian

Anda akan melihat:

#### 1. Info Pengumpulan
```
┌────────────────────────────────────────┐
│ Siswa: Ahmad Fauzi                     │
│ Dikumpulkan: 18 Maret 2026, 14:30     │
│ Status: Tepat Waktu ✅                 │
│ (Deadline: 20 Maret 2026, 23:59)      │
└────────────────────────────────────────┘
```

#### 2. Jawaban Siswa
- Teks jawaban (jika ada)
- Lampiran file (foto/PDF)
- Bisa di-download atau dilihat langsung

#### 3. Form Penilaian

**Nilai** (Wajib)
```
┌─────────────────────────────┐
│ Nilai: [____] / 100         │
│                             │
│ Contoh: 85                  │
└─────────────────────────────┘
```

**Feedback/Komentar** (Wajib)
```
┌─────────────────────────────────────────┐
│ Feedback untuk siswa:                   │
│                                         │
│ Contoh:                                 │
│ "Bagus! Semua soal penjumlahan benar.  │
│  Hanya ada 2 kesalahan kecil di soal   │
│  pengurangan nomor 7 dan 9.            │
│  Tetap semangat! 😊"                   │
│                                         │
└─────────────────────────────────────────┘
```

**XP yang Diberikan** (Otomatis)
```
Perhitungan XP:
- Nilai: 85/100 (85%)
- XP Reward Tugas: 50 XP
- XP Diperoleh: 42.5 XP (85% × 50)
- Bonus Tepat Waktu: +10% = 46.75 XP
- Total XP: 47 XP ✅
```

#### 4. Simpan Penilaian

Klik **"Simpan Penilaian"**

Setelah disimpan:
- ✅ Siswa langsung menerima notifikasi
- ✅ XP otomatis ditambahkan ke akun siswa
- ✅ Level siswa mungkin naik otomatis
- ✅ Orang tua bisa melihat nilai dan feedback

### Tips Memberikan Feedback

✅ **Good Feedback**:
```
"Bagus sekali! Perhitunganmu sudah tepat.
Cara penulisannya juga rapi dan mudah dibaca.
Pertahankan! 💪"
```

✅ **Constructive Feedback**:
```
"Sudah bagus! Tapi ada 2 kesalahan:
1. Soal nomor 3: Hasilnya 15, bukan 13
2. Soal nomor 8: Lupa tanda negatif
Coba periksa lagi ya. Keep up the good work!"
```

❌ **Avoid**:
```
"Salah semua."
"Kurang bagus."
```

### Keyboard Shortcuts (Opsional)

| Tombol | Fungsi |
|--------|--------|
| `Ctrl + S` | Simpan penilaian |
| `Ctrl + →` | Ke siswa berikutnya |
| `Ctrl + ←` | Ke siswa sebelumnya |
| `Esc` | Keluar dari mode penilaian |

---

## 📋 Menulis Laporan Harian

### Kenapa Laporan Harian Penting?

Laporan harian membantu:
- ✅ **Orang Tua**: Memantau perkembangan anak setiap hari
- ✅ **Guru**: Mengingat progress dan catatan penting
- ✅ **Siswa**: Merasa diperhatikan dan termotivasi

### Cara Menulis Laporan Harian

#### 1. Akses Form Laporan

**Dari Dashboard**:
- Bagian "Laporan Hari Ini"
- Klik **"+ Tulis Laporan"**

**Dari Menu Laporan**:
- Klik menu **"Laporan"**
- Klik **"+ Laporan Baru"**

#### 2. Pilih Siswa

- Pilih nama siswa dari dropdown
- Atau ketik untuk mencari

#### 3. Pilih Tanggal

- Default: Hari ini
- Bisa pilih tanggal lain jika melengkapi laporan kemarin

#### 4. Isi Isi Laporan

**Template Laporan Harian**:

```
═══════════════════════════════════════════
LAPORAN HARIAN SISWA
═══════════════════════════════════════════

Siswa: Ahmad Fauzi
Tanggal: 12 Maret 2026

───────────────────────────────────────────
KEHADIRAN
───────────────────────────────────────────
☑ Hadir        ☐ Tidak Hadir
☐ Sakit        ☐ Izin

───────────────────────────────────────────
SUASANA HATI (MOOD)
───────────────────────────────────────────
☐ Senang      ☑ Biasa Saja
☐ Sedih       ☐ Bersemangat
☐ Lelah

───────────────────────────────────────────
AKTIVITAS HARI INI
───────────────────────────────────────────
Hari ini Ahmad belajar penjumlahan dan 
pengurangan. Dia aktif bertanya saat ada 
yang belum dipahami.

───────────────────────────────────────────
PENCAPAIAN
───────────────────────────────────────────
✅ Menyelesaikan 10 soal matematika
✅ Aktif bertanya 3 kali
✅ Membantu teman yang kesulitan

───────────────────────────────────────────
YANG PERLU DIPERHATIKAN
───────────────────────────────────────────
Ahmad masih perlu latihan lebih banyak 
untuk soal pengurangan yang hasilnya 
negatif.

───────────────────────────────────────────
CATATAN UNTUK ORANG TUA
───────────────────────────────────────────
Mohon bantu Ahmad berlatih pengurangan 
di rumah. Bisa pakai benda-benda konkret 
seperti kelereng atau permen.

═══════════════════════════════════════════
```

#### 5. Simpan Laporan

Klik **"Simpan"** atau **"Simpan & Tulis Lainnya"**

### Contoh Laporan Harian

**Contoh 1: Hari Baik**
```
Siswa: Siti Nurhaliza
Tanggal: 12 Maret 2026
Kehadiran: ✅ Hadir
Mood: 😊 Senang

Isi Laporan:
Hari ini Siti sangat bersemangat! Dia berhasil 
menyelesaikan tugas membaca dengan lancar. 
Siti juga membantu temannya yang kesulitan. 
Perilakunya sangat baik dan sopan. Keep it up! 💪

Catatan untuk Orang Tua:
Siti sudah bisa membaca kalimat sederhana. 
Tolong terus latihan membaca 15 menit setiap 
malam ya. Terima kasih! 📚
```

**Contoh 2: Perlu Perhatian Khusus**
```
Siswa: Budi Santoso
Tanggal: 12 Maret 2026
Kehadiran: ✅ Hadir
Mood: 😔 Sedih

Isi Laporan:
Hari ini Budi terlihat kurang bersemangat. 
Saat ditanya, dia bilang kurang tidur semalam. 
Selama pelajaran dia sering mengantuk. Pekerjaan 
hanya selesai setengah.

Catatan untuk Orang Tua:
Mohon perhatikan jam tidur Budi. Anak usia ini 
perlu tidur 9-10 jam per hari. Pastikan Budi 
tidur maksimal jam 9 malam ya. Terima kasih 
atas perhatiannya.
```

**Contoh 3: Singkat tapi Informatif**
```
Siswa: Lisa Wijaya
Tanggal: 12 Maret 2026
Kehadiran: ✅ Hadir
Mood: 😊 Senang

Isi Laporan:
Lisa hari ini aktif dan fokus. Menyelesaikan 
semua tugas dengan baik. Tidak ada masalah 
khusus. Pertahankan!
```

### Tips Menulis Laporan

✅ **DO (Lakukan)**:
- Tulis setiap hari (konsisten)
- Fokus pada hal positif dulu
- Spesifik (contoh: "Menyelesaikan 8/10 soal")
- Berikan saran konkret untuk orang tua
- Gunakan bahasa yang ramah

❌ **DON'T (Jangan)**:
- Terlalu umum ("Hari ini biasa saja")
- Hanya fokus pada hal negatif
- Membandingkan dengan siswa lain
- Menggunakan bahasa yang menyalahkan
- Menulis terlalu panjang (orang tua sibuk)

---

## 📈 Memantau Progress Siswa

### Halaman Progress Siswa

#### 1. Akses Progress

**Dari Daftar Siswa**:
- Menu "Kelas" → Pilih kelas → Tab "Siswa"
- Klik nama siswa → Tab "Progress"

#### 2. Statistik yang Ditampilkan

**📊 Ringkasan Progress**
```
┌──────────────────────────────────────────┐
│ Total XP: 1,250 XP                       │
│ Level: 5 (Progress ke Level 6: 65%)     │
│ Rata-rata Nilai: 85.5                   │
│ Tingkat Penyelesaian: 90% (18/20)       │
│ Tingkat Ketepatan Waktu: 95%            │
│ Streak: 7 hari berturut-turut 🔥        │
└──────────────────────────────────────────┘
```

**📈 Grafik Perkembangan**
- Grafik nilai per tugas (trend naik/turun)
- Grafik XP kumulatif
- Grafik kehadiran

**📝 Riwayat Tugas**
Tabel semua tugas dengan:
- Nama tugas
- Tanggal pengumpulan
- Nilai
- XP yang diperoleh
- Status (Tepat Waktu / Terlambat)

**📋 Laporan Harian**
10 laporan terakhir dengan cuplikan isi

### Mengidentifikasi Siswa yang Perlu Bantuan

#### 🔴 Red Flags (Perlu Perhatian Segera)

1. **Tingkat Penyelesaian < 50%**
   - Artinya: Siswa hanya mengerjakan setengah tugas
   - Tindakan: Hubungi orang tua, buat jadwal khusus

2. **Nilai Rata-rata < 60**
   - Artinya: Siswa kesulitan memahami materi
   - Tindakan: Beri bimbingan tambahan, sesuaikan metode

3. **Tidak Submit 3 Tugas Berturut-turut**
   - Artinya: Mungkin ada masalah di rumah atau motivasi
   - Tindakan: Bicarakan secara pribadi, libatkan orang tua

4. **Mood dalam Laporan Selalu "Sedih"**
   - Artinya: Mungkin ada masalah emosional/sosial
   - Tindakan: Konseling, koordinasi dengan psikolog/wali kelas

#### 🟡 Yellow Flags (Perlu Dipantau)

1. **Tingkat Ketepatan Waktu < 70%**
   - Sering terlambat submit
   - Mungkin perlu bantuan manajemen waktu

2. **Nilai Turun 2 Minggu Berturut-turut**
   - Trend menurun perlu diperhatikan
   - Cek apakah materi terlalu sulit

3. **Tidak Hadir 3 Hari dalam Seminggu**
   - Absensi rendah mempengaruhi pembelajaran
   - Koordinasi dengan orang tua

#### 🟢 Green Flags (Siswa Berkembang Baik)

1. **Tingkat Penyelesaian > 90%**
2. **Nilai Rata-rata > 80**
3. **Aktif bertanya dan membantu teman**
4. **Mood positif dan bersemangat**

### Report untuk Orang Tua

Bisa generate laporan progress otomatis:
1. Pilih siswa
2. Klik **"Generate Laporan Progress"**
3. Pilih periode (1 bulan, 1 semester)
4. Download PDF atau kirim via email

---

## 💡 Tips & Trik

### Efisiensi Waktu

**1. Gunakan Template**
- Buat template tugas untuk topik yang sering diulang
- Copy dari tugas sebelumnya, edit sedikit

**2. Batch Grading**
- Nilai tugas dalam satu sesi
- Gunakan shortcut keyboard untuk lebih cepat

**3. Jadwal Rutin**
```
Pagi (08:00-09:00): Cek dashboard, tulis laporan kemarin
Siang (12:00-13:00): Nilai tugas yang masuk pagi ini
Sore (15:00-16:00): Buat tugas baru untuk besok
```

### Motivasi Siswa

**1. Gunakan Sistem XP dengan Bijak**
- Beri bonus XP untuk usaha ekstra
- Rayakan saat siswa naik level
- Buat "leaderboard" (tapi jangan terlalu kompetitif)

**2. Feedback Positif**
- Mulai dengan hal yang baik
- Baru kasih saran perbaikan
- Akhiri dengan semangat

**3. Personalisasi**
- Ingat kesukaan setiap siswa
- Sesuaikan contoh dengan minat mereka
- Panggil nama saat memberi feedback

### Komunikasi dengan Orang Tua

**1. Proaktif**
- Jangan tunggu ada masalah baru contact
- Beri kabar baik juga, bukan hanya masalah

**2. Spesifik**
❌ "Anaknya kurang fokus"
✅ "Ahmad kesulitan fokus saat pelajaran matematika di sesi kedua (10:00-11:00). Mungkin karena lapar? Bisa bawa snack."

**3. Solutif**
- Jangan hanya lapor masalah
- Tawarkan solusi konkret
- Minta masukan orang tua

---

## 🔧 Troubleshooting

### Masalah Umum dan Solusi

#### 1. "Tidak Bisa Upload File Tugas"

**Kemungkinan Penyebab**:
- File terlalu besar (> 10 MB)
- Format file tidak didukung
- Koneksi internet lambat

**Solusi**:
1. Kompres file PDF menggunakan tools online
2. Pastikan format: PDF, JPG, PNG
3. Coba upload saat koneksi stabil
4. Alternatif: Bagikan link Google Drive

#### 2. "Siswa Tidak Menerima Notifikasi"

**Solusi**:
1. Minta siswa cek email (termasuk spam)
2. Pastikan siswa sudah login ke sistem
3. Cek status tugas: Harus "Published", bukan "Draft"

#### 3. "Data Progress Tidak Update"

**Solusi**:
1. Refresh halaman (F5)
2. Clear browser cache
3. Logout dan login kembali
4. Hubungi admin jika masih error

#### 4. "Lupa Password"

**Solusi**:
1. Klik "Lupa Password?" di halaman login
2. Masukkan email
3. Cek email untuk link reset
4. Buat password baru

#### 5. "Tugas Tidak Muncul di Dashboard Siswa"

**Checklist**:
- ☐ Tugas sudah di-publish (bukan draft)?
- ☐ Kelas yang dipilih sudah benar?
- ☐ Tanggal deadline belum lewat?
- ☐ Siswa sudah enroll di kelas tersebut?

---

## 📞 Bantuan & Support

### Kontak Support

**Email**: support@edu-lms.com  
**WhatsApp**: +62-XXX-XXXX-XXXX (jam kerja)  
**Response Time**: Max 24 jam (hari kerja)

### Sumber Belajar

**Video Tutorial**: [Link YouTube - TBD]  
**FAQ Lengkap**: [Link Website - TBD]  
**Forum Komunitas**: [Link Discord/Telegram - TBD]

### Request Fitur Baru

Punya ide fitur yang bisa membantu?
1. Email ke: feature-request@edu-lms.com
2. Jelaskan fitur yang diinginkan
3. Kenapa fitur itu penting
4. Tim akan review dan beri feedback

---

## 🎓 Penutup

Terima kasih telah menggunakan EDU LMS! 

Sistem ini dibuat khusus untuk membantu Anda memberikan pendidikan terbaik bagi anak berkebutuhan khusus. Setiap feedback dan saran Anda sangat berarti untuk pengembangan sistem ini.

**Mari bersama-sama menciptakan pembelajaran yang lebih baik!** 💙

---

**Versi Panduan**: 1.0  
**Terakhir Diperbarui**: 12 Maret 2026  
**Update Berikutnya**: Setelah pilot launch (DAY 20)

*Selamat mengajar! 👨‍🏫📚*
