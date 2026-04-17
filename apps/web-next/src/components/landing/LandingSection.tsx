'use client';

interface LandingSectionProps {
  title: string;
  description?: string;
  alt?: boolean;
  children: React.ReactNode;
  id?: string;
}

export function LandingSection({ title, description, alt = false, children, id }: LandingSectionProps) {
  return (
    <section className={`landing-section ${alt ? 'landing-section-alt' : ''}`} id={id}>
      <div className="container">
        <h2 className="landing-section-title">{title}</h2>
        {description && <p className="landing-section-desc">{description}</p>}
        {children}
      </div>

      <style jsx>{`
        .landing-section {
          padding: var(--space-10) 0;
        }
        .landing-section-alt {
          background: var(--color-surface);
        }
        .landing-section-title {
          text-align: center;
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-2);
        }
        .landing-section-desc {
          text-align: center;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-6);
        }
      `}</style>
    </section>
  );
}
