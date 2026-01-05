# 🖥️ PionShare — WebRTC Screen Sharing & Chat

![Go Version](https://img.shields.io/badge/Go-1.20%2B-00ADD8?style=flat&logo=go)
![WebRTC](https://img.shields.io/badge/WebRTC-Real--Time-333333?style=flat&logo=webrtc)
![License](https://img.shields.io/badge/License-MIT-green)

**PionShare** adalah aplikasi **real-time screen sharing satu-ke-satu (1–1)** yang dibangun menggunakan **WebRTC di browser** dan **Golang (Pion)** sebagai signaling server. Aplikasi ini juga dilengkapi dengan fitur **chat teks** menggunakan WebRTC DataChannel.

> 🎓 **Project Note:** Project ini dibuat untuk memenuhi tugas mata kuliah **Pemrograman Jaringan**.

---

## ✨ Fitur Utama

- 🖥️ **Screen Sharing Real-time:** Berbagi layar antar peer (1-on-1).
- 💬 **Text Chat:** Kirim pesan instan tanpa server database (via DataChannel).
- 📡 **Golang Signaling:** Server ringan menggunakan library Pion.
- 🌐 **No WebSocket:** Menggunakan mekanisme HTTP POST + Server-Sent Events (SSE).
- 🧪 **Educational:** Kode yang bersih dan cocok untuk mempelajari dasar WebRTC.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), WebRTC API (`RTCPeerConnection`, `getDisplayMedia`) |
| **Backend** | Golang (Go), Pion WebRTC |
| **Protokol** | Server-Sent Events (SSE) untuk signaling |

---

## 📂 Struktur Folder

```text
PionShare/
├── server/
│   └── main.go          # Signaling server (Go + SSE Logic)
│
├── static/
│   ├── index.html       # Antarmuka Pengguna (UI)
│   ├── client.js        # Logika WebRTC (Offer, Answer, ICE)
│   └── style.css        # Styling aplikasi
│
├── go.mod               # Go module definition
└── README.md            # Dokumentasi project

▶️ Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.
1️⃣ Prasyarat

Pastikan Go (Golang) versi 1.20 atau lebih baru sudah terinstall.
Bash

go version

2️⃣ Jalankan Server

Buka terminal di root folder project, lalu jalankan perintah berikut:
Bash

# Masuk ke direktori project (sesuaikan dengan lokasi folder Anda)
cd PionShare

# Jalankan server
go run ./server

Jika berhasil, Anda akan melihat log:
Plaintext

Starting signaling server at :8080

3️⃣ Akses Aplikasi

Buka browser (disarankan Google Chrome atau Microsoft Edge), lalu kunjungi: 👉 http://localhost:8080/
🎮 Cara Menggunakan

Untuk mensimulasikan koneksi antar dua user:

    Buka 2 Tab Browser (atau 2 window berbeda).

    Pastikan kedua tab berada di alamat http://localhost:8080/.

    Setup Room:

        Masukkan Room Name yang sama di kedua tab (contoh: RoomA).

        Gunakan User ID yang berbeda (contoh: User1 di tab kiri, User2 di tab kanan).

    Mulai Sharing:

        Tab 1: Klik tombol 🎥 Share Screen.

        Tab 2: Klik tombol 👀 Join as Viewer.

    Hasil: Layar dari Tab 1 akan muncul di Tab 2.

    Chat: Ketik pesan di kolom chat untuk berkomunikasi secara real-time.

🧠 Cara Kerja (Architecture)

Aplikasi ini menggunakan topologi Peer-to-Peer (P2P):

    Signaling: Browser A dan Browser B bertukar informasi koneksi (SDP Offer/Answer & ICE Candidates) melalui server Golang menggunakan HTTP Post dan SSE.

    P2P Connection: Setelah sinyal bertukar, koneksi langsung terbentuk antar browser.

    Media Stream: Video/Layar dikirim langsung antar browser tanpa melewati server.

    Data Channel: Pesan teks dikirim lewat jalur data WebRTC yang aman dan cepat.

⚠️ Catatan Penting

    [!WARNING] Project ini ditujukan untuk pembelajaran (Educational Purpose).

Untuk penggunaan di lingkungan produksi (Production), Anda perlu menambahkan:

    🔐 HTTPS: Wajib untuk akses API getDisplayMedia di jaringan publik (bukan localhost).

    🔁 TURN Server: Diperlukan jika user berada di balik NAT/Firewall ketat.

    👤 Authentication: Sistem login user yang aman.

👤 Author
Informasi	Detail
Nama	Yosafat
Mata Kuliah	Pemrograman Jaringan
Tahun	2026
