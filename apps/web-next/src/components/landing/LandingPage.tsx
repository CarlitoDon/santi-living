'use client';

import type { LandingPageConfig } from '@/types/landing';
import { LandingHero } from './LandingHero';
import { LandingSection } from './LandingSection';
import { LandingFAQ } from './LandingFAQ';
import { LandingCTA } from './LandingCTA';
import { ACCENT_COLOR_MAP } from '@/types/landing';
import Link from 'next/link';

interface LandingPageProps {
  config: LandingPageConfig;
}

export function LandingPage({ config: cfg }: LandingPageProps) {
  const accent = ACCENT_COLOR_MAP[cfg.color];

  return (
    <main style={{ paddingTop: '70px' }}>
      <LandingHero
        title={cfg.hero.title}
        subtitle={cfg.hero.subtitle}
        badge={cfg.hero.badge}
        color={cfg.color}
      />

      {/* Benefits */}
      {cfg.benefits && cfg.benefits.length > 0 && (
        <LandingSection title={`Kenapa Pilih ${cfg.hero.title.replace('Jogja', '').trim()}?`}>
          <div className="benefit-grid">
            {cfg.benefits.map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            ))}
          </div>
        </LandingSection>
      )}

      {/* Price Cards */}
      {cfg.priceCards && cfg.priceCards.length > 0 && (
        <LandingSection title="Harga Sewa" alt>
          <div className="price-cards">
            {cfg.priceCards.map((card, i) => (
              <div key={i} className={`price-card ${card.popular ? 'price-card-popular' : ''}`}
                style={card.popular ? { borderColor: accent, boxShadow: `0 4px 12px ${accent}26` } : undefined}
              >
                {card.popular && (
                  <div className="price-card-badge" style={{ background: accent }}>Best Value</div>
                )}
                <div className="price-card-header">{card.name}</div>
                <div className="price-card-size">{card.size}</div>
                <div className="price-card-price" style={{ color: accent }}>
                  {card.price}<span>/bulan</span>
                </div>
                <div className="price-card-daily">{card.daily}</div>
                <div className="price-card-note">{card.note}</div>
              </div>
            ))}
          </div>
          <p className="price-link">
            <Link href="/harga-sewa-kasur">Lihat daftar harga lengkap semua ukuran →</Link>
          </p>
        </LandingSection>
      )}

      {/* Audience */}
      {cfg.audience && cfg.audience.length > 0 && (
        <LandingSection title="Siapa yang Biasanya Menyewa?">
          <div className="audience-grid">
            {cfg.audience.map((item, i) => (
              <div key={i} className="audience-item">
                <span className="audience-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </LandingSection>
      )}

      {/* Extra HTML sections */}
      {cfg.sections?.map((section, i) => (
        <LandingSection key={i} title={section.title} alt={i % 2 === 0}>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </LandingSection>
      ))}

      {/* FAQ */}
      <LandingFAQ faqs={cfg.faqs} color={cfg.color} />

      {/* CTA */}
      <LandingCTA
        title={cfg.cta.title}
        description={cfg.cta.description}
        waText={cfg.cta.waText}
        waSource={cfg.cta.waSource}
        color={cfg.color}
      />

      <style jsx>{`
        .benefit-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
          max-width: 640px;
          margin: var(--space-6) auto 0;
        }
        .benefit-card {
          text-align: center;
          padding: var(--space-5);
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .benefit-icon { font-size: 2rem; margin-bottom: var(--space-2); }
        .benefit-card h3 { font-size: var(--font-size-base); margin-bottom: var(--space-1); }
        .benefit-card p { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0; }
        .price-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
          max-width: 720px;
          margin: 0 auto;
        }
        .price-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          text-align: center;
          position: relative;
        }
        .price-card-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          padding: 2px var(--space-3);
          border-radius: var(--radius-full);
        }
        .price-card-header { font-weight: var(--font-weight-bold); margin-bottom: var(--space-1); }
        .price-card-size { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-3); }
        .price-card-price { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); }
        .price-card-price span { font-size: var(--font-size-sm); font-weight: var(--font-weight-normal); color: var(--color-text-secondary); }
        .price-card-daily { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-1); }
        .price-card-note { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-2); }
        .price-link { text-align: center; margin-top: var(--space-4); font-size: var(--font-size-sm); }
        .price-link a { color: var(--color-primary); font-weight: var(--font-weight-semibold); }
        .audience-grid {
          max-width: 560px;
          margin: var(--space-6) auto 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .audience-item { display: flex; gap: var(--space-3); align-items: flex-start; }
        .audience-icon { flex-shrink: 0; font-size: 1.5rem; margin-top: 2px; }
        .audience-item strong { display: block; margin-bottom: 2px; }
        .audience-item p { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: 0; }
        @media (max-width: 639px) {
          .price-cards { grid-template-columns: 1fr; max-width: 300px; }
        }
      `}</style>
    </main>
  );
}
