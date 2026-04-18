import Image from 'next/image';

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/gudang.webp"
          alt="Gudang Kasur Santi Living"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Gradient Overlay mirroring Astro */}
      <div 
        className="absolute inset-0 w-full h-full z-1" 
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(30, 64, 175, 0.9) 100%)'
        }}
      />
    </>
  );
}
