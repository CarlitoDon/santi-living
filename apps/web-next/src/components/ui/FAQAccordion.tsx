'use client';

interface FAQItem {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQAccordion({ items, title, className = '' }: FAQAccordionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {title && <h2 className="text-center text-xl md:text-2xl mb-6 font-bold text-slate-900">{title}</h2>}
      {items.map((item, i) => {
        const question = item.q || item.question;
        const answer = item.a || item.answer;

        return (
          <details
            key={i}
            className="group bg-white rounded-lg border border-slate-200 overflow-hidden"
          >
            <summary className="px-4 py-3.5 cursor-pointer font-semibold list-none select-none hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 group-open:text-blue-600">
              {question}
              <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="px-4 pb-4 text-slate-500 leading-relaxed m-0 border-t border-slate-100 pt-3 mt-1">
              {answer}
            </div>
          </details>
        );
      })}
    </div>
  );
}
