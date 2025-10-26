import { useEffect, useRef } from 'react';
import { Droplet, Zap, Leaf, Shield, Gauge, Wrench } from 'lucide-react';

const features = [
  {
    icon: Droplet,
    title: 'Advanced Flow Technology',
    description: 'Precision-engineered water flow systems for optimal performance and efficiency.'
  },
  {
    icon: Zap,
    title: 'Energy Efficient',
    description: 'Smart power management reduces energy consumption by up to 60%.'
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Design',
    description: 'Sustainable materials and green technology for a better tomorrow.'
  },
  {
    icon: Shield,
    title: 'Built to Last',
    description: 'Premium materials ensure decades of reliable, maintenance-free operation.'
  },
  {
    icon: Gauge,
    title: 'Smart Monitoring',
    description: 'Real-time performance tracking and intelligent diagnostics.'
  },
  {
    icon: Wrench,
    title: 'Easy Installation',
    description: 'Streamlined setup process with comprehensive support.'
  }
];

const Features = () => {
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

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-secondary py-24 px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-primary">
            Innovation in Every Drop
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Cutting-edge features designed for maximum efficiency, sustainability, and performance
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
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
