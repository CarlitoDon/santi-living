import React from 'react';

interface FeatureCardProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="group h-full border-t border-slate-200 py-6 text-left motion-interactive hover:border-blue-300">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-700 motion-interactive group-hover:bg-blue-100">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-bold text-slate-900">{title}</h3>
      <p className="m-0 text-sm leading-relaxed text-slate-500">{description}</p>
    </article>
  );
}
