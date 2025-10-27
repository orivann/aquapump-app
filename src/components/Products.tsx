import { type CSSProperties, useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Products = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const products = useMemo(
    () => [
      {
        nameKey: "products.pro.name",
        categoryKey: "products.pro.category",
        descKey: "products.pro.desc",
        specs: ["50-500 HP", "Up to 10,000 GPM", "Smart Controls"],
      },
      {
        nameKey: "products.eco.name",
        categoryKey: "products.eco.category",
        descKey: "products.eco.desc",
        specs: ["1-10 HP", "Up to 500 GPM", "Ultra Quiet"],
      },
      {
        nameKey: "products.solar.name",
        categoryKey: "products.solar.category",
        descKey: "products.solar.desc",
        specs: ["Solar Ready", "Battery Backup", "Off-Grid"],
      },
      {
        nameKey: "products.smart.name",
        categoryKey: "products.smart.category",
        descKey: "products.smart.desc",
        specs: ["IoT Enabled", "Mobile App", "Predictive AI"],
      },
    ],
    []
  );

  useScrollReveal(sectionRef, { threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-secondary to-background py-28 px-6 md:py-36"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(0,63,123,0.12)_0%,_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center md:mb-20" data-animate>
          <h2 className="mb-6 font-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl text-transparent md:text-5xl">
            {t("products.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
            {t("products.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.nameKey}
              className="group relative overflow-hidden rounded-3xl border border-transparent bg-card shadow-card transition-all duration-500 hover:-translate-y-3 hover:border-accent/40 hover:shadow-premium"
              data-animate
              style={{ "--stagger-delay": `${index * 80}ms` } as CSSProperties}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-accent transition-all duration-300 group-hover:h-2" />

              <div className="relative flex h-full flex-col p-8">
                <div className="mb-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {t(product.categoryKey)}
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground transition-colors duration-300 group-hover:text-accent">
                    {t(product.nameKey)}
                  </h3>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t(product.descKey)}
                </p>

                <div className="mb-8 space-y-3 text-sm text-muted-foreground">
                  {product.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-3">
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                      {spec}
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    variant="ghost"
                    className="group/btn w-full justify-between text-primary hover:bg-accent/10 hover:text-accent transition-all duration-300"
                  >
                    {t("products.learnMore")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
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
