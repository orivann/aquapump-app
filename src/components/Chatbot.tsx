import { type CSSProperties, useMemo, useRef } from "react";
import { MessageCircle, ShieldCheck, Sparkles, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useChatWidget } from "@/contexts/ChatWidgetContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Chatbot = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { open } = useChatWidget();
  const { t } = useLanguage();

  useScrollReveal(sectionRef, { threshold: 0.15 });

  const highlights = useMemo(
    () => [
      {
        key: "instant",
        icon: Sparkles,
      },
      {
        key: "reliable",
        icon: ShieldCheck,
      },
      {
        key: "available",
        icon: Timer,
      },
    ],
    [],
  ).map(({ key, icon }) => ({
    icon,
    title: t(`chatbot.highlight.${key}.title`),
    description: t(`chatbot.highlight.${key}.desc`),
  }));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary-dark text-primary-foreground"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18)_0%,_transparent_65%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-24 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex-1 space-y-6" data-animate="fade-in">
          <SectionHeading
            eyebrow={t("chatbot.badge")}
            title={t("chatbot.title")}
            description={t("chatbot.description")}
            align="left"
            className="[&>div>h2]:text-primary-foreground [&>div>p]:text-primary-foreground/80"
            actions={
              <>
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary-foreground via-primary-foreground to-accent px-6 text-base font-semibold text-primary shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:-translate-y-0.5"
                  onClick={open}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t("chatbot.cta")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary-foreground/40 bg-primary-foreground/10 px-6 text-base text-primary-foreground hover:bg-primary-foreground/20"
                  asChild
                >
                  <a href="#contact">{t("chatbot.secondaryCta")}</a>
                </Button>
              </>
            }
          />
        </div>

        <div
          className="grid flex-1 gap-5 md:grid-cols-3"
          data-animate="slide-left"
          style={{ "--stagger-delay": "140ms" } as CSSProperties}
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-3xl border border-primary-foreground/20 bg-primary-foreground/5 p-6 text-primary-foreground"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/20 text-primary">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-primary-foreground/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chatbot;
