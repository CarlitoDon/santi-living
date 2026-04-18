interface PageHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-[#1a4ea0] py-10 pb-12 text-center text-white relative overflow-hidden">
      {/* Visual background elements to make it premium */}
      <div className="absolute top-[10%] left-[5%] w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none opacity-50" />

      <div className="container relative z-10">
        {badge && (
          <div className="mx-auto mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-100 border border-white/20 backdrop-blur-sm shadow-sm">
            {badge}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white drop-shadow-md tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-white/90 m-0 max-w-2xl mx-auto drop-shadow-sm font-medium">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
