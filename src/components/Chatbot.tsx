import { type CSSProperties, useRef } from "react";
import { MessageCircle, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatWidget } from "@/contexts/ChatWidgetContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const highlightConfig = [
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
];

const Chatbot = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { open } = useChatWidget();
  const { t } = useLanguage();

  useScrollReveal(sectionRef, { threshold: 0.15 });

  const highlights = highlightConfig.map(({ key, icon }) => ({
    icon,
    title: t(`chatbot.highlight.${key}.title`),
    description: t(`chatbot.highlight.${key}.desc`),
  }));

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-primary py-24 px-6 text-primary-foreground md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14)_0%,_transparent_65%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
        <div className="space-y-6 md:w-1/2" data-animate="fade-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1 text-sm uppercase tracking-wide text-primary-foreground/80">
            <MessageCircle className="h-4 w-4" />
            {t("chatbot.badge")}
          </span>
          <h2 className="text-4xl font-semibold md:text-5xl">{t("chatbot.title")}</h2>
          <p className="text-lg text-primary-foreground/80">{t("chatbot.description")}</p>
          <div className="flex flex-wrap gap-4" data-animate="slide-right" style={{ "--stagger-delay": "90ms" } as CSSProperties}>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent-light shadow-glow"
              onClick={open}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t("chatbot.cta")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href="#contact">{t("chatbot.secondaryCta")}</a>
            </Button>
          </div>
        </div>

        <div
          className="grid gap-4 md:w-1/2 md:grid-cols-1"
          data-animate="slide-left"
          style={{ "--stagger-delay": "130ms" } as CSSProperties}
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm"
            >
              <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15">
                <item.icon className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-primary-foreground/80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chatbot;
