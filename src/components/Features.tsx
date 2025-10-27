import { useEffect, useRef } from 'react';
import { Droplet, Zap, Leaf, Shield, Gauge, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Droplet,
      titleKey: 'features.flow.title',
      descKey: 'features.flow.desc'
    },
    {
      icon: Zap,
      titleKey: 'features.energy.title',
      descKey: 'features.energy.desc'
    },
    {
      icon: Leaf,
      titleKey: 'features.eco.title',
      descKey: 'features.eco.desc'
    },
    {
      icon: Shield,
      titleKey: 'features.durable.title',
      descKey: 'features.durable.desc'
    },
    {
      icon: Gauge,
      titleKey: 'features.smart.title',
      descKey: 'features.smart.desc'
    },
    {
      icon: Wrench,
      titleKey: 'features.install.title',
      descKey: 'features.install.desc'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-background via-secondary to-background py-32 px-6 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('features.title')}
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group opacity-0 rounded-3xl bg-card p-10 shadow-card transition-all duration-500 hover:shadow-premium hover:-translate-y-3 border border-transparent hover:border-accent/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <feature.icon className="h-10 w-10 text-accent-foreground" />
              </div>
              
              <h3 className="mb-4 text-2xl font-bold text-card-foreground group-hover:text-accent transition-colors duration-300">
                {t(feature.titleKey)}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-base">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
