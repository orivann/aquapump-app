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
    [t],
  );

  useScrollReveal(sectionRef, { threshold: 0.2 });

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative scroll-mt-32 overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background pt-40 pb-32 sm:pt-64 sm:pb-40 lg:pt-80"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(0,63,123,0.16)_0%,_transparent_82%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(circle_at_bottom,_rgba(0,63,123,0.12)_0%,_transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6">
        <SectionHeading
          eyebrow={t("products.badge")}
          title={t("products.title")}
          description={t("products.subtitle")}
          className="mx-auto max-w-3xl gap-14 [&>div]:gap-7"
        />

        <div
          role="list"
          aria-label={t("products.listAriaLabel")}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:snap-none md:[-ms-overflow-style:auto] md:[scrollbar-width:auto] xl:grid-cols-4"
          data-animate
          style={{ "--stagger-delay": "120ms" } as CSSProperties}
        >
          {products.map((product, index) => (
            <article
              key={product.nameKey}
              role="listitem"
              className="group relative flex min-w-[280px] flex-1 flex-col overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-8 shadow-[0_22px_45px_rgba(0,63,123,0.12)] backdrop-blur transition hover:-translate-y-2 md:min-w-0"
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
          <article
            role="listitem"
            className="relative flex min-w-[280px] flex-1 flex-col gap-6 overflow-hidden rounded-[28px] border border-primary/40 bg-gradient-to-br from-primary via-primary-dark to-background p-8 text-primary-foreground shadow-[0_35px_70px_rgba(0,63,123,0.35)] transition hover:-translate-y-2 md:col-span-2 md:min-w-0 xl:col-span-4"
            data-animate
            style={{ "--stagger-delay": "460ms" } as CSSProperties}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(120deg, rgba(255,255,255,0.25) 0%, transparent 60%),
                  radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 45%)
                `,
              }}
            />
            <div className="relative flex flex-col gap-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-foreground/70">{t("products.badge")}</p>
              <h3 className="text-3xl font-semibold leading-tight">{t("products.configureTitle")}</h3>
              <p className="text-sm text-primary-foreground/85">{t("products.configureSubtitle")}</p>
            </div>
            <div className="relative mt-auto flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="rounded-full border-none bg-primary-foreground px-6 text-base font-semibold text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <a href="#contact">{t("products.configureCta")}</a>
              </Button>
              <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/70">
                {t("products.configureHelper")}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Products;
