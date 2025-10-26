import { useEffect, useRef } from 'react';
import sustainabilityImage from '@/assets/sustainability.jpg';

const Sustainability = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
              Green. Sustainable. Future-Ready.
            </h2>
            
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              At AquaPump, we believe in creating solutions that don't just serve today's 
              needs, but protect tomorrow's world. Our eco-friendly technology reduces 
              environmental impact while delivering superior performance.
            </p>
            
            <div className="grid gap-6 pt-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
                <div className="mb-2 text-4xl font-bold text-accent">60%</div>
                <div className="text-sm text-primary-foreground/80">
                  Energy Reduction
                </div>
              </div>
              
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
                <div className="mb-2 text-4xl font-bold text-accent">100%</div>
                <div className="text-sm text-primary-foreground/80">
                  Recyclable Materials
                </div>
              </div>
              
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
                <div className="mb-2 text-4xl font-bold text-accent">25+</div>
                <div className="text-sm text-primary-foreground/80">
                  Years Lifespan
                </div>
              </div>
              
              <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
                <div className="mb-2 text-4xl font-bold text-accent">Zero</div>
                <div className="text-sm text-primary-foreground/80">
                  Harmful Emissions
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
