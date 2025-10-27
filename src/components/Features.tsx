import { type CSSProperties, useRef } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Rocket,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const features = [
    {
      icon: BriefcaseBusiness,
      titleKey: "features.flow.title",
      descKey: "features.flow.desc",
    },
    {
      icon: Send,
      titleKey: "features.energy.title",
      descKey: "features.energy.desc",
    },
    {
      icon: Users,
      titleKey: "features.eco.title",
      descKey: "features.eco.desc",
    },
    {
      icon: ShieldCheck,
      titleKey: "features.durable.title",
      descKey: "features.durable.desc",
    },
    {
      icon: BarChart3,
      titleKey: "features.smart.title",
      descKey: "features.smart.desc",
    },
    {
      icon: Rocket,
      titleKey: "features.install.title",
      descKey: "features.install.desc",
    },
  ];

  useScrollReveal(sectionRef, { threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/50 to-background py-28 px-6 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(107,203,99,0.14)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center md:mb-20" data-animate>
          <h2 className="mb-6 font-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl text-transparent md:text-5xl">
            {t("features.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.titleKey}
              className="group rounded-3xl border border-transparent bg-card/95 p-8 shadow-card backdrop-blur transition-all duration-500 hover:-translate-y-3 hover:border-accent/40 hover:shadow-premium"
              data-animate
              style={{ "--stagger-delay": `${index * 80}ms` } as CSSProperties}
            >
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent text-accent-foreground shadow-glow transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-9 w-9" />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-card-foreground transition-colors duration-300 group-hover:text-accent">
                {t(feature.titleKey)}
              </h3>

              <p className="text-base leading-relaxed text-muted-foreground">
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
