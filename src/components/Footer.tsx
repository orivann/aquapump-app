import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoIcon} alt="AquaPump" className="h-16 w-auto" />
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 font-semibold text-accent">{t('footer.products')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Industrial Series</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Residential Series</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Solar Series</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Smart IoT Series</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-accent">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">News</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold text-accent">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Installation</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Warranty</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {currentYear} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
