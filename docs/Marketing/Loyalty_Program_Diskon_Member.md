# Strategi Pemasaran: Program Loyalitas "Santi Living Member"

## Konsep Utama
Meningkatkan *Repeat Order* (pembelian berulang) dan *Customer Lifetime Value* (LTV) dengan mengubah setiap pelanggan baru menjadi member tetap secara otomatis sejak transaksi pertama mereka.

## Detail Penawaran (Offer)
* **Pendaftaran Otomatis:** Pembelian pertama = Pembuatan Member (tanpa syarat tambahan, tanpa biaya pendaftaran).
* **Benefit Eksklusif:** Pelanggan yang sudah pernah menyewa sebelumnya (Member) berhak mendapatkan **Diskon Rp 5.000 per kasur** untuk setiap penyewaan berikutnya.

---

## 🎯 Mengapa Strategi Ini Sangat Kuat?
1. **Mengurangi Customer Acquisition Cost (CAC):** Mendapatkan pelanggan baru lewat Google Ads butuh biaya (misal Rp15.000 per lead). Dengan memberikan diskon Rp5.000 kepada pelanggan lama, margin keuntungan kita tetap jauh lebih besar dibandingkan harus mencari pelanggan baru dari nol.
2. **Word of Mouth (WOM):** Pelanggan yang merasa diuntungkan dengan status "Member" akan lebih cenderung merekomendasikan Santi Living kepada teman kos atau keluarga mereka.
3. **Menciptakan "Lock-in Effect":** Jika mahasiswa tahu mereka sudah punya "diskon permanen" di Santi Living, mereka tidak akan repot mencari tempat penyewaan lain saat butuh kasur lagi di semester depan.

---

## ⚙️ Rencana Implementasi

### 1. Implementasi Teknis (Sistem ERP & Next.js)
* **Database ERP:** Menambahkan flag atau status `isMember: boolean` pada data pelanggan (berdasarkan Nomor WhatsApp).
* **Kalkulator Web (Next.js):** 
  - Menambahkan checkbox atau opsi: *"Saya sudah pernah menyewa sebelumnya (Member Santi Living)"*.
  - Jika dicentang, kalkulator otomatis memotong Rp5.000 dari setiap item tipe `mattress` yang ada di keranjang.
  - Validasi klaim diskon bisa dilakukan manual oleh Admin WA dengan mengecek riwayat chat/database nomor telepon.

### 2. Strategi Komunikasi (Marketing)
* **Pesan Penutup (After-Sales WA):** Saat menarik kasur sewaan atau hari terakhir sewa, Admin mengirimkan pesan: 
  > *"Terima kasih Kak [Nama] sudah mempercayakan Santi Living! Nomor WhatsApp Kakak sekarang sudah terdaftar sebagai **Member VIP**. Untuk pesanan berikutnya, Kakak otomatis dapat diskon Rp 5.000 PER KASUR tanpa batas waktu. Simpan nomor kami ya kak! 😊"*
* **Broadcast WhatsApp (Win-back Campaign):** Menarik kembali database pelanggan lama (yang pernah sewa 3-6 bulan lalu) dengan mengirimkan blast message mengenai benefit member baru ini.
* **Website Banner:** Menambahkan *Call-Out* kecil di halaman produk: *"Pernah sewa sebelumnya? Dapatkan potongan member Rp5rb/kasur selamanya!"*

---

## 📈 Metrik Keberhasilan (KPIs)
* **Repeat Order Rate:** Persentase pelanggan yang melakukan pemesanan >1 kali dalam periode 6 bulan.
* **Average Order Value (AOV) dari Member:** Memantau apakah pelanggan lama menyewa lebih banyak kasur karena adanya potongan per item.

*Catatan Ide: [Tanggal Pembuatan: April 2026]*