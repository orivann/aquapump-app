import { FormEvent, useState } from "react";
import { Facebook, Instagram, Linkedin, Loader2, Twitter } from "lucide-react";

import brandLogo from "@/assets/logo-full-trimmed.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { subscribeToNewsletter } from "@/lib/newsletterApi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const links = [
    {
      heading: t("footer.products"),
      items: ["Industrial", "Residential", "Solar", "Smart IoT"],
    },
    {
      heading: t("footer.company"),
      items: ["About", "Sustainability", "Careers", "News"],
    },
    {
      heading: t("footer.support"),
      items: ["Contact", "Documentation", "Installation", "Warranty"],
    },
  ];

  const socials = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setFeedbackMessage(null);

    try {
      await subscribeToNewsletter(email, {
        source: "footer-newsletter",
        metadata: {
          language,
        },
      });
      setEmail("");
      setStatus("success");
      setFeedbackMessage(t("footer.newsletterSuccess"));
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedbackMessage(t("footer.newsletterError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,63,123,0.12)_0%,_transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[36px] border border-border/60 bg-muted/40 p-10 backdrop-blur md:flex-row md:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={brandLogo}
                alt="AquaPump"
                className="h-12 w-auto object-contain sm:h-14"
              />
              <span className="font-display text-2xl tracking-tight">
                AquaPump
              </span>
            </div>
            <p className="text-sm text-muted-foreground md:text-base">
              {t("footer.tagline")}
            </p>
          </div>
          <Button
            className="rounded-full bg-gradient-to-r from-primary via-primary to-accent px-6 py-5 text-sm font-semibold text-primary-foreground shadow-glow"
            asChild
          >
            <a href="#contact">{t("nav.getStarted")}</a>
          </Button>
        </div>

        <div className="grid gap-12 md:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)]">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground/80">
              Follow the AquaPump journey
            </p>
            <div className="mt-4 flex gap-4">
              {socials.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition hover:border-border hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <div className="rounded-3xl border border-border/60 bg-background/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold text-foreground">
                {t("footer.newsletterTitle")}
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={handleNewsletterSubmit}
              >
                <Input
                  type="email"
                  placeholder={t("footer.newsletterPlaceholder") ?? ""}
                  className="h-11 flex-1 rounded-2xl border-border bg-background/70"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="submit"
                  className="h-11 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent px-6 text-sm font-semibold text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("footer.newsletterCta")}
                    </span>
                  ) : (
                    t("footer.newsletterCta")
                  )}
                </Button>
              </form>
              {feedbackMessage ? (
                <p
                  className={`mt-2 text-xs ${status === "error" ? "text-destructive" : "text-foreground"}`}
                  aria-live="polite"
                >
                  {feedbackMessage}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                {t("footer.newsletterNote")}
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {links.map((group) => (
              <div key={group.heading} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                  {group.heading}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="transition hover:text-foreground">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 text-xs text-muted-foreground/80">
          &copy; {currentYear} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
