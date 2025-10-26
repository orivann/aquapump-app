import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-background py-24 px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 font-display text-primary">
                {t('contact.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('contact.intro')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                  <Phone className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t('contact.phone')}</div>
                  <div className="text-muted-foreground">+1 (555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t('contact.email')}</div>
                  <div className="text-muted-foreground">info@aquapump.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
                  <MapPin className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t('contact.location')}</div>
                  <div className="text-muted-foreground">
                    123 Water Street<br />
                    Innovation City, IC 12345
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-secondary p-8 shadow-card md:p-10">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    {t('contact.form.name')}
                  </label>
                  <Input 
                    id="name"
                    placeholder={t('contact.form.namePlaceholder')}
                    className="border-border bg-background"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    {t('contact.form.email')}
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="border-border bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  {t('contact.form.subject')}
                </label>
                <Input 
                  id="subject"
                  placeholder={t('contact.form.subjectPlaceholder')}
                  className="border-border bg-background"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  {t('contact.form.message')}
                </label>
                <Textarea 
                  id="message"
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={5}
                  className="border-border bg-background resize-none"
                />
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-glow transition-all duration-300 hover:scale-105"
              >
                {t('contact.form.send')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
