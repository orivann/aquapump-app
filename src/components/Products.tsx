import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Products = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const products = [
    {
      nameKey: 'products.pro.name',
      categoryKey: 'products.pro.category',
      descKey: 'products.pro.desc',
      specs: ['50-500 HP', 'Up to 10,000 GPM', 'Smart Controls']
    },
    {
      nameKey: 'products.eco.name',
      categoryKey: 'products.eco.category',
      descKey: 'products.eco.desc',
      specs: ['1-10 HP', 'Up to 500 GPM', 'Ultra Quiet']
    },
    {
      nameKey: 'products.solar.name',
      categoryKey: 'products.solar.category',
      descKey: 'products.solar.desc',
      specs: ['Solar Ready', 'Battery Backup', 'Off-Grid']
    },
    {
      nameKey: 'products.smart.name',
      categoryKey: 'products.smart.category',
      descKey: 'products.smart.desc',
      specs: ['IoT Enabled', 'Mobile App', 'Predictive AI']
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

    const cards = sectionRef.current?.querySelectorAll('.product-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-secondary py-24 px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-primary">
            {t('products.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card group opacity-0 relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:shadow-premium hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Accent Bar */}
              <div className="h-2 bg-gradient-accent" />
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="mb-2 text-sm font-medium text-accent">
                    {t(product.categoryKey)}
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">
                    {t(product.nameKey)}
                  </h3>
                </div>
                
                <p className="mb-6 text-muted-foreground">
                  {t(product.descKey)}
                </p>
                
                <div className="mb-6 space-y-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      {spec}
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="group/btn w-full justify-between text-primary hover:text-accent hover:bg-accent/5"
                >
                  {t('products.learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
