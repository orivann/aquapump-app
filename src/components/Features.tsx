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
    <section ref={sectionRef} className="relative bg-secondary py-24 px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-primary">
            {t('features.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group opacity-0 rounded-2xl bg-card p-8 shadow-card transition-all duration-500 hover:shadow-premium hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-accent shadow-glow transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-8 w-8 text-accent-foreground" />
              </div>
              
              <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                {t(feature.titleKey)}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
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
