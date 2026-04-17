'use client';

import type { FAQItem, ThemeColor } from '@/types/landing';
import { ACCENT_COLOR_MAP } from '@/types/landing';
import { JsonLd } from '@/components/seo/JsonLd';

interface LandingFAQProps {
  title?: string;
  faqs: FAQItem[];
  color: ThemeColor;
  /** Whether to render the page as alt-background */
  alt?: boolean;
}

export function LandingFAQ({ title = 'Pertanyaan Umum', faqs, color, alt = true }: LandingFAQProps) {
  const accentColor = ACCENT_COLOR_MAP[color];

  const faqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };

  return (
    <section className={`landing-faq-section ${alt ? 'landing-faq-alt' : ''}`}>
      <div className="container">
        <h2 className="landing-faq-title">{title}</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question" style={{ '--accent': accentColor } as React.CSSProperties}>
                {faq.question}
              </summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <JsonLd data={faqSchema} />

      <style jsx>{`
        .landing-faq-section {
          padding: var(--space-10) 0;
        }
        .landing-faq-alt {
          background: var(--color-surface);
        }
        .landing-faq-title {
          text-align: center;
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-6);
        }
        .faq-list {
          max-width: 640px;
          margin: 0 auto;
        }
        .faq-item {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-3);
          background: white;
          overflow: hidden;
        }
        .faq-question {
          padding: var(--space-4);
          cursor: pointer;
          font-weight: var(--font-weight-semibold);
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .faq-question::after {
          content: "+";
          font-size: var(--font-size-xl);
          color: var(--accent, var(--color-primary));
          transition: transform 0.2s;
        }
        .faq-item[open] .faq-question::after {
          content: "−";
        }
        .faq-answer {
          padding: 0 var(--space-4) var(--space-4);
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </section>
  );
}
