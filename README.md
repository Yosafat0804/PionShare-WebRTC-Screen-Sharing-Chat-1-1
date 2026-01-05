# 🖥️ PionShare — WebRTC Screen Sharing & Chat (1–1)

**PionShare** adalah aplikasi **real-time screen sharing satu-ke-satu (1–1)** yang dibangun menggunakan **WebRTC di browser** dan **Golang (Pion)** sebagai signaling server.

Aplikasi ini juga menyediakan **chat teks real-time** menggunakan **WebRTC DataChannel**.

Project ini dibuat sebagai **tugas mata kuliah Pemrograman Jaringan**.

---

## ✨ Fitur Utama

- 📡 Screen sharing real-time (1–1)
- 💬 Chat teks real-time (WebRTC DataChannel)
- 🔄 Signaling server menggunakan Golang
- 🌐 Tanpa WebSocket (SSE + HTTP POST)
- 🧪 Cocok untuk pembelajaran WebRTC

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- HTML
- CSS
- JavaScript
- WebRTC API (`RTCPeerConnection`, `getDisplayMedia`)

### Backend
- Golang
- Pion WebRTC
- Server-Sent Events (SSE)

---

## 📂 Struktur Folder

```text
PionShare/
├── server/
│   └── main.go          # Signaling server (Go + SSE)
│
├── static/
│   ├── index.html       # UI utama
│   ├── client.js        # WebRTC & signaling logic
│   └── style.css        # Styling aplikasi
│
├── go.mod
└── README.md

▶️ Cara Menjalankan Aplikasi
1️⃣ Install Go

Pastikan Go versi 1.20 atau lebih baru sudah terinstall:

go version

2️⃣ Jalankan Server

Buka terminal di root project, lalu jalankan:

cd "C:\Users\Yosafat\OneDrive\Dokumen\Semester 5\Pemrograman Jaringan\PionShare"
go run ./server

Jika berhasil, akan muncul log:

Starting signaling server at :8080

3️⃣ Akses Aplikasi

Buka 2 tab browser (Chrome / Edge disarankan), lalu kunjungi:

http://localhost:8080/

4️⃣ Cara Menggunakan

    Masukkan Room name yang sama di kedua tab

    Gunakan ID yang berbeda

    Tab pertama → klik 🎥 Share Screen

    Tab kedua → klik 👀 Join as Viewer

    Layar akan muncul di viewer

    Gunakan Chat untuk mengirim pesan

🧠 Cara Kerja Singkat

    Browser membuat koneksi peer-to-peer WebRTC

    Server hanya berfungsi sebagai signaling:

        SDP Offer / Answer

        ICE Candidate

    Media tidak melewati server

    Chat menggunakan WebRTC DataChannel

⚠️ Catatan Penting

    Project ini hanya untuk pembelajaran

    Untuk produksi dibutuhkan:

        🔐 HTTPS

        🔁 TURN Server

        👤 Authentication

    Screen viewer otomatis berhenti saat sharer menghentikan share

🎓 Tujuan Pembelajaran

Project ini membantu mahasiswa memahami:

    Konsep WebRTC & Peer-to-Peer

    Proses signaling

    Implementasi WebRTC dengan Golang (Pion)

    Komunikasi real-time jaringan

👤 Author

    Nama: Yosafat

    Mata Kuliah: Pemrograman Jaringan

    Tahun: 2026
