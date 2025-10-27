import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';
import animationWaves from '@/assets/animation-waves.gif';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-background text-foreground">
      {/* Animation Section */}
      <div className="relative bg-white py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <img 
              src={animationWaves} 
              alt="AquaPump Flow Animation" 
              className="mx-auto w-full max-w-2xl h-auto animate-float"
            />
          </div>
        </div>
        {/* Decorative gradient overlays */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-accent/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      </div>

      {/* Footer Content */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={logoIcon} alt="AquaPump" className="h-16 w-auto" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.tagline')}
              </p>
            <div className="flex gap-4">
              <a href="#" className="text-foreground hover:text-accent transition-all duration-300 hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-accent transition-all duration-300 hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-accent transition-all duration-300 hover:scale-110">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-accent transition-all duration-300 hover:scale-110">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 font-semibold text-primary">{t('footer.products')}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Industrial Series</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Residential Series</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Solar Series</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Smart IoT Series</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-primary">{t('footer.company')}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Sustainability</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">News</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold text-primary">{t('footer.support')}</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Installation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-200">Warranty</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {t('footer.copyright')}
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;