import { useEffect, useRef } from 'react';
import technologyImage from '@/assets/technology.jpg';
import { useLanguage } from '@/contexts/LanguageContext';

const Technology = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      
      const imageElement = section.querySelector('.tech-image') as HTMLElement;
      if (imageElement) {
        imageElement.style.transform = `translateY(${-scrollProgress * 100}px)`;
      }
      
      const contentElement = section.querySelector('.tech-content') as HTMLElement;
      if (contentElement) {
        contentElement.style.transform = `translateX(${(1 - scrollProgress) * 50}px)`;
        contentElement.style.opacity = `${scrollProgress}`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Image Side */}
          <div className="relative h-[520px] overflow-hidden rounded-3xl shadow-premium lg:h-[650px] group">
            <img 
              src={technologyImage}
              alt="Advanced Water Pump Technology"
              className="tech-image parallax h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-primary/10 to-transparent" />
          </div>

          {/* Content Side */}
          <div className="tech-content space-y-8 opacity-0">
            <h2 className="font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('tech.title')}
            </h2>
            
            <p className="text-xl text-foreground/80 leading-relaxed">
              {t('tech.intro')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <h4 className="mb-1 font-semibold text-primary">{t('tech.materials.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('tech.materials.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <h4 className="mb-1 font-semibold text-primary">{t('tech.controls.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('tech.controls.desc')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <div>
                  <h4 className="mb-1 font-semibold text-primary">{t('tech.tested.title')}</h4>
                  <p className="text-muted-foreground">
                    {t('tech.tested.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
