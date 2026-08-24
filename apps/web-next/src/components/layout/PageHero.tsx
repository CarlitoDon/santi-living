interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#173b82] py-14 text-center text-white md:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.055),transparent_45%)] pointer-events-none" />
      <div className="container relative z-10 text-center">
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-200" data-reveal="up">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            {badge}
          </div>
        )}
        <h1 className="mx-auto mb-4 max-w-3xl text-3xl font-extrabold tracking-[-0.035em] text-white md:text-5xl" data-reveal="up" data-reveal-delay="45">
          {title}
        </h1>
        <p className="mx-auto m-0 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg" data-reveal="up" data-reveal-delay="90">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
