# 🎓 TRAINING MATERIALS - PILOT LAUNCH
**EDU LMS - Sistem Manajemen Pembelajaran**  
**Training Session Guide**  
**Versi**: 1.0  
**Terakhir Diperbarui**: 12 Maret 2026

---

## 📖 Table of Contents

1. [Training Overview](#training-overview)
2. [Preparation Checklist](#preparation-checklist)
3. [Session Agenda (30 minutes)](#session-agenda)
4. [Demo Script - Teacher](#demo-script---teacher)
5. [Demo Script - Student](#demo-script---student)
6. [Demo Script - Parent](#demo-script---parent)
7. [Q&A Preparation](#qa-preparation)
8. [Feedback Collection](#feedback-collection)
9. [Follow-up Plan](#follow-up-plan)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🎯 Training Overview

### Purpose

Onboard 5-8 pilot users to EDU LMS and ensure they can:
- ✅ Login to the system
- ✅ Navigate the dashboard
- ✅ Perform key actions (create assignment, submit work, view reports)
- ✅ Understand the gamification system
- ✅ Know where to get help

### Target Audience

**Pilot Users**:
- 2-3 Teachers
- 5-8 Students (ABK - Anak Berkebutuhan Khusus)
- 5-8 Parents

### Training Format

- **Duration**: 30 minutes live demo + 15 minutes Q&A
- **Method**: Live demo via Zoom/Google Meet + hands-on practice
- **Materials**: User guides, demo accounts, cheat sheets
- **Support**: Trainer + 1 technical assistant

### Success Criteria

✅ All participants can login  
✅ Teachers can create 1 assignment  
✅ Students can submit 1 assignment  
✅ Parents can view child's progress  
✅ Satisfaction score > 4/5

---

## ✅ Preparation Checklist

### 1 Week Before Training

**Technical Setup**:
- [ ] Verify all services are running (Backend, Frontend, Database)
- [ ] Create demo accounts (2 teachers, 8 students, 8 parents)
- [ ] Seed sample data (1 classroom, 2 assignments, some reports)
- [ ] Test all features end-to-end
- [ ] Setup screen recording for reference video

**Materials Preparation**:
- [ ] Print user guides (Teacher, Student, Parent)
- [ ] Prepare quick reference cards (1-page cheat sheet)
- [ ] Create PowerPoint/Keynote presentation
- [ ] Prepare demo script
- [ ] Setup Zoom/Google Meet room with recording enabled

**Communication**:
- [ ] Send calendar invite with Zoom link
- [ ] Send reminder 3 days before
- [ ] Send account credentials 1 day before
- [ ] Send pre-training survey (optional)

### 1 Day Before Training

**Final Checks**:
- [ ] Test Zoom/Meet connection and screen sharing
- [ ] Verify all demo accounts work
- [ ] Prepare backup internet connection
- [ ] Test microphone and camera
- [ ] Have phone numbers of all participants (for SMS backup)

**Setup Environment**:
- [ ] Open all necessary tabs:
  - Teacher account (browser 1)
  - Student account (browser 2 / incognito)
  - Parent account (browser 3 / incognito)
  - GraphQL Playground (for debugging)
- [ ] Clear browser cache
- [ ] Test recording software

### Day of Training (1 Hour Before)

- [ ] Coffee/water ready ☕
- [ ] Phone on silent 📵
- [ ] Close unnecessary apps
- [ ] Do a final run-through
- [ ] Start Zoom room 15 minutes early for tech checks
- [ ] Welcome early arrivals and help with login

---

## 📅 Session Agenda (30 minutes)

### Timing Breakdown

```
00:00 - 00:05  →  Welcome & Introduction (5 min)
00:05 - 00:07  →  System Overview (2 min)
00:07 - 00:17  →  Teacher Demo (10 min)
00:17 - 00:22  →  Student Demo (5 min)
00:22 - 00:27  →  Parent Demo (5 min)
00:27 - 00:30  →  Key Points Recap (3 min)
00:30 - 00:45  →  Q&A Session (15 min)
00:45 - 00:50  →  Hands-on Practice (5 min)
00:50 - 01:00  →  Feedback & Closing (10 min)
```

### Detailed Agenda

#### 00:00 - 00:05: Welcome & Introduction (5 min)

**Script**:
```
"Selamat datang! Terima kasih sudah bergabung di training 
EDU LMS hari ini.

Nama saya [Nama], dan saya akan memandu training selama 
30 menit ini.

EDU LMS adalah sistem pembelajaran online yang dirancang 
khusus untuk Anak Berkebutuhan Khusus (ABK). Sistem ini 
dibuat untuk memudahkan:
- Guru dalam mengelola tugas dan nilai
- Siswa dalam mengerjakan dan melacak progress
- Orang tua dalam memantau perkembangan anak

Hari ini kita akan:
1. Melihat demo lengkap dari 3 perspektif (Guru, Siswa, Orang Tua)
2. Praktek langsung menggunakan akun demo
3. Sesi tanya jawab

Jangan ragu untuk bertanya kapan pun! 
Apakah semuanya sudah bisa melihat screen saya dengan jelas?
Bagus! Mari kita mulai."
```

**Actions**:
- ✅ Share screen (show EDU LMS homepage)
- ✅ Quick poll: "Apakah semua sudah pernah pakai sistem online learning sebelumnya?"

---

#### 00:05 - 00:07: System Overview (2 min)

**Script**:
```
"Mari kita lihat gambaran besar sistem ini dulu.

[Show architecture diagram or homepage]

EDU LMS punya 3 role utama:

1. GURU (Teacher)
   - Membuat dan mengelola tugas
   - Menilai pekerjaan siswa
   - Menulis laporan harian
   
2. SISWA (Student)
   - Melihat tugas
   - Mengerjakan dan mengumpulkan tugas
   - Tracking XP dan level (seperti game!)
   
3. ORANG TUA (Parent)
   - Memantau progress anak
   - Membaca laporan dari guru
   - Melihat nilai dan statistik

Semua data ter-sinkronisasi real-time. 
Jadi begitu guru publish tugas, siswa langsung bisa lihat.
Begitu siswa submit, guru langsung dapat notifikasi.

Sekarang, mari kita mulai dari perspektif Guru."
```

**Visual**: Show homepage or simple diagram

---

## 👨‍🏫 Demo Script - Teacher

### Time: 00:07 - 00:17 (10 minutes)

#### Step 1: Login (1 min)

**Script**:
```
"Saya akan demo sebagai Bu Siti, seorang guru Matematika.

[Go to login page]

Setiap user punya email dan password unik.
Format email: [role]@lms-abk.com

Email: guru1@lms-abk.com
Password: teacher123

[Type and click Login]

Setelah login, kita langsung masuk ke Dashboard Guru."
```

**Actions**:
- Navigate to: `https://edu-lms.vercel.app`
- Type credentials slowly and clearly
- Click "Masuk" button

---

#### Step 2: Dashboard Tour (2 min)

**Script**:
```
"Ini adalah Dashboard Guru. 
Mari kita lihat apa saja yang ada di sini.

[Point to each section]

1. BAGIAN ATAS: Nama saya dan menu navigasi
   
2. STATISTIK:
   - Saya mengajar 25 siswa
   - Di 3 kelas berbeda
   - Ada 8 tugas yang menunggu untuk dinilai

3. DAFTAR KELAS:
   - Kelas 1A - Matematika (12 siswa)
   - Kelas 1B - Matematika (13 siswa)
   
4. PENDING GRADING:
   - Tugas yang perlu saya nilai segera
   
5. RECENT REPORTS:
   - Laporan harian yang baru-baru ini saya tulis

Semua ini ter-update otomatis setiap hari.
Praktis kan?"
```

**Visual**: Hover mouse over each section slowly

---

#### Step 3: Create Assignment (4 min)

**Script**:
```
"Sekarang, saya akan membuat tugas baru untuk siswa.

[Click 'Buat Tugas Baru' or go to Assignment menu]

Ada beberapa field yang perlu diisi:

1. JUDUL TUGAS:
   'Latihan Penjumlahan 1-20'
   
2. KELAS:
   [Select 'Kelas 1A - Matematika']
   Ini penting! Tugas hanya akan muncul untuk siswa 
   di kelas yang dipilih.
   
3. DESKRIPSI:
   'Latihan penjumlahan untuk angka 1 sampai 20'
   
4. INSTRUKSI DETAIL:
   'Kerjakan 10 soal di lembar kerja yang sudah 
   dibagikan. Foto hasil pekerjaan dan upload.'
   
5. DEADLINE:
   [Set to 3 days from now]
   Siswa bisa lihat countdown nya sendiri.
   
6. NILAI MAKSIMAL:
   100 (standar)
   
7. XP REWARD:
   50 XP
   Ini bonus untuk gamifikasi. Siswa suka!
   
8. LAMPIRAN (Opsional):
   [Click 'Upload File']
   Saya bisa upload PDF soal, gambar panduan, dll.
   Max 10MB.

[Fill all fields]

Ada 2 pilihan:

- 'SIMPAN SEBAGAI DRAFT': 
  Tugas belum terlihat siswa, saya bisa edit lagi.
  
- 'PUBLIKASIKAN':
  Tugas langsung terlihat siswa dan bisa dikerjakan.

Untuk sekarang, saya akan langsung publikasikan.

[Click 'Publikasikan']

✅ Berhasil! Tugas sudah dibuat dan siswa sudah bisa 
   melihatnya sekarang.
```

**Actions**:
- Navigate to "Buat Tugas Baru"
- Fill each field slowly (with pauses for explanation)
- Show Draft vs Publish difference
- Click "Publikasikan"
- Show success message

---

#### Step 4: View Submissions & Grade (2 min)

**Script**:
```
"Setelah siswa mengumpulkan tugas, saya perlu menilai.

Mari kita lihat contoh tugas yang sudah dikumpulkan.

[Go to 'Pending Grading' or click existing assignment]

[Click on a student submission]

Ini tampilan penilaian:

1. INFORMASI SISWA:
   - Nama: Ahmad Fauzi
   - Dikumpulkan: 18 Maret 2026, 14:30
   - Status: Tepat Waktu ✅
   
2. JAWABAN SISWA:
   [Show uploaded files/photos]
   Saya bisa download dan lihat detail.
   
3. FORM PENILAIAN:
   - Nilai (0-100): 85
   - Feedback untuk siswa: 
     'Bagus! 8 dari 10 benar. 
     Perhatikan soal nomor 3 dan 7 ya.'
     
4. XP OTOMATIS DIHITUNG:
   (85/100) × 50 XP = 42.5
   + Bonus tepat waktu 10% = 4.7
   Total: 47 XP

[Click 'Submit Nilai']

✅ Siswa akan langsung mendapat notifikasi!
```

**Actions**:
- Navigate to pending submissions
- Click one submission
- Show grading interface
- Enter score and feedback
- Show XP calculation
- Submit grade

---

#### Step 5: Daily Report (1 min)

**Script**:
```
"Fitur unik dari EDU LMS adalah Daily Report.

Setiap hari, saya bisa tulis laporan singkat untuk 
orang tua tentang:
- Kehadiran siswa (Hadir/Sakit/Izin)
- Mood siswa (Senang/Sedih/Bersemangat/Lelah)
- Aktivitas hari ini
- Saran untuk orang tua

[Navigate to 'Tulis Laporan Harian']

Ini penting untuk ABK karena orang tua perlu tahu 
perkembangan harian anak mereka.

[Show form briefly, don't fill - for time]

Kita skip detail nya untuk sekarang. 
Ada panduan lengkap di User Guide nanti."
```

---

## 👦 Demo Script - Student

### Time: 00:17 - 00:22 (5 minutes)

#### Step 1: Student Login (1 min)

**Script**:
```
"Sekarang, saya akan ganti role menjadi SISWA.

[Open new incognito window or different browser]
[Go to login page]

Saya akan login sebagai Ahmad, siswa di Kelas 1A.

Email: siswa1@lms-abk.com
Password: student123

[Login]

Ini dashboard siswa. Lebih sederhana dan ramah anak!
Ada emoji, warna-warni, dan gamifikasi!"
```

---

#### Step 2: Student Dashboard (1 min)

**Script**:
```
"Dashboard siswa menampilkan:

1. GREETING:
   'Halo, Ahmad!' 👋
   
2. LEVEL & XP:
   Level 5 ⭐⭐⭐⭐⭐
   XP: 1,250
   Progress bar ke Level 6: 65%
   
   Ini seperti game! Siswa termotivasi untuk 
   kumpulkan XP.
   
3. STATISTIK:
   - Tugas aktif: 3
   - Tugas selesai: 18/20 (90%)
   - Nilai rata-rata: 85.5
   - Streak: 7 hari berturut-turut! 🔥
   
4. TUGAS YANG PERLU DIKERJAKAN:
   Ada list tugas dengan countdown deadline.

Simple dan mudah untuk anak-anak."
```

---

#### Step 3: View & Submit Assignment (3 min)

**Script**:
```
"Sekarang Ahmad akan mengerjakan tugas yang 
baru saja kita buat tadi.

[Click task 'Latihan Penjumlahan 1-20']

Detail tugas:
- Judul: Latihan Penjumlahan 1-20
- Dari: Bu Siti
- Deadline: 2 hari lagi
- Reward: 50 XP

[Scroll to instructions]

Instruksi jelas terlihat. 
Kalau ada file soal, ada tombol 'Download Soal'.

Sekarang Ahmad akan submit tugas:

[Click 'Kerjakan Sekarang']

Form submission:
1. Upload file (foto pekerjaan):
   [Click 'Upload Jawaban']
   [Select demo file]
   Bisa upload multiple files.
   
2. Keterangan (opsional):
   'Bu, saya sudah kerjakan semua. 
   Tapi nomor 7 agak bingung.'
   
[Click 'Kirim Tugas']

✅ Berhasil dikumpulkan!

Sekarang Ahmad tinggal tunggu Bu Siti nilai.
Notifikasi akan dikirim via email."
```

**Actions**:
- Click assignment
- Show detailed view
- Click "Kerjakan Sekarang"
- Upload demo file (have one ready!)
- Add note
- Submit
- Show success message

---

## 👨‍👩‍👧 Demo Script - Parent

### Time: 00:22 - 00:27 (5 minutes)

#### Step 1: Parent Login (1 min)

**Script**:
```
"Terakhir, perspektif ORANG TUA.

[Open another incognito window or browser]

Saya akan login sebagai Bapak Santoso, 
orang tua dari Ahmad.

Email: ortu1@lms-abk.com
Password: parent123

[Login]

Dashboard orang tua fokus pada MONITORING."
```

---

#### Step 2: Parent Dashboard Tour (2 min)

**Script**:
```
"Dashboard orang tua menampilkan:

1. RINGKASAN ANAK:
   'Anak Anda: Ahmad Fauzi'
   'Kelas: 1A'
   
2. PROGRESS OVERVIEW:
   - Level: 5 (1,250 XP)
   - Rata-rata nilai: 85.5
   - Tugas selesai: 18/20 (90%)
   - Tingkat ketepatan: 95%
   - Streak: 7 hari berturut-turut
   
3. LAPORAN HARIAN TERBARU:
   [Show latest daily report card]
   
   Ini sangat penting!
   Orang tua bisa baca observasi guru setiap hari.
   
4. NOTIFIKASI:
   - 2 tugas deadline dalam 3 hari
   - 1 tugas sudah dinilai

Orang tua bisa aware tanpa perlu tanya anak 
terus-menerus."
```

---

#### Step 3: View Progress Detail (2 min)

**Script**:
```
"Mari kita klik menu 'Progress' untuk detail.

[Click 'Progress' menu]

Di sini orang tua bisa lihat:

1. GRAFIK NILAI:
   [Show line chart]
   Trend naik! Bagus! 📈
   
2. BREAKDOWN PER MATA PELAJARAN:
   - Matematika: 87.5 (naik +5)
   - Bahasa Indonesia: 85.0 (stabil)
   - Seni: 90.0 (naik +10)
   
3. STATISTIK TUGAS:
   - 90% completion rate
   - 94% on-time submission
   
4. LEVEL & XP:
   Progress ke Level 6: 65%
   
[Click on a graded assignment]

Detail nilai:
- Score: 85/100
- XP earned: +47 XP
- Feedback dari guru:
  'Bagus! 8 dari 10 benar...'
  
Orang tua bisa lihat feedback detail dari guru.

[Back to menu]

[Click 'Laporan' menu]

Semua laporan harian tersimpan di sini.
Orang tua bisa filter by date, mood, attendance.
Bahkan bisa export ke PDF untuk rekam medis."
```

**Actions**:
- Navigate to Progress page
- Show graphs and stats
- Click on assignment detail
- Navigate to Laporan page
- Show filter options

---

## 🔄 Key Points Recap

### Time: 00:27 - 00:30 (3 minutes)

**Script**:
```
"Baik, mari kita recap poin-poin penting:

UNTUK GURU:
✓ Login → Dashboard
✓ Buat tugas (bisa draft atau langsung publish)
✓ Nilai tugas (auto calculate XP)
✓ Tulis laporan harian

UNTUK SISWA:
✓ Login → Dashboard (lihat XP & Level)
✓ Lihat daftar tugas
✓ Download soal → Kerjakan → Upload foto
✓ Cek nilai dan feedback

UNTUK ORANG TUA:
✓ Login → Lihat ringkasan anak
✓ Baca laporan harian dari guru
✓ Tracking progress dengan grafik
✓ Lihat detail nilai per tugas

Semuanya REAL-TIME dan OTOMATIS ter-sinkronisasi.

User Guide lengkap sudah saya share di chat.
Ada 3 file:
- USER-GUIDE-TEACHER.md
- USER-GUIDE-STUDENT.md
- USER-GUIDE-PARENT.md

Silakan download dan baca nanti ya.

Sekarang, ada pertanyaan?"
```

---

## ❓ Q&A Preparation

### Time: 00:30 - 00:45 (15 minutes)

### Anticipated Questions & Answers

#### General Questions

**Q: Apakah sistem ini gratis?**  
A: Untuk pilot phase (1-2 bulan pertama) GRATIS. Setelah itu kami akan tawarkan subscription plan yang affordable untuk sekolah.

**Q: Apakah data aman?**  
A: Ya, sangat aman. Kami gunakan:
- Enkripsi SSL/TLS untuk semua data transfer
- Password di-hash (tidak disimpan plaintext)
- Database di-backup otomatis setiap hari
- Compliant dengan regulasi privasi data

**Q: Kalau internet mati gimana?**  
A: Sistem butuh internet untuk akses. Tapi, kami sudah optimasi agar bisa jalan di koneksi lambat sekalipun. Untuk daerah dengan internet unstable, kami sarankan:
- Download soal saat internet ada
- Kerjakan offline
- Upload saat internet available lagi

**Q: Bisa diakses pakai HP?**  
A: Bisa! Web kami responsive, bisa dibuka di HP, tablet, atau laptop. Tapi untuk guru yang perlu banyak ketik, lebih nyaman pakai laptop.

---

#### Teacher Questions

**Q: Berapa banyak tugas yang bisa saya buat?**  
A: Unlimited. Tidak ada batasan jumlah tugas.

**Q: Kalau saya salah publish tugas, bisa dihapus?**  
A: Bisa! Tapi kalau sudah ada siswa yang submit, lebih baik EDIT daripada delete. Atau buat tugas baru sebagai revisi.

**Q: Bisakah saya copy tugas dari semester lalu?**  
A: Fitur "Duplicate Assignment" sedang dalam development. Untuk sekarang, Anda perlu buat baru. Tapi bisa copy-paste teks dari tugas lama.

**Q: Gimana kalau siswa submit terlambat?**  
A: Sistem otomatis tandai "LATE". XP tidak dapat bonus tepat waktu. Tapi guru tetap bisa nilai. Terserah kebijakan guru, mau kasih nilai penuh atau potong atau tidak.

**Q: Format file apa saja yang bisa di-upload?**  
A: 
- Dokumen: PDF
- Gambar: JPG, JPEG, PNG
- Max size: 10MB per file
- Multiple files: Ya, bisa upload lebih dari 1 file

**Q: Berapa lama waktu menilai 1 tugas?**  
A: Rata-rata 2-3 menit per tugas (lihat jawaban, beri nilai, tulis feedback singkat). Untuk 25 siswa, estimasi 1 jam.

---

#### Student Questions

**Q: Kalau saya lupa password gimana?**  
A: Klik "Lupa Password?" di halaman login. Nanti ada email untuk reset. Atau minta bantuan guru/orang tua.

**Q: XP untuk apa?**  
A: XP untuk naik level! Semakin tinggi level kamu, semakin keren badge nya. Nanti juga ada leaderboard (ranking) per kelas. Tapi yang penting, XP = kamu belajar dengan baik!

**Q: Kalau foto hasil pekerjaan blur, gimana?**  
A: Coba foto ulang dengan:
- Cahaya cukup terang
- Kamera tidak goyang
- Jarak pas (tidak terlalu jauh/dekat)
- Fokus pada kertas
Kalau masih blur, minta tolong orang tua foto-in.

**Q: Bisa gak ngerjain tugas bareng teman?**  
A: Boleh DISKUSI bareng teman. Tapi JAWABAN harus dari pemikiran kamu sendiri. Jangan copy-paste jawaban teman. Itu namanya menyontek!

---

#### Parent Questions

**Q: Seberapa sering orang tua perlu cek system?**  
A: Ideal nya setiap hari 5-10 menit (cek laporan harian). Minimal seminggu sekali cek progress detail.

**Q: Kalau saya tidak puas dengan nilai anak, bisa komplain?**  
A: Bisa hubungi guru untuk diskusi. Tapi ingat, nilai adalah evaluasi objektif dari guru. Yang terpenting adalah proses belajar anak, bukan hanya angka.

**Q: Bisakah saya chat dengan guru di sistem?**  
A: Fitur chat masih dalam development. Untuk sekarang, komunikasi via email atau WhatsApp. Kontak guru ada di profil nya.

**Q: Laporan harian ditulis setiap hari?**  
A: Seharusnya ya, tapi tergantung workload guru. Minimal 3x per minggu. Kalau ada hari yang tidak ada laporan, tidak masalah.

**Q: Data anak saya bisa dilihat orang lain?**  
A: TIDAK. Setiap orang tua hanya bisa lihat data anak mereka sendiri. Sangat private. Bahkan guru lain yang tidak mengajar anak Anda tidak bisa lihat.

---

## 📊 Feedback Collection

### Time: 00:45 - 00:50 (During hands-on)

### Exit Survey

Send survey link via chat or email:

**Questions (1-5 rating):**

1. Seberapa mudah sistem ini digunakan?
   ⭐ 1 - 2 - 3 - 4 - 5 ⭐

2. Apakah demo training cukup jelas?
   ⭐ 1 - 2 - 3 - 4 - 5 ⭐

3. Apakah user guide membantu?
   ⭐ 1 - 2 - 3 - 4 - 5 ⭐

4. Apakah Anda merasa percaya diri menggunakan system?
   ⭐ 1 - 2 - 3 - 4 - 5 ⭐

5. Seberapa likely Anda akan rekomendasi sistem ini?
   ⭐ 1 - 2 - 3 - 4 - 5 ⭐

**Open Questions:**

6. Fitur apa yang paling Anda suka?

7. Apa yang membingungkan atau sulit?

8. Apa yang ingin ditambahkan/diubah?

9. Feedback atau saran lainnya?

### Phone Interview (Optional)

1-2 days after training, call each participant:

**Script**:
```
"Halo [Nama], ini [Trainer] dari EDU LMS.

Saya mau quick check-in setelah training kemarin.

Sudah coba pakai sistemnya?
[Ya/Belum]

[If Ya]
Ada kesulitan atau pertanyaan?
Apa yang paling helpful?
Ada feedback untuk kami?

[If Belum]
Ada yang menghalangi? 
Butuh bantuan untuk setup?

Kami siap support kapan pun. 
Jangan ragu untuk hubungi ya!

Terima kasih!
```

---

## 🔄 Follow-up Plan

### Day 1-3 After Training

**Immediate Support**:
- ✅ Send thank you email with resources
- ✅ Share screen recording of training session
- ✅ Provide direct support contact (WhatsApp/Phone)
- ✅ Check if everyone has logged in at least once
- ✅ Remind teachers to create 1 assignment
- ✅ Remind students to check dashboard daily

**Email Template**:
```
Subject: Terima Kasih - EDU LMS Training

Dear All,

Terima kasih sudah bergabung di training EDU LMS kemarin!

Berikut resources yang bisa Anda akses:
- Recording training: [YouTube Link]
- User Guides: [Google Drive Link]
- Quick Reference Card: [PDF Link]

NEXT STEPS:
Guru: Buat 1 assignment dan publish untuk siswa
Siswa: Login dan kerjakan 1 tugas dari guru
Orang Tua: Login dan lihat dashboard anak

Kalau ada pertanyaan, hubungi:
WhatsApp: +62-XXX-XXXX-XXXX
Email: support@edu-lms.com

Kami siap membantu! 💙

Best regards,
EDU LMS Team
```

---

### Day 4-7 After Training

**Check Progress**:
- ✅ Review usage logs (who logged in, how often)
- ✅ Check if teachers created assignments
- ✅ Check if students submitted work
- ✅ Check if parents viewed progress
- ✅ Identify inactive users
- ✅ Reach out to inactive users personally

**Proactive Support**:
- Send tips & tricks email
- Share success stories
- Remind about features they haven't used
- Offer 1-on-1 help session for those struggling

---

### Week 2-4 After Training

**Ongoing Support**:
- Weekly check-in email
- Optional weekly Q&A session (Zoom)
- Collect feedback continuously
- Iterate based on feedback
- Prepare for full rollout

**Milestone Tracking**:
```
Week 1: 
□ 100% login rate
□ 80% teacher created assignment
□ 60% student submitted work
□ 40% parent viewed dashboard

Week 2:
□ Daily active users: 70%
□ Average assignments per teacher: 2
□ Average submissions per student: 2
□ Average parent logins per week: 3

Week 4:
□ Satisfaction score: 4+/5
□ System uptime: 99%+
□ Support tickets resolved: <24h
□ Ready for full rollout
```

---

## 🛠️ Troubleshooting Guide

### Common Issues During Training

#### Issue 1: Can't Login

**Symptoms**: "Email or password incorrect"

**Solutions**:
1. Check email format (all lowercase, no typos)
2. Check password (case-sensitive)
3. Try "Forgot Password?" flow
4. Clear browser cache
5. Try different browser
6. Last resort: Admin reset password

**Prevention**:
- Send credentials 1 day before with clear instructions
- Ask participants to test login before training day

---

#### Issue 2: Slow Loading

**Symptoms**: Pages load very slowly or timeout

**Solutions**:
1. Check internet speed (speedtest.net)
2. Close unnecessary tabs/apps
3. Try different network (switch to mobile data)
4. Reduce browser extensions
5. Check server status (status.edu-lms.com)

**Prevention**:
- Test server load before training
- Have backup demo account on staging server
- Recommend minimum internet speed (2 Mbps)

---

#### Issue 3: Upload File Failed

**Symptoms**: "Upload failed" or file not appearing

**Solutions**:
1. Check file size (<10MB)
2. Check file format (PDF, JPG, PNG only)
3. Check internet connection
4. Try compress file first
5. Try different file

**Prevention**:
- Have sample files ready to share
- Clearly communicate file restrictions
- Test upload flow before training

---

#### Issue 4: Zoom/Audio Issues

**Symptoms**: Can't hear trainer, video freezing

**Solutions**:
1. Check Zoom audio settings
2. Switch to phone dial-in audio
3. Ask participant to restart Zoom
4. Switch to mobile app
5. Record session so they can watch later

**Prevention**:
- Start room 15 minutes early for tech checks
- Send Zoom test link before training day
- Have backup communication (WhatsApp group)

---

#### Issue 5: Confusion About Features

**Symptoms**: "I don't understand how to..."

**Solutions**:
1. Slow down and repeat demo
2. Share screen recording link
3. Offer 1-on-1 session after training
4. Point to specific section in user guide
5. Create short video tutorial for that feature

**Prevention**:
- Practice demo script beforehand
- Use simple language (no jargon)
- Check for understanding frequently ("Ada yang bingung?")
- Allow time for questions

---

## 📝 Post-Training Checklist

### Immediately After Training

- [ ] Stop recording and save video
- [ ] Collect all chat messages (questions, feedback)
- [ ] Export participant list with attendance
- [ ] Send follow-up email within 2 hours
- [ ] Update user accounts (reset demo data if needed)
- [ ] Document issues encountered
- [ ] Note suggestions for improvement

### Within 24 Hours

- [ ] Upload recording to YouTube/Drive
- [ ] Send recording link to all participants
- [ ] Transcribe Q&A session
- [ ] Update FAQ based on questions asked
- [ ] Personal message to participants who seemed confused
- [ ] Thank you message to co-trainer/assistant

### Within 1 Week

- [ ] Analyze feedback survey results
- [ ] Review usage logs
- [ ] Identify power users vs. struggling users
- [ ] Schedule follow-up calls with inactive users
- [ ] Prepare Week 2 support email
- [ ] Update training materials based on lessons learned
- [ ] Plan for next training session (if needed)

---

## 🎯 Success Metrics

### Quantitative Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Training attendance rate | 100% | Zoom participant list |
| Post-training login rate (1 week) | 90% | Backend analytics |
| Average satisfaction score | 4+/5 | Exit survey |
| Teachers created ≥1 assignment | 100% | Database query |
| Students submitted ≥1 assignment | 80% | Database query |
| Parents viewed dashboard | 60% | Analytics |
| Support tickets <24h response | 100% | Support system |

### Qualitative Metrics

✅ Participants feel confident using the system  
✅ Participants understand the value proposition  
✅ Positive feedback about usability  
✅ Minimal confusion about core features  
✅ Willingness to continue using after pilot

---

## 💡 Tips for Trainers

### Do's

✅ **Speak Slowly and Clearly** - Participants are learning, not rushing  
✅ **Use Simple Language** - Avoid technical jargon  
✅ **Check for Understanding** - "Apakah semua jelas?" frequently  
✅ **Show Empathy** - "Saya tahu ini banyak informasi, tapi tenang..."  
✅ **Celebrate Small Wins** - "Bagus! Anda sudah berhasil login!"  
✅ **Be Patient** - Especially with parents/teachers not tech-savvy  
✅ **Have Backup Plans** - If demo breaks, have screenshots ready  
✅ **Record Everything** - For participants who miss or want to re-watch

### Don'ts

❌ **Rush Through Demo** - Speed kills learning  
❌ **Use Jargon** - "API", "GraphQL", "Backend" → confusing  
❌ **Blame Users** - "You should have..." → discouraging  
❌ **Skip Q&A** - Questions = engagement  
❌ **Ignore Technical Issues** - Address them or acknowledge  
❌ **Overpromise Features** - Be honest about what's available  
❌ **Forget to Follow Up** - Training is just the start

---

## 📚 Additional Resources

### For Trainers

- **Training Script**: This document
- **Demo Accounts**: credentials.txt (keep secure!)
- **Sample Data**: seed.sql
- **Presentation Slides**: training-slides.pdf
- **Quick Reference Card**: quick-ref-card.pdf

### For Participants

- **User Guides**:
  - USER-GUIDE-TEACHER.md (40 pages)
  - USER-GUIDE-STUDENT.md (30 pages)
  - USER-GUIDE-PARENT.md (25 pages)
- **API Documentation**: API-DOCUMENTATION.md (50 pages)
- **Video Tutorials**: [YouTube Playlist - TBD]
- **FAQ**: [Website - TBD]

---

## 🎉 Closing

### Final Message to Participants

**Script**:
```
"Terima kasih semuanya sudah mengikuti training dengan 
antusias!

Ingat, ini adalah PILOT phase. Kami sangat menghargai 
feedback Anda. Kalau ada bug, error, atau saran, 
PLEASE kasih tau kami.

Anda semua adalah pioneer yang membantu kami membuat 
sistem ini lebih baik untuk seluruh komunitas ABK 
di Indonesia.

Mari kita bersama-sama ciptakan pengalaman pembelajaran 
yang lebih baik untuk anak-anak kita.

Support kami available 24/7 via:
- WhatsApp: +62-XXX-XXXX-XXXX
- Email: support@edu-lms.com

Jangan ragu untuk hubungi!

Selamat mencoba dan sampai jumpa!

Terima kasih! 🙏💙"
```

---

**Version**: 1.0  
**Last Updated**: 12 Maret 2026  
**Prepared by**: EDU LMS Team

*Let's Make Learning Better Together! 🎓✨*
