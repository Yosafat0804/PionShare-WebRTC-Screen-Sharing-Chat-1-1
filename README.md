🖥️ PionShare — WebRTC Screen Sharing & Chat (1–1)

PionShare adalah aplikasi real-time screen sharing satu-ke-satu (1–1) yang dibangun menggunakan WebRTC di browser dan library Pion (Golang) sebagai signaling server.
Aplikasi ini juga menyediakan fitur chat teks real-time menggunakan WebRTC DataChannel.

Project ini dibuat sebagai tugas mata kuliah Pemrograman Jaringan untuk memahami konsep:

WebRTC

Peer-to-Peer Communication

Signaling Server

Server-Sent Events (SSE)

✨ Fitur Utama

📡 Screen sharing real-time (1–1)

💬 Chat teks menggunakan WebRTC DataChannel

🔄 Signaling server berbasis Golang (Pion)

🌐 Tanpa WebSocket (menggunakan SSE + HTTP POST)

🧪 Cocok untuk pembelajaran dan demonstrasi WebRTC

🛠️ Teknologi yang Digunakan

Frontend:

HTML, CSS, JavaScript

WebRTC API (RTCPeerConnection, getDisplayMedia)

Backend:

Golang

Pion WebRTC

Server-Sent Events (SSE)

📂 Struktur Folder
PionShare/
│
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

Gunakan ID berbeda untuk setiap pengguna

Di tab pertama, klik 🎥 Share Screen

Di tab kedua, klik 👀 Join as Viewer

Layar akan muncul di viewer

Gunakan fitur Chat untuk mengirim pesan

🧠 Cara Kerja Singkat

Browser menggunakan WebRTC untuk koneksi peer-to-peer

Signaling server (Go) hanya bertugas:

Mengirim SDP Offer / Answer

Mengirim ICE Candidate

Media tidak lewat server, tetapi langsung antar browser

Chat menggunakan WebRTC DataChannel

⚠️ Catatan Penting

Aplikasi ini hanya untuk pembelajaran

Untuk penggunaan produksi dibutuhkan:

🔐 HTTPS

🔁 TURN Server

👤 Authentication & Authorization

Screen sharing akan otomatis berhenti di viewer saat sharer menghentikan share

🎓 Tujuan Pembelajaran

Project ini membantu mahasiswa memahami:

Konsep WebRTC dan Peer-to-Peer

Proses signaling

Implementasi WebRTC menggunakan Pion (Golang)

Komunikasi real-time di jaringan

👤 Author

Nama: Yosafat
Mata Kuliah: Pemrograman Jaringan
Tahun: 2026
1. Install Go 1.20+
2. From project root run:

```powershell
cd "C:\Users\Yosafat\OneDrive\Dokumen\Semester 5\Pemrograman Jaringan\WebRTC Screen Sharing 1-1 + Chat Text"
go run ./server
```

3. Open two browser windows (Chrome/Edge) and visit `http://localhost:8080/`.
4. In each, choose the same room name and different `id`, then click Start in one of them to begin sharing. The other peer should receive the shared screen. Use the chat box to send messages (DataChannel preferred).

Notes:
- This simplified signaling server uses Server-Sent Events (SSE) + HTTP POST (no external Go modules required). The actual WebRTC PeerConnections run in the browsers and exchange SDP/candidates through this signaling server.
- For production you still need TURN servers, HTTPS, and authentication.
