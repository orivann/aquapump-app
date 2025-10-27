import { type CSSProperties, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Contact = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useScrollReveal(sectionRef, { threshold: 0.15 });

  const contactItems = [
    {
      icon: Phone,
      title: t("contact.phone"),
      description: "+1 (415) 555-0199",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      description: "hello@workwave.jobs",
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      description: "575 Market Street\nSan Francisco, CA 94105",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background py-28 px-6 md:py-36"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(107,203,99,0.12)_0%,_transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center md:mb-20" data-animate>
          <h2 className="mb-6 font-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl text-transparent md:text-5xl">
            {t("contact.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-xl">
            {t("contact.intro")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.1fr)] lg:gap-20">
          <div className="space-y-6">
            {contactItems.map((item, index) => (
              <article
                key={item.title}
                className="group flex items-start gap-6 rounded-2xl border border-border bg-card/95 p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-premium"
                data-animate
                style={{ "--stagger-delay": `${index * 90}ms` } as CSSProperties}
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-accent text-accent-foreground shadow-glow transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div
            className="rounded-3xl border border-border bg-card/95 p-8 shadow-card backdrop-blur md:p-12"
            data-animate="slide-right"
            style={{ "--stagger-delay": "180ms" } as CSSProperties}
          >
            <form className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground">
                    {t("contact.form.name")}
                  </label>
                  <Input
                    id="name"
                    placeholder={t("contact.form.namePlaceholder")}
                    className="h-12 border-border bg-background text-base"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">
                    {t("contact.form.email")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("contact.form.emailPlaceholder")}
                    className="h-12 border-border bg-background text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="subject" className="text-sm font-semibold text-foreground">
                  {t("contact.form.subject")}
                </label>
                <Input
                  id="subject"
                  placeholder={t("contact.form.subjectPlaceholder")}
                  className="h-12 border-border bg-background text-base"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">
                  {t("contact.form.message")}
                </label>
                <Textarea
                  id="message"
                  placeholder={t("contact.form.messagePlaceholder")}
                  rows={6}
                  className="resize-none border-border bg-background text-base"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-accent py-6 text-lg font-semibold text-accent-foreground shadow-glow transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                {t("contact.form.send")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
