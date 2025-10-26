import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-pump.jpg';
import brandLogo from '@/assets/brand-logo.png';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrolled = window.scrollY;
      const heroElement = heroRef.current;
      
      // Parallax effect on hero image
      const imageElement = heroElement.querySelector('.hero-image') as HTMLElement;
      if (imageElement) {
        imageElement.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0002})`;
        imageElement.style.opacity = `${1 - scrolled * 0.001}`;
      }
      
      // Fade content
      const contentElement = heroElement.querySelector('.hero-content') as HTMLElement;
      if (contentElement) {
        contentElement.style.opacity = `${1 - scrolled * 0.002}`;
        contentElement.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Hero Image with Parallax */}
      <div className="hero-image absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AquaPump Premium Water Technology" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Hero Content */}
      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <img 
          src={brandLogo} 
          alt="AquaPump Logo" 
          className="mb-8 h-24 w-24 animate-fade-in md:h-32 md:w-32"
        />
        
        <h1 className="mb-6 font-display text-primary-foreground animate-fade-up">
          The Future of Water Technology
        </h1>
        
        <p className="mb-12 max-w-2xl text-xl text-primary-foreground/90 animate-fade-up md:text-2xl" style={{ animationDelay: '0.2s' }}>
          Your Pump, Our Solution — Premium, sustainable, eco-friendly water pump systems
        </p>
        
        <div className="flex flex-col gap-4 animate-fade-up sm:flex-row" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent-light shadow-glow transition-all duration-300 hover:scale-105"
          >
            Explore Products
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-primary-foreground" />
      </div>
    </section>
  );
};

export default Hero;
