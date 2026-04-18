'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';

import { formatPrice } from '@/utils/currency';

export function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden flex flex-col h-full cursor-pointer shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" 
      onClick={onClick}
    >
      <div className="aspect-square bg-slate-50 overflow-hidden">
        <Image 
          src={product.image} 
          alt={product.name} 
          width={800} 
          height={600} 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold mb-1 text-slate-900">{product.name}</h3>
        <p className="text-[0.85rem] text-slate-500 mb-3 flex-1 line-clamp-2 overflow-hidden">{product.description}</p>

        <div className="flex gap-2 text-xs text-slate-400 mb-3">
          {product.dimensions && <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm">{product.dimensions}</span>}
          {product.capacity && <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm">{product.capacity}</span>}
        </div>

        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-lg font-extrabold text-blue-600">{formatPrice(product.pricePerDay)}</span>
          <span className="text-xs text-slate-500">/hari</span>
        </div>
      </div>
    </div>
  );
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  quantity,
  onIncrement,
  onDecrement,
  onSewaClick,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onSewaClick?: () => void;
}) {
  const router = useRouter();

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSewaClick = () => {
    if (onSewaClick) {
      onSewaClick();
      return;
    }
    onClose();
    router.push(`/?id=${product.id}&autoAdd=true#calculator`);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" 
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col"
        style={{ animation: 'slideUp 0.3s ease' }}
      >
        <button 
          className="absolute top-4 right-4 bg-white border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-slate-900 shadow-sm z-10 hover:scale-105 hover:bg-slate-100 transition-all" 
          onClick={onClose} 
          aria-label="Tutup"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="w-full min-h-[250px] bg-slate-50 md:border-r md:border-slate-200">
            <Image 
              src={product.image} 
              alt={product.name} 
              width={800} 
              height={600} 
              priority 
              className="w-full h-full object-cover max-h-[400px] md:max-h-none md:rounded-tl-2xl md:rounded-bl-2xl" 
            />
          </div>
          
          <div className="p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl leading-snug mb-2 text-slate-900 font-bold">{product.name}</h2>
              <div className="inline-flex items-baseline gap-1 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <span className="text-xl font-extrabold text-blue-600">{formatPrice(product.pricePerDay)}</span>
                <span className="text-blue-500 text-sm">/hari</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-5 pb-4 border-b border-slate-200">
              {product.dimensions && (
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-md">
                  <span>📏</span>
                  <span>{product.dimensions}</span>
                </div>
              )}
              {product.capacity && (
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-md">
                  <span>👤</span>
                  <span>{product.capacity}</span>
                </div>
              )}
            </div>
            
            <div className="text-[0.95rem] text-slate-700 leading-[1.6] mb-6">
              <p>{product.description}</p>
              {product.includes && product.includes.length > 0 && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-green-800 mb-2 text-[0.95rem] font-semibold">Yang didapatkan:</h4>
                  <ul className="list-none p-0 m-0">
                    {product.includes.map((inc, i) => (
                      <li key={i} className="relative pl-6 mb-1 text-green-700">
                        <span className="absolute left-0 text-green-600 font-bold">✓</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 md:mt-auto">
              {quantity !== undefined && onIncrement && onDecrement ? (
                <div className="flex items-center bg-slate-100 rounded-lg px-2 overflow-hidden h-14">
                  <button 
                    onClick={onDecrement} 
                    disabled={quantity <= 0}
                    className="border-none bg-transparent text-2xl text-blue-500 cursor-pointer w-10 h-full flex items-center justify-center transition-colors hover:not-disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >−</button>
                  <span className="text-[1.2rem] font-bold text-slate-900 min-w-[32px] text-center">{quantity}</span>
                  <button 
                    onClick={onIncrement}
                    className="border-none bg-transparent text-2xl text-blue-500 cursor-pointer w-10 h-full flex items-center justify-center transition-colors hover:not-disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >+</button>
                </div>
              ) : null}
              <button 
                onClick={handleSewaClick} 
                className="btn btn-primary h-14 text-lg rounded-lg shadow-[0_10px_15px_-3px_rgba(37,99,235,0.4)] flex-1"
              >
                Sewa Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}
