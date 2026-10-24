# CermatDuit 🇮🇩

**CermatDuit** adalah Asisten Literasi Keuangan Pribadi berbasis AI yang dirancang untuk membantu pengguna mengelola keuangan, merencanakan anggaran, dan menjawab pertanyaan seputar literasi keuangan dengan bahasa Indonesia yang ramah, sederhana, dan mudah dipahami.

---

## 🛠️ Tech Stack

Project ini dibangun menggunakan teknologi modern:
- **Framework**: [TanStack Start](https://tanstack.com/router) (SSR & Server Functions)
- **UI Library**: [React 19](https://react.dev) & [Tailwind CSS v4](https://tailwindcss.com)
- **Build Tool**: [Vite 8](https://vite.dev)
- **Package Manager**: [Bun](https://bun.sh)
- **Backend / AI Integration**: [n8n Webhook Chat Trigger](https://n8n.io)
- **Styling & Components**: Radix UI primitives & Lucide Icons

---

## 🚀 Memulai Pengembangan Lokal (Local Development)

Pastikan di komputermu sudah terinstal [Bun](https://bun.sh) (atau Node.js 18+).

1. **Clone repository ini** (atau buka foldernya):
   ```bash
   cd Cermatduit
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```
   *(Atau gunakan `npm install` jika menggunakan npm)*

3. **Jalankan development server**:
   ```bash
   bun dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173` (atau port default Vite).

---

## 📋 Available Scripts

Di `package.json`, tersedia beberapa script:

- `bun dev` — Menjalankan development server (Vite + TanStack Start).
- `bun build` — Mem-build aplikasi untuk production.
- `bun preview` — Melakukan preview build production secara lokal.
- `bun lint` — Menjalankan ESLint untuk pengecekan kode.
- `bun test` — Menjalankan unit test dengan Vitest.

---

## 🌐 Konfigurasi n8n Webhook

Aplikasi ini terhubung ke n8n Chat Webhook untuk memproses pesan AI.
Endpoint dikonfigurasi di `src/lib/chat-config.ts` dan dapat ditimpa menggunakan Environment Variable:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/your-webhook-id/chat
```

---

## 🚀 Deployment ke Vercel

1. Push repository ini ke GitHub.
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan buat project baru dari repository GitHub kamu.
3. Konfigurasi build:
   - **Framework Preset**: Vite
   - **Build Command**: `bun run build` (atau `npm run build`)
   - **Output Directory**: `.output/public`
4. Tambahkan Environment Variable di Vercel:
   - `NITRO_PRESET` = `vercel`
   - `VITE_N8N_WEBHOOK_URL` = *(Opsional, jika ingin custom webhook n8n)*
5. Klik **Deploy**!

---

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).
