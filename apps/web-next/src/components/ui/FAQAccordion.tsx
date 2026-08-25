'use client';

import { useEffect, useId, useState } from 'react';

interface FAQItem {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  titleId?: string;
  className?: string;
}

export function FAQAccordion({
  items,
  title,
  titleId,
  className = '',
}: FAQAccordionProps) {
  const generatedId = useId().replace(/:/g, '');
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [openItems, setOpenItems] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    // Keep every answer visible in server-rendered/no-JS HTML. Collapse only after
    // React can provide a working trigger.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnhanced(true);
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className={`faq-accordion ${className}`}>
      {title && (
        <h2 id={titleId} className="faq-title">
          {title}
        </h2>
      )}

      <div className="faq-list">
        {items.map((item, index) => {
          const question = item.q || item.question;
          const answer = item.a || item.answer;
          const isOpen = openItems.has(index);
          const buttonId = `${generatedId}-question-${index}`;
          const panelId = `${generatedId}-answer-${index}`;

          return (
            <div
              className="faq-item"
              data-state={!isEnhanced || isOpen ? 'open' : 'closed'}
              key={`${question}-${index}`}
            >
              <h3 className="faq-question">
                <button
                  id={buttonId}
                  type="button"
                  className="faq-trigger motion-interactive"
                  aria-expanded={!isEnhanced || isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                >
                  <span>{question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                className="faq-panel"
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={isEnhanced ? !isOpen : undefined}
              >
                <div className="faq-panel-inner">
                  <p>{answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
