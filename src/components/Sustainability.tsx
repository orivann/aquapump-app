import { type CSSProperties, useEffect, useMemo, useRef } from "react";

import sustainabilityImage from "@/assets/sustainability.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Sustainability = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useScrollReveal(sectionRef, { threshold: 0.2 });

  const metrics = useMemo(
    () => [
      { value: "60%", label: t("sustain.energy") },
      { value: "100%", label: t("sustain.recyclable") },
      { value: "25+", label: t("sustain.lifespan") },
      { value: t("sustain.emissionsValue"), label: t("sustain.emissions") },
    ],
    [t]
  );

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion || isMobile) {
      return;
    }

    const section = sectionRef.current;
    const imageElement = section.querySelector<HTMLElement>(".sustain-image");
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, 1 - rect.top / viewportHeight));

      if (imageElement) {
        imageElement.style.transform = `scale(${1 + progress * 0.08}) translateY(${progress * -30}px)`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-hero py-28 text-primary-foreground md:py-36"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(107,203,99,0.18)_0%,_transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-7" data-animate="slide-left">
            <h2 className="font-display text-3xl drop-shadow-lg md:text-5xl">
              {t("sustain.title")}
            </h2>

            <p className="text-base leading-relaxed text-primary-foreground/90 md:text-xl">
              {t("sustain.intro")}
            </p>

            <div className="grid gap-5 pt-4 sm:grid-cols-2">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="group rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/15 hover:shadow-xl"
                  data-animate
                  style={{ "--stagger-delay": `${index * 90}ms` } as CSSProperties}
                >
                  <div className="mb-2 text-4xl font-bold text-accent transition-transform duration-300 group-hover:scale-105 md:text-5xl">
                    {metric.value}
                  </div>
                  <div className="text-sm leading-relaxed text-primary-foreground/85 md:text-base">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="group relative mx-auto h-[320px] w-full max-w-[520px] overflow-hidden rounded-3xl shadow-premium sm:h-[420px] lg:h-[520px] lg:max-w-none"
            data-animate="zoom"
            style={{ "--stagger-delay": "160ms" } as CSSProperties}
          >
            <img
              src={sustainabilityImage}
              alt="Sustainable Water Technology"
              className="sustain-image h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/35 via-accent/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
