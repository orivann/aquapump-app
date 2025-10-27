import { useEffect, useRef } from 'react';
import sustainabilityImage from '@/assets/sustainability.jpg';
import { useLanguage } from '@/contexts/LanguageContext';

const Sustainability = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      
      const imageElement = section.querySelector('.sustain-image') as HTMLElement;
      if (imageElement) {
        imageElement.style.transform = `scale(${1 + scrollProgress * 0.1})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-hero py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Content Side - Left on Desktop */}
          <div className="space-y-8 text-primary-foreground">
            <h2 className="font-display drop-shadow-lg">
              {t('sustain.title')}
            </h2>
            
            <p className="text-xl text-primary-foreground/95 leading-relaxed drop-shadow-md">
              {t('sustain.intro')}
            </p>
            
            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <div className="group rounded-2xl bg-primary-foreground/15 p-8 backdrop-blur-md transition-all duration-300 hover:bg-primary-foreground/20 hover:-translate-y-1 hover:shadow-xl border border-primary-foreground/10">
                <div className="mb-3 text-5xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">60%</div>
                <div className="text-sm text-primary-foreground/90 leading-relaxed">
                  {t('sustain.energy')}
                </div>
              </div>
              
              <div className="group rounded-2xl bg-primary-foreground/15 p-8 backdrop-blur-md transition-all duration-300 hover:bg-primary-foreground/20 hover:-translate-y-1 hover:shadow-xl border border-primary-foreground/10">
                <div className="mb-3 text-5xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-sm text-primary-foreground/90 leading-relaxed">
                  {t('sustain.recyclable')}
                </div>
              </div>
              
              <div className="group rounded-2xl bg-primary-foreground/15 p-8 backdrop-blur-md transition-all duration-300 hover:bg-primary-foreground/20 hover:-translate-y-1 hover:shadow-xl border border-primary-foreground/10">
                <div className="mb-3 text-5xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">25+</div>
                <div className="text-sm text-primary-foreground/90 leading-relaxed">
                  {t('sustain.lifespan')}
                </div>
              </div>
              
              <div className="group rounded-2xl bg-primary-foreground/15 p-8 backdrop-blur-md transition-all duration-300 hover:bg-primary-foreground/20 hover:-translate-y-1 hover:shadow-xl border border-primary-foreground/10">
                <div className="mb-3 text-5xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">{t('sustain.emissions')}</div>
                <div className="text-sm text-primary-foreground/90 leading-relaxed">
                  {t('sustain.emissions')}
                </div>
              </div>
            </div>
          </div>

          {/* Image Side - Right on Desktop */}
          <div className="relative h-[520px] overflow-hidden rounded-3xl shadow-premium lg:h-[650px] group">
            <img 
              src={sustainabilityImage}
              alt="Sustainable Water Technology"
              className="sustain-image parallax h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/30 via-accent/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
