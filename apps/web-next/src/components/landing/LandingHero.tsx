'use client';

import type { ThemeColor } from '@/types/landing';
import { GRADIENT_MAP } from '@/types/landing';

interface LandingHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  color: ThemeColor;
}

export function LandingHero({ title, subtitle, badge, color }: LandingHeroProps) {
  return (
    <section className="landing-hero" style={{ background: GRADIENT_MAP[color] }}>
      <div className="container">
        <h1 className="landing-hero-title">{title}</h1>
        <p className="landing-hero-subtitle">{subtitle}</p>
        {badge && <div className="landing-hero-badge">{badge}</div>}
      </div>

      <style jsx>{`
        .landing-hero {
          padding: var(--space-10) 0 var(--space-8);
          text-align: center;
          color: white;
        }
        .landing-hero-title {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--space-2);
          color: white;
        }
        .landing-hero-subtitle {
          font-size: var(--font-size-base);
          opacity: 0.9;
          margin-bottom: var(--space-3);
        }
        .landing-hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: var(--space-1) var(--space-4);
          border-radius: var(--radius-full);
          font-weight: var(--font-weight-bold);
        }
        @media (min-width: 640px) {
          .landing-hero-title { font-size: var(--font-size-3xl); }
        }
      `}</style>
    </section>
  );
}
