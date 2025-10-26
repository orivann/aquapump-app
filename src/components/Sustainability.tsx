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
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content Side - Left on Desktop */}
          <div className="space-y-6 text-primary-foreground">
            <h2 className="font-display">
              {t('sustain.title')}
            </h2>
            
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              {t('sustain.intro')}
            </p>
            
            <div className="grid gap-6 pt-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15">
                <div className="mb-2 text-4xl font-bold text-accent">60%</div>
                <div className="text-sm text-primary-foreground/80">
                  {t('sustain.energy')}
                </div>
              </div>
              
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15">
                <div className="mb-2 text-4xl font-bold text-accent">100%</div>
                <div className="text-sm text-primary-foreground/80">
                  {t('sustain.recyclable')}
                </div>
              </div>
              
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15">
                <div className="mb-2 text-4xl font-bold text-accent">25+</div>
                <div className="text-sm text-primary-foreground/80">
                  {t('sustain.lifespan')}
                </div>
              </div>
              
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15">
                <div className="mb-2 text-4xl font-bold text-accent">{t('sustain.emissions')}</div>
                <div className="text-sm text-primary-foreground/80">
                  {t('sustain.emissions')}
                </div>
              </div>
            </div>
          </div>

          {/* Image Side - Right on Desktop */}
          <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-premium lg:h-[600px]">
            <img 
              src={sustainabilityImage}
              alt="Sustainable Water Technology"
              className="sustain-image parallax h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
