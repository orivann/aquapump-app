import { type CSSProperties, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Products = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const products = useMemo(
    () => [
      {
        nameKey: "products.pro.name",
        categoryKey: "products.pro.category",
        descKey: "products.pro.desc",
        specs: ["50-500 HP", "Up to 10,000 GPM", "Smart controls"],
        gradient: "from-primary/60 via-primary/40 to-accent/30",
      },
      {
        nameKey: "products.eco.name",
        categoryKey: "products.eco.category",
        descKey: "products.eco.desc",
        specs: ["1-10 HP", "Up to 500 GPM", "Ultra quiet"],
        gradient: "from-accent/50 via-accent/30 to-primary/20",
      },
      {
        nameKey: "products.solar.name",
        categoryKey: "products.solar.category",
        descKey: "products.solar.desc",
        specs: ["Solar ready", "Battery backup", "Off-grid"],
        gradient: "from-yellow-300/50 via-accent/30 to-primary/20",
      },
      {
        nameKey: "products.smart.name",
        categoryKey: "products.smart.category",
        descKey: "products.smart.desc",
        specs: ["IoT enabled", "Mobile app", "Predictive AI"],
        gradient: "from-purple-300/40 via-primary/30 to-accent/20",
      },
    ],
    [],
  );

  useScrollReveal(sectionRef, { threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background py-24 sm:py-28"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(0,63,123,0.16)_0%,_transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-10">
        <SectionHeading
          eyebrow={t("products.badge")}
          title={t("products.title")}
          description={t("products.subtitle")}
          className="gap-5"
        />

        <div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          data-animate
          style={{ "--stagger-delay": "120ms" } as CSSProperties}
        >
          {products.map((product, index) => (
            <article
              key={product.nameKey}
              className="group relative flex flex-col overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-7 shadow-[0_22px_45px_rgba(0,63,123,0.12)] backdrop-blur transition hover:-translate-y-2 sm:p-8"
              data-animate
              style={{ "--stagger-delay": `${index * 80}ms` } as CSSProperties}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-80 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative flex h-full flex-col gap-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                  {t(product.categoryKey)}
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{t(product.nameKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(product.descKey)}</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-3">
                      <span className="h-[1px] w-6 bg-foreground/30" />
                      {spec}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <Button
                    variant="ghost"
                    className="group/link w-full justify-between rounded-full border border-border/60 bg-background/60 text-sm font-semibold text-foreground transition hover:border-border hover:bg-background"
                  >
                    {t("products.learnMore")}
                    <ArrowUpRight className="h-4 w-4 transition group-hover/link:translate-x-1" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
