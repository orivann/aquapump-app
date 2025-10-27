import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

import logoIcon from '@/assets/logo-icon.png';
import animationWaves from '@/assets/animation-waves.gif';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-background text-foreground">
      <div className="relative overflow-hidden bg-white py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <img
              src={animationWaves}
              alt="WorkWave hiring animation"
              className="mx-auto h-auto w-full max-w-2xl animate-float"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-accent/10 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={logoIcon} alt="WorkWave Careers" className="h-16 w-auto" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('footer.tagline')}</p>
              <div className="flex gap-4">
                <a href="#" className="text-foreground transition-all duration-300 hover:scale-110 hover:text-accent">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-foreground transition-all duration-300 hover:scale-110 hover:text-accent">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-foreground transition-all duration-300 hover:scale-110 hover:text-accent">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-foreground transition-all duration-300 hover:scale-110 hover:text-accent">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-primary">{t('footer.products')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#products" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    {t('products.pro.name')}
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    {t('products.eco.name')}
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    {t('products.solar.name')}
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    {t('products.smart.name')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-primary">{t('footer.company')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    About WorkWave
                  </a>
                </li>
                <li>
                  <a href="#technology" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    Platform
                  </a>
                </li>
                <li>
                  <a href="#assistant" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    AI copilot
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-primary">{t('footer.support')}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#contact" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    Help center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground transition-colors duration-200 hover:text-accent">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">&copy; {currentYear} {t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
