import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoFull from '@/assets/logo-full.png';
import logoIcon from '@/assets/logo-icon.png';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.technology'), href: '#technology' },
    { name: t('nav.sustainability'), href: '#sustainability' },
    { name: t('nav.products'), href: '#products' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-card' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src={isScrolled ? logoIcon : logoIcon} 
              alt="AquaPump" 
              className="h-12 w-auto md:hidden"
            />
            <img 
              src={isScrolled ? logoFull : logoFull} 
              alt="AquaPump" 
              className="hidden md:block h-12 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                {link.name}
              </a>
            ))}
            <LanguageSwitcher />
            <Button 
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent-light shadow-glow"
            >
              {t('nav.getStarted')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden transition-colors ${
              isScrolled ? 'text-primary' : 'text-primary-foreground'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border shadow-card">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-foreground hover:text-accent transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-border">
              <LanguageSwitcher />
            </div>
            <Button 
              className="w-full bg-accent text-accent-foreground hover:bg-accent-light shadow-glow"
            >
              {t('nav.getStarted')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
