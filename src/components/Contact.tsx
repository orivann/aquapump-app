import { type CSSProperties, useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeading from "@/components/SectionHeading";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import useScrollReveal from "@/hooks/use-scroll-reveal";

const Contact = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, { threshold: 0.15 });

  const contactItems = [
    { icon: Phone, title: t("contact.phone"), description: "+1 (555) 123-4567" },
    { icon: Mail, title: t("contact.email"), description: "info@aquapump.com" },
    {
      icon: MapPin,
      title: t("contact.location"),
      description: "123 Water Street\nInnovation City, IC 12345",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,63,123,0.12)_0%,_transparent_65%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.1fr)] lg:gap-20">
        <div className="space-y-8" data-animate="slide-left">
          <SectionHeading
            eyebrow={t("contact.badge")}
            title={t("contact.title")}
            description={t("contact.intro")}
            align="left"
          />

          <div className="rounded-[32px] border border-border/60 bg-muted/40 p-8 backdrop-blur">
            <ul className="space-y-6">
              {contactItems.map((item, index) => (
                <li
                  key={item.title}
                  className="flex items-start gap-4"
                  data-animate
                  style={{ "--stagger-delay": `${index * 90}ms` } as CSSProperties}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/80 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">{item.title}</p>
                    <p className="mt-1 whitespace-pre-line text-base text-foreground">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="rounded-[36px] border border-border/60 bg-card/90 p-8 shadow-[0_24px_48px_rgba(0,0,0,0.08)] backdrop-blur md:p-12"
          data-animate="slide-right"
          style={{ "--stagger-delay": "160ms" } as CSSProperties}
        >
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-semibold text-muted-foreground/90">
                  {t("contact.form.name")}
                </label>
                <Input id="name" placeholder={t("contact.form.namePlaceholder") ?? ""} className="h-12 rounded-xl border-border" />
              </div>
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-semibold text-muted-foreground/90">
                  {t("contact.form.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder") ?? ""}
                  className="h-12 rounded-xl border-border"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="subject" className="text-sm font-semibold text-muted-foreground/90">
                {t("contact.form.subject")}
              </label>
              <Input
                id="subject"
                placeholder={t("contact.form.subjectPlaceholder") ?? ""}
                className="h-12 rounded-xl border-border"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-semibold text-muted-foreground/90">
                {t("contact.form.message")}
              </label>
              <Textarea
                id="message"
                placeholder={t("contact.form.messagePlaceholder") ?? ""}
                rows={6}
                className="rounded-2xl border-border"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-primary via-primary to-accent py-6 text-lg font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              {t("contact.form.send")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
