'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/images/stok-kasur.png', alt: 'Stok Kasur Busa Santi Mebel Jogja' },
  { src: '/images/gudang.webp', alt: 'Gudang Santi Mebel Jogja' },
];

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pt-[110px]">
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left text-slate-900">Cerita di Balik Santi Living</h2>
              <p className="text-lg leading-[1.6] text-slate-600 mb-4">
                <strong>Santi Living</strong> adalah lini bisnis modern yang lahir dari <strong>Santi Mebel Godean</strong>, sebuah toko furnitur legendaris di Yogyakarta yang telah dipercaya oleh masyarakat selama <strong>tiga generasi</strong>. Berbekal pengalaman puluhan tahun dalam memahami kualitas material furnitur, kami menyadari adanya perubahan kebutuhan masyarakat urban.
              </p>
              <p className="text-lg leading-[1.6] text-slate-600 mb-4">
                Di era modern ini, fleksibilitas adalah kunci. Tidak semua orang harus membeli dan memiliki barang berukuran besar, terutama mahasiswa atau perantau. Oleh karena itu, <strong>Santi Living hadir membawa solusi baru: layanan sewa kasur dan perlengkapan rumah tangga</strong>. Kami menjamin Anda mendapatkan produk berkualitas (seperti busa High Density Royal Grand Exclusive) dengan layanan antar-jemput yang cepat, higienis, dan tanpa repot.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8 bg-blue-50 p-6 rounded-lg text-center">
                <div>
                  <span className="block text-2xl font-bold text-blue-600 mb-1">100+</span>
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[1px]">Kasur Busa Ready</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600 mb-1">1000+</span>
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[1px]">Pelanggan Puas</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600 mb-1">Same Day</span>
                  <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-[1px]">Delivery Jogja</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <div className="relative w-full aspect-square">
                {slides.map((s, i) => (
                  <div 
                    key={i} 
                    className={`absolute top-0 left-0 w-full h-full transition-all duration-[600ms] ease-in-out ${
                      currentSlide === i ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                  >
                    <Image src={s.src} alt={s.alt} width={600} height={600} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`w-[10px] h-[10px] rounded-full border-none cursor-pointer transition-colors duration-300 ${
                      currentSlide === i ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 text-sm text-center z-10">
                Stok kasur busa kami selalu ready dan terjaga kebersihannya.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-slate-900">Mengapa Memilih Kami?</h2>
          <div className="grid gap-6 mt-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-[3rem] mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Kasur Busa Bersih &amp; Steril</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Setiap kasur busa dipastikan bersih dan melalui proses sanitasi sebelum dikirim.</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-[3rem] mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Pengiriman Cepat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Pesan sebelum jam 15:00, kasur busa sampai di hari yang sama untuk area Jogja.</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm">
              <div className="text-[3rem] mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Harga Transparan</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Tidak ada biaya tersembunyi. Harga sewa harian murah dengan durasi fleksibel.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
