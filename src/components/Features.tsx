import { type CSSProperties, useMemo, useRef } from "react";
import { Droplet, Gauge, Leaf, Shield, Wrench, Zap } from "lucide-react";

import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const features = useMemo(
    () => [
      {
        icon: Droplet,
        titleKey: "features.flow.title",
        descKey: "features.flow.desc",
      },
      {
        icon: Zap,
        titleKey: "features.energy.title",
        descKey: "features.energy.desc",
      },
      {
        icon: Leaf,
        titleKey: "features.eco.title",
        descKey: "features.eco.desc",
      },
      {
        icon: Shield,
        titleKey: "features.durable.title",
        descKey: "features.durable.desc",
      },
      {
        icon: Gauge,
        titleKey: "features.smart.title",
        descKey: "features.smart.desc",
      },
      {
        icon: Wrench,
        titleKey: "features.install.title",
        descKey: "features.install.desc",
      },
    ],
    [t],
  );

  useScrollReveal(sectionRef, { threshold: 0.2 });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative scroll-mt-32 overflow-hidden bg-gradient-to-b from-background via-secondary/40 to-background py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,76,145,0.12)_0%,_transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 md:flex-row md:items-start md:gap-20">
        <div
          className="md:sticky md:top-28 md:h-fit md:max-w-sm"
          data-animate="slide-left"
        >
          <SectionHeading
            eyebrow={t("features.badge")}
            title={t("features.title")}
            description={t("features.subtitle")}
            align="left"
            className="gap-8"
          />
          <div className="mt-8 rounded-3xl border border-border/70 bg-muted/40 p-6 text-sm text-muted-foreground">
            <p className="leading-relaxed">
              AquaPump systems harmonise engineering, AI automation, and
              sustainable sourcing to deliver a premium experience that feels
              effortless for operators and installers alike.
            </p>
          </div>
        </div>

        <div
          className="grid flex-1 gap-6 md:grid-cols-2"
          data-animate="slide-right"
          style={{ "--stagger-delay": "120ms" } as CSSProperties}
        >
          {features.map((feature, index) => (
            <article
              key={feature.titleKey}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/90 p-8 shadow-[0_20px_40px_rgba(0,63,123,0.08)] backdrop-blur transition-transform duration-500 hover:-translate-y-2"
              data-animate
              style={{ "--stagger-delay": `${index * 90}ms` } as CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-6 text-xl font-semibold text-foreground">
                {t(feature.titleKey)}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
