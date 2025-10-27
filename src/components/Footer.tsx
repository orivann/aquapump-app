import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import brandLogo from "@/assets/brand-logo.png";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const links = [
    { heading: t("footer.products"), items: ["Industrial", "Residential", "Solar", "Smart IoT"] },
    { heading: t("footer.company"), items: ["About", "Sustainability", "Careers", "News"] },
    { heading: t("footer.support"), items: ["Contact", "Documentation", "Installation", "Warranty"] },
  ];

  const socials = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Instagram, href: "#" },
  ];

  return (
    <footer className="relative overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,63,123,0.12)_0%,_transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-8 rounded-[36px] border border-border/60 bg-muted/40 p-10 backdrop-blur md:flex-row md:items-center">
          <div className="max-w-2xl space-y-4">
            <img src={brandLogo} alt="AquaPump" className="h-12 w-auto" />
            <p className="text-sm text-muted-foreground md:text-base">{t("footer.tagline")}</p>
          </div>
          <Button
            className="rounded-full bg-gradient-to-r from-primary via-primary to-accent px-6 py-5 text-sm font-semibold text-primary-foreground shadow-glow"
            asChild
          >
            <a href="#contact">{t("nav.getStarted")}</a>
          </Button>
        </div>

        <div className="grid gap-12 md:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)]">
          <div>
            <p className="text-sm text-muted-foreground/80">Follow the AquaPump journey</p>
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
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {links.map((group) => (
              <div key={group.heading} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">{group.heading}</p>
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
