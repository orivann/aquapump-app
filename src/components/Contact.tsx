import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-gradient-to-b from-background via-muted/20 to-background py-32 px-6 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-6 font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('contact.intro')}
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="group flex items-start gap-6 p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground mb-2">{t('contact.phone')}</div>
                  <div className="text-muted-foreground text-base">+1 (555) 123-4567</div>
                </div>
              </div>

              <div className="group flex items-start gap-6 p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground mb-2">{t('contact.email')}</div>
                  <div className="text-muted-foreground text-base">info@aquapump.com</div>
                </div>
              </div>

              <div className="group flex items-start gap-6 p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-lg text-foreground mb-2">{t('contact.location')}</div>
                  <div className="text-muted-foreground text-base leading-relaxed">
                    123 Water Street<br />
                    Innovation City, IC 12345
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-card p-10 shadow-card border border-border hover:shadow-xl transition-shadow duration-300 md:p-12">
            <form className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground">
                    {t('contact.form.name')}
                  </label>
                  <Input 
                    id="name"
                    placeholder={t('contact.form.namePlaceholder')}
                    className="border-border bg-background h-12 text-base"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">
                    {t('contact.form.email')}
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="border-border bg-background h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="subject" className="text-sm font-semibold text-foreground">
                  {t('contact.form.subject')}
                </label>
                <Input 
                  id="subject"
                  placeholder={t('contact.form.subjectPlaceholder')}
                  className="border-border bg-background h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">
                  {t('contact.form.message')}
                </label>
                <Textarea 
                  id="message"
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={6}
                  className="border-border bg-background resize-none text-base"
                />
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-xl py-7 text-lg"
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
