import { useEffect, useRef } from 'react';
import technologyImage from '@/assets/technology.jpg';

const Technology = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Side */}
          <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-premium lg:h-[600px]">
            <img 
              src={technologyImage}
              alt="Advanced Water Pump Technology"
              className="tech-image parallax h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>

          {/* Content Side */}
          <div className="tech-content space-y-6 opacity-0">
            <h2 className="font-display text-primary">
              Precision Engineering
            </h2>
            
            <p className="text-lg text-foreground/80 leading-relaxed">
              Our water pump systems represent the pinnacle of modern engineering. 
              Every component is meticulously designed and tested to deliver unparalleled 
              performance, efficiency, and reliability.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <div>
                  <h4 className="mb-1 font-semibold text-primary">Advanced Materials</h4>
                  <p className="text-muted-foreground">
                    Corrosion-resistant alloys ensure decades of maintenance-free operation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <div>
                  <h4 className="mb-1 font-semibold text-primary">Smart Controls</h4>
                  <p className="text-muted-foreground">
                    Intelligent automation optimizes performance in real-time
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <div>
                  <h4 className="mb-1 font-semibold text-primary">Tested Excellence</h4>
                  <p className="text-muted-foreground">
                    Rigorous quality control in extreme conditions
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
