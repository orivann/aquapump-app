import { type CSSProperties, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pump.jpg";
import logoFull from "@/assets/logo-full.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollReveal(heroRef, { threshold: 0.1, rootMargin: "-10% 0px" });

  useEffect(() => {
    if (!heroRef.current || prefersReducedMotion || isMobile) {
      return;
    }

    const heroElement = heroRef.current;
    const imageElement = heroElement.querySelector<HTMLElement>(".hero-image img");
    const overlayElement = heroElement.querySelector<HTMLElement>(".hero-overlay");
    const contentElement = contentRef.current;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const eased = Math.min(scrolled, 400);

      if (imageElement) {
        imageElement.style.transform = `translateY(${eased * 0.25}px) scale(${1 + eased * 0.0006})`;
      }

      if (overlayElement) {
        overlayElement.style.opacity = `${Math.min(0.85, 0.35 + eased * 0.0012)}`;
      }

      if (contentElement) {
        contentElement.style.transform = `translateY(${eased * 0.12}px)`;
        contentElement.style.opacity = `${Math.max(0, 1 - eased * 0.0025)}`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-background pt-24 text-primary-foreground md:pt-32"
    >
      <div className="hero-image absolute inset-0">
        <img
          src={heroImage}
          alt="AquaPump Premium Water Technology"
          className="h-full w-full object-cover brightness-110"
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/30 to-primary/90" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-6xl flex-col items-center px-6 text-center sm:px-10"
      >
        <span
          className="rounded-full bg-primary-foreground/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/80 backdrop-blur"
          data-animate="zoom"
        >
          {t("hero.badge")}
        </span>

        <h1
          className="mt-8 max-w-4xl font-display text-4xl leading-tight drop-shadow-lg md:text-6xl lg:text-[4.2rem]"
          data-animate
          style={{ "--stagger-delay": "120ms" } as CSSProperties}
        >
          {t("hero.title")}
        </h1>

        <p
          className="mt-6 max-w-3xl text-balance text-base text-primary-foreground/90 md:mt-8 md:text-xl lg:text-[1.35rem]"
          data-animate
          style={{ "--stagger-delay": "220ms" } as CSSProperties}
        >
          {t("hero.subtitle")}
        </p>

        <div
          className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          data-animate
          style={{ "--stagger-delay": "320ms" } as CSSProperties}
        >
          <Button
            size="lg"
            className="w-full max-w-[220px] bg-accent text-lg font-semibold tracking-wide text-accent-foreground shadow-glow transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl sm:w-auto"
          >
            {t("hero.explore")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full max-w-[220px] border-primary-foreground/40 bg-primary-foreground/10 text-lg font-semibold tracking-wide text-primary-foreground backdrop-blur transition-transform duration-300 hover:scale-[1.03] hover:bg-primary-foreground/20 hover:shadow-xl sm:w-auto"
          >
            {t("hero.learn")}
          </Button>
        </div>

        <img
          src={logoFull}
          alt="AquaPump Logo"
          className="mt-12 w-48 max-w-full opacity-0 drop-shadow-2xl md:w-64 lg:w-80"
          data-animate="fade-in"
          style={{ "--stagger-delay": "420ms" } as CSSProperties}
        />
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center text-xs font-medium uppercase tracking-[0.3em] text-primary-foreground/80 md:flex">
        <span className="mb-4">{t("hero.scrollLabel")}</span>
        <span className="flex h-12 w-8 items-center justify-center rounded-full border border-primary-foreground/40 bg-primary-foreground/10">
          <ChevronDown className="animate-bounce text-primary-foreground" size={20} />
        </span>
      </div>
    </section>
  );
};

export default Hero;
