import React from 'react';

interface FeatureCardProps {
  icon: string | React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
      <div className="text-3xl w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4 shrink-0">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed m-0 flex-grow">{description}</p>
    </div>
  );
}
