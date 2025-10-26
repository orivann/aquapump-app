import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const products = [
  {
    name: 'AquaPump Pro',
    category: 'Industrial Series',
    description: 'High-capacity pumping for large-scale operations',
    specs: ['50-500 HP', 'Up to 10,000 GPM', 'Smart Controls']
  },
  {
    name: 'AquaPump Eco',
    category: 'Residential Series',
    description: 'Perfect for homes and small businesses',
    specs: ['1-10 HP', 'Up to 500 GPM', 'Ultra Quiet']
  },
  {
    name: 'AquaPump Solar',
    category: 'Green Energy Series',
    description: 'Solar-powered sustainable water solutions',
    specs: ['Solar Ready', 'Battery Backup', 'Off-Grid']
  },
  {
    name: 'AquaPump Smart',
    category: 'IoT Series',
    description: 'Connected pumps with AI-powered optimization',
    specs: ['IoT Enabled', 'Mobile App', 'Predictive AI']
  }
];

const Products = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
            Our Product Range
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            From residential to industrial, discover the perfect water pump solution for your needs
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
                    {product.category}
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">
                    {product.name}
                  </h3>
                </div>
                
                <p className="mb-6 text-muted-foreground">
                  {product.description}
                </p>
                
                <div className="mb-6 space-y-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {spec}
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="group/btn w-full justify-between text-primary hover:text-accent"
                >
                  Learn More
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
