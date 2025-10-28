import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import brandLogo from "@/assets/logo-full-trimmed.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useChatWidget } from "@/contexts/ChatWidgetContext";
import { useIsMobile } from "@/hooks/use-mobile";

import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { open } = useChatWidget();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
      return;
    }

    if (typeof document === "undefined") {
      return;
    }

    const { body } = document;
    if (isMobileMenuOpen) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }

    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || typeof document === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = useMemo(
    () => [
      { name: t("nav.features"), href: "#features" },
      { name: t("nav.technology"), href: "#technology" },
      { name: t("nav.sustainability"), href: "#sustainability" },
      { name: t("nav.products"), href: "#products" },
      { name: t("nav.contact"), href: "#contact" },
    ],
    [t],
  );

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/85 shadow-[0_4px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          : "bg-gradient-to-b from-background/80 via-background/40 to-transparent backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-4">
          <img
            src={brandLogo}
            alt="AquaPump"
            className="h-14 w-auto object-contain md:h-16"
          />
        </a>

        <div className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative transition-colors duration-300 hover:text-foreground"
                >
                  <span className="after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all after:duration-500 hover:after:w-full">
                    {link.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              className="hidden h-10 rounded-full border border-border/40 bg-muted/60 px-5 text-sm font-semibold text-foreground shadow-none transition hover:border-border hover:bg-background/80 md:inline-flex"
              asChild
            >
              <a href="#contact">{t("nav.getStarted")}</a>
            </Button>
            <Button
              size="sm"
              className="h-11 rounded-full bg-gradient-to-r from-primary via-primary to-accent px-5 text-sm font-semibold text-primary-foreground shadow-glow"
              onClick={open}
            >
              {t("chatbot.cta")}
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/50 text-foreground transition hover:border-border md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="md:hidden">
          <div
            id="mobile-navigation"
            className="mx-4 mb-4 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-border/60 bg-background/95 p-6 shadow-lg backdrop-blur"
          >
            <ul className="space-y-3 text-sm font-medium text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-muted/30 px-4 py-3 text-foreground transition hover:bg-muted/60"
                  >
                    {link.name}
                    <span className="text-xs text-muted-foreground/70">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <LanguageSwitcher />
              <Button
                className="h-11 w-full rounded-full bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  open();
                }}
              >
                {t("chatbot.cta")}
              </Button>
              <Button
                variant="ghost"
                className="h-11 w-full rounded-full border border-border/50 text-foreground"
                asChild
              >
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.getStarted")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
