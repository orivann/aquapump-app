import { type CSSProperties, useEffect, useMemo, useRef } from "react";

import SectionHeading from "@/components/SectionHeading";
import technologyImage from "@/assets/technology.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Technology = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  const highlights = useMemo(
    () => [
      {
        title: t("tech.materials.title"),
        description: t("tech.materials.desc"),
      },
      { title: t("tech.controls.title"), description: t("tech.controls.desc") },
      { title: t("tech.tested.title"), description: t("tech.tested.desc") },
    ],
    [t],
  );

  useScrollReveal(sectionRef, { threshold: 0.2 });

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion || isMobile) {
      return;
    }

    const section = sectionRef.current;
    const imageElement = section.querySelector<HTMLElement>(".tech-image");
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / viewportHeight));

      if (imageElement) {
        imageElement.style.transform = `scale(${1 + progress * 0.06}) translateY(${progress * -30}px)`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative scroll-mt-32 overflow-hidden bg-background py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,63,123,0.14)_0%,_transparent_65%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_1fr)] lg:gap-20">
        <div
          className="relative order-2 h-full lg:order-1"
          data-animate="slide-left"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-muted/40 p-10 backdrop-blur">
            <SectionHeading
              eyebrow={t("tech.badge")}
              title={t("tech.title")}
              description={t("tech.intro")}
              align="left"
              className="gap-10"
            />

            <div className="mt-10 space-y-5">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border/50 bg-background/60 p-6 shadow-[0_18px_32px_rgba(0,0,0,0.06)] backdrop-blur"
                  data-animate
                  style={
                    {
                      "--stagger-delay": `${180 + index * 90}ms`,
                    } as CSSProperties
                  }
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2" data-animate="zoom">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[540px] overflow-hidden rounded-[36px] border border-border/50 bg-primary/10 shadow-[0_28px_60px_rgba(0,63,123,0.18)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-accent/20" />
            <img
              src={technologyImage}
              alt="Advanced AquaPump engineering"
              className="tech-image h-full w-full object-cover transition-transform duration-1000 ease-out"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-primary/30 bg-background/70 p-4 text-sm text-muted-foreground backdrop-blur">
              Built for real-world extremes — pressure, salinity, temperature.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
