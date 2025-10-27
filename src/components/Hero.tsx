import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pump.jpg";
import LogoAnimation from "@/components/LogoAnimation";
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

  const metrics = useMemo(
    () => [
      { label: t("hero.metrics.energy.label"), value: t("hero.metrics.energy.value"), description: t("hero.metrics.energy.description") },
      { label: t("hero.metrics.roi.label"), value: t("hero.metrics.roi.value"), description: t("hero.metrics.roi.description") },
      { label: t("hero.metrics.support.label"), value: t("hero.metrics.support.value"), description: t("hero.metrics.support.description") },
    ],
    [t],
  );

  useEffect(() => {
    if (!heroRef.current || prefersReducedMotion || isMobile) {
      return;
    }

    const heroElement = heroRef.current;
    const imageElement = heroElement.querySelector<HTMLElement>(".hero-image");
    const overlayElement = heroElement.querySelector<HTMLElement>(".hero-overlay");
    const contentElement = contentRef.current;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const eased = Math.min(scrolled, 360);

      if (imageElement) {
        imageElement.style.transform = `translateY(${eased * 0.2}px) scale(${1 + eased * 0.0005})`;
      }

      if (overlayElement) {
        overlayElement.style.opacity = `${Math.min(0.92, 0.4 + eased * 0.0012)}`;
      }

      if (contentElement) {
        contentElement.style.transform = `translateY(${eased * 0.1}px)`;
        contentElement.style.opacity = `${Math.max(0.1, 1 - eased * 0.0023)}`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[95vh] flex-col justify-center overflow-hidden bg-background pt-32 text-primary-foreground md:pt-40"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0%,_transparent_55%)]" />
        <img
          src={heroImage}
          alt="AquaPump Premium Water Technology"
          className="hero-image h-full w-full scale-105 object-cover opacity-90"
        />
        <div className="hero-overlay absolute inset-0 bg-[linear-gradient(120deg,hsl(var(--primary)/0.8)_0%,hsl(var(--primary-dark)/0.8)_42%,hsl(var(--background))_100%)]" />
        <div className="absolute -left-32 top-1/3 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-24 bottom-16 h-[420px] w-[420px] rounded-full bg-primary/30 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-center px-6 sm:top-24">
        <LogoAnimation />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pt-32 text-center sm:px-10 sm:pt-40"
      >
        <span
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-foreground"
          data-animate="zoom"
        >
          {t("hero.badge")}
        </span>

        <h1
          className="font-display text-4xl leading-tight text-primary-foreground md:text-6xl lg:text-[4rem]"
          data-animate
          style={{ "--stagger-delay": "120ms" } as CSSProperties}
        >
          {t("hero.title")}
        </h1>

        <p
          className="mx-auto max-w-3xl text-balance text-base text-primary-foreground/80 md:text-xl"
          data-animate
          style={{ "--stagger-delay": "220ms" } as CSSProperties}
        >
          {t("hero.subtitle")}
        </p>

        <div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          data-animate
          style={{ "--stagger-delay": "320ms" } as CSSProperties}
        >
          <Button
            size="lg"
            className="group h-14 rounded-full border-0 bg-gradient-to-r from-primary via-primary to-accent px-8 text-base font-semibold text-primary-foreground shadow-[0_20px_60px_rgba(9,29,78,0.25)] transition hover:-translate-y-0.5"
            asChild
          >
            <a href="#products" className="flex items-center gap-3">
              {t("hero.explore")}
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-14 rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-8 text-base text-primary-foreground backdrop-blur transition hover:border-primary-foreground hover:bg-primary-foreground/20"
            asChild
          >
            <a href="#technology">{t("hero.learn")}</a>
          </Button>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="rounded-3xl border border-primary-foreground/20 bg-primary-foreground/5 p-6 backdrop-blur"
              data-animate
              style={{ "--stagger-delay": `${420 + index * 80}ms` } as CSSProperties}
            >
              <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold text-primary-foreground">{metric.value}</p>
              <p className="mt-2 text-sm text-primary-foreground/75">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-12 flex items-center justify-center text-primary-foreground/70">
        <span className="flex items-center gap-3 text-xs uppercase tracking-[0.45em]">
          {t("hero.scrollLabel")}
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </span>
      </div>
    </section>
  );
};

export default Hero;
