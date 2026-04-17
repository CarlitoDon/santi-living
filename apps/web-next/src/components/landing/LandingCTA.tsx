'use client';

import Link from 'next/link';
import type { ThemeColor } from '@/types/landing';
import { GRADIENT_MAP } from '@/types/landing';
import { config } from '@/data/config';

interface LandingCTAProps {
  title: string;
  description: string;
  waText: string;
  waSource: string;
  color: ThemeColor;
}

export function LandingCTA({ title, description, waText, waSource, color }: LandingCTAProps) {
  const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <section className="landing-cta" style={{ background: GRADIENT_MAP[color] }}>
      <div className="container">
        <h2 className="landing-cta-title">{title}</h2>
        <p className="landing-cta-desc">{description}</p>
        <div className="landing-cta-buttons">
          <Link href="/#calculator" className="btn btn-primary btn-lg cta-calc-btn">
            Hitung Biaya Sewa
          </Link>
          <a
            href={waUrl}
            className="btn btn-outline btn-lg cta-wa-btn"
            target="_blank"
            rel="noopener"
            data-wa-source={waSource}
          >
            💬 Chat WhatsApp
          </a>
        </div>
      </div>

      <style jsx>{`
        .landing-cta {
          padding: var(--space-10) 0;
          text-align: center;
          color: white;
        }
        .landing-cta-title {
          font-size: var(--font-size-2xl);
          color: white;
          margin-bottom: var(--space-2);
        }
        .landing-cta-desc {
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: var(--space-6);
        }
        .landing-cta-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }
        .cta-calc-btn {
          background: white;
          color: var(--color-text);
          max-width: 280px;
          width: 100%;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: var(--space-3) var(--space-6);
          font-weight: var(--font-weight-semibold);
          border-radius: var(--radius-md);
        }
        .cta-wa-btn {
          max-width: 280px;
          width: 100%;
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: var(--space-3) var(--space-6);
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-semibold);
        }
        .cta-wa-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: white;
        }
        @media (min-width: 640px) {
          .landing-cta-buttons {
            flex-direction: row;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
