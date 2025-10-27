import { type CSSProperties, useEffect, useMemo, useRef } from "react";

import SectionHeading from "@/components/SectionHeading";
import sustainabilityImage from "@/assets/sustainability.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Sustainability = () => {
  const sectionRef = useRef<HTMLElement>(null);
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
    [t],
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
        imageElement.style.transform = `scale(${1 + progress * 0.06}) translateY(${progress * -24}px)`;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(107,203,99,0.16)_0%,_transparent_65%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative" data-animate="zoom">
          <div className="relative mx-auto overflow-hidden rounded-[36px] border border-border/60 bg-background/60 shadow-[0_30px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <img
              src={sustainabilityImage}
              alt="Sustainable AquaPump deployment"
              className="sustain-image h-full w-full object-cover transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-accent/30 bg-background/80 p-4 text-sm text-muted-foreground backdrop-blur">
              Solar-ready, recyclable alloys, and closed-loop manufacturing.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8" data-animate="slide-right" style={{ "--stagger-delay": "120ms" } as CSSProperties}>
          <SectionHeading
            eyebrow={t("sustain.badge")}
            title={t("sustain.title")}
            description={t("sustain.intro")}
            align="left"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-border/60 bg-muted/40 p-6 transition hover:-translate-y-1 hover:border-accent/40"
                data-animate
                style={{ "--stagger-delay": `${220 + index * 70}ms` } as CSSProperties}
              >
                <p className="text-3xl font-semibold text-foreground md:text-4xl">{metric.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
