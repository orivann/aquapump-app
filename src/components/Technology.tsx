import { type CSSProperties, useEffect, useRef } from "react";

import technologyImage from "@/assets/technology.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Technology = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollReveal(sectionRef, { threshold: 0.15 });

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
        imageElement.style.transform = `scale(${1 + progress * 0.08}) translateY(${progress * -40}px)`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-28 md:py-36"
    >
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(0,63,123,0.15)_0%,_transparent_65%)] lg:block" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_1fr)] lg:gap-20">
          <div
            className="group relative mx-auto h-[320px] w-full max-w-[520px] overflow-hidden rounded-3xl shadow-premium sm:h-[420px] lg:h-[520px] lg:max-w-none"
            data-animate="zoom"
          >
            <img
              src={technologyImage}
              alt="Advanced Water Pump Technology"
              className="tech-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-primary/10 to-transparent" />
          </div>

          <div className="space-y-7" data-animate="slide-right" style={{ "--stagger-delay": "160ms" } as CSSProperties}>
            <h2 className="font-display text-3xl text-primary md:text-5xl">
              {t("tech.title")}
            </h2>

            <p className="text-base leading-relaxed text-foreground/80 md:text-xl">
              {t("tech.intro")}
            </p>

            <div className="space-y-5 rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-primary">{t("tech.materials.title")}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {t("tech.materials.desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-primary">{t("tech.controls.title")}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {t("tech.controls.desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-primary">{t("tech.tested.title")}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {t("tech.tested.desc")}
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
