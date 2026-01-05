# 🖥️ PionShare — WebRTC Screen Sharing & Chat

![Go Version](https://img.shields.io/badge/Go-1.20%2B-00ADD8?style=flat&logo=go)
![WebRTC](https://img.shields.io/badge/WebRTC-Real--Time-333333?style=flat&logo=webrtc)
![License](https://img.shields.io/badge/License-MIT-green)

**PionShare** adalah aplikasi **real-time screen sharing satu-ke-satu (1–1)** yang dibangun menggunakan **WebRTC di browser** dan **Golang (Pion)** sebagai signaling server. Aplikasi ini juga dilengkapi dengan fitur **chat teks** menggunakan WebRTC DataChannel.

> 🎓 **Project Note:** Project ini dibuat untuk memenuhi tugas mata kuliah **Pemrograman Jaringan**.

---

## ✨ Fitur Utama

- 🖥️ **Screen Sharing Real-time:** Berbagi layar antar peer (1-on-1)
- 💬 **Text Chat:** Kirim pesan instan tanpa server database (via DataChannel)
- 📡 **Golang Signaling:** Server ringan menggunakan library Pion
- 🌐 **No WebSocket:** Menggunakan mekanisme HTTP POST + Server-Sent Events (SSE)
- 🧪 **Educational:** Kode yang bersih dan cocok untuk mempelajari dasar WebRTC

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|:---------|:----------|
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
```

---

## ▶️ Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### 1️⃣ Prasyarat

Pastikan **Go (Golang)** versi 1.20 atau lebih baru sudah terinstall.

```bash
go version
```

### 2️⃣ Clone Repository

```bash
git clone https://github.com/username/PionShare.git
cd PionShare
```

### 3️⃣ Install Dependencies

```bash
go mod download
```

### 4️⃣ Jalankan Server

```bash
go run ./server
```

Jika berhasil, Anda akan melihat log:

```
Starting signaling server at :8080
```

### 5️⃣ Akses Aplikasi

Buka browser (disarankan **Google Chrome** atau **Microsoft Edge**), lalu kunjungi:

👉 **http://localhost:8080/**

---

## 🎮 Cara Menggunakan

Untuk mensimulasikan koneksi antar dua user:

1. Buka **2 Tab Browser** (atau 2 window berbeda)
2. Pastikan kedua tab berada di alamat `http://localhost:8080/`
3. **Setup Room:**
   - Masukkan **Room Name** yang sama di kedua tab (contoh: `RoomA`)
   - Gunakan **User ID** yang berbeda (contoh: `User1` di tab kiri, `User2` di tab kanan)
4. **Mulai Sharing:**
   - **Tab 1:** Klik tombol **🎥 Share Screen**
   - **Tab 2:** Klik tombol **👀 Join as Viewer**
5. **Hasil:** Layar dari Tab 1 akan muncul di Tab 2

---

## 💬 Fitur Chat

- Setelah koneksi WebRTC terbentang, gunakan kotak chat di bagian bawah untuk mengirim pesan
- Pesan dikirim melalui **WebRTC DataChannel** (peer-to-peer, tidak melalui server)
- Chat history hanya tersimpan di memori browser selama sesi berlangsung

---

## 🔧 Konfigurasi

Anda dapat mengubah port server dengan mengedit file `server/main.go`:

```go
const PORT = ":8080" // Ubah sesuai kebutuhan
```

---

## ⚠️ Catatan Penting

> **⚠️ WARNING**  
> **Project ini ditujukan untuk pembelajaran (Educational Purpose).**

Untuk penggunaan di lingkungan produksi (Production), Anda perlu menambahkan:

- 🔐 **HTTPS** — Wajib untuk akses API `getDisplayMedia` di jaringan publik
- 🔁 **TURN Server** — Diperlukan jika user berada di balik firewall/NAT
- 🔒 **Authentication** — Sistem login untuk mengamankan room
- 💾 **Database** — Untuk menyimpan riwayat chat dan room management
- 🛡️ **Rate Limiting** — Mencegah penyalahgunaan signaling server

---

## 🐛 Troubleshooting

### Masalah: Screen sharing tidak muncul

- Pastikan Anda menggunakan browser yang support WebRTC (Chrome/Edge/Firefox)
- Periksa permission screen sharing sudah diizinkan
- Coba refresh kedua tab dan ulangi proses

### Masalah: Koneksi gagal terbentuk

- Pastikan Room Name sama persis di kedua tab
- Cek console browser (F12) untuk error message
- Restart server dan coba lagi

### Masalah: Chat tidak terkirim

- Pastikan koneksi WebRTC sudah terbentuk (video muncul)
- DataChannel membutuhkan koneksi peer-to-peer yang stabil
- Periksa console untuk error terkait DataChannel

---

## 📊 Arsitektur Sistem

```
┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │   Browser   │
│   (User 1)  │                    │   (User 2)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  HTTP POST (Offer/Answer/ICE)    │
       │         ↓           ↓            │
       └────────→ ┌─────────┐ ←──────────┘
                  │  Golang │
                  │ Signaling│
                  │  Server │
                  └─────────┘
                       ↓
            Server-Sent Events (SSE)
                       ↓
       ┌───────────────┴───────────────┐
       ↓                               ↓
┌─────────────┐                ┌─────────────┐
│   Browser   │ ←─WebRTC P2P──→│   Browser   │
│   (User 1)  │  (Media Stream) │   (User 2)  │
└─────────────┘                └─────────────┘
```

---

## 📚 Referensi & Pembelajaran

- [WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Pion WebRTC Library](https://github.com/pion/webrtc)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [WebRTC for Beginners](https://webrtc.org/getting-started/overview)

---

## 📝 License

Project ini menggunakan lisensi **MIT License**. Anda bebas untuk menggunakan, memodifikasi, dan mendistribusikan project ini untuk keperluan pembelajaran.

```
MIT License

Copyright (c) 2026 Yosafat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

| Informasi | Detail |
|:----------|:-------|
| **Nama** | Yosafat |
| **Mata Kuliah** | Pemrograman Jaringan |
| **Institusi** | [Nama Universitas] |
| **Tahun** | 2026 |

---

## 🤝 Kontribusi

Kontribusi, issues, dan feature requests sangat diterima!

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

Jangan ragu untuk membuka [issue](../../issues) jika menemukan bug atau memiliki saran.

---

## 🙏 Acknowledgments

- Terima kasih kepada tim [Pion WebRTC](https://github.com/pion/webrtc) untuk library yang luar biasa
- Dosen dan teman-teman mata kuliah Pemrograman Jaringan
- Komunitas WebRTC dan Golang Indonesia

---

## 📞 Kontak

Jika Anda memiliki pertanyaan atau saran, silakan hubungi:

- **Email:** [email@example.com]
- **GitHub:** [@username](https://github.com/username)
- **LinkedIn:** [Yosafat](https://linkedin.com/in/username)

---

<p align="center">
  Dibuat dengan ❤️ menggunakan <strong>Golang</strong> dan <strong>WebRTC</strong>
</p>

<p align="center">
  <sub>⭐ Berikan star jika project ini membantu Anda!</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/username/PionShare?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/username/PionShare?style=social" alt="GitHub forks">
