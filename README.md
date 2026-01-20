# Santi Living - Sewa Kasur Jogja

Website penyewaan kasur Jogja dengan kalkulator harga dinamis dan integrasi pengiriman WhatsApp.

## Fitur Utama

- **Kalkulator Sewa**: Hitung harga berdasarkan jenis kasur, jumlah, dan durasi.
- **Auto Ongkir**: Hitung ongkir otomatis berdasarkan jarak dari Santi Mebel Godean.
- **Pick on Map**: Pilih lokasi pengiriman langsung dari peta (Leaflet).
- **Automated WhatsApp Notification**: Pesanan otomatis terkirim melalui WhatsApp Admin (Bot Service).

## Struktur Project

```text
.
├── apps/
│   └── bot-service/     # Node.js backend untuk WhatsApp Bot
├── src/                # Frontend Astro
│   ├── components/     # UI Components
│   ├── scripts/        # Frontend logic
│   └── data/           # Config & Product data
└── specs/               # Dokumentasi feature & planning
```

## Cara Menjalankan

### 1. Frontend (Astro)

```bash
npm install
npm run dev
```

### 2. WhatsApp Bot Service

Layanan ini harus berjalan agar pesanan bisa terkirim otomatis.

```bash
cd apps/bot-service
npm install
# Buat file .env dan sesuaikan API_SECRET
npm run start
```

Saat pertama kali dijalankan, scan QR code yang muncul di terminal menggunakan WhatsApp Admin (Linked Devices).

## Environment Variables

### Bot Service (`apps/bot-service/.env`)

- `PORT`: Default 3000
- `API_SECRET`: Token rahasia untuk autentikasi API dari frontend.

### Frontend Config (`src/data/config.json`)

- `botApi.baseUrl`: URL Bot Service (default http://localhost:3000)
- `botApi.apiKey`: Harus sama dengan `API_SECRET` di Bot Service.
