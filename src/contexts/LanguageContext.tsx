import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.technology': 'Technology',
    'nav.sustainability': 'Sustainability',
    'nav.products': 'Products',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',
    
    // Hero
    'hero.badge': 'Premium Water Systems',
    'hero.title': 'The Future of Water Technology',
    'hero.subtitle': 'Your Pump, Our Solution — Premium, sustainable, eco-friendly water pump systems',
    'hero.explore': 'Explore Products',
    'hero.learn': 'Learn More',
    'hero.scrollLabel': 'Scroll',
    
    // Features
    'features.title': 'Innovation in Every Drop',
    'features.subtitle': 'Cutting-edge features designed for maximum efficiency, sustainability, and performance',
    'features.flow.title': 'Advanced Flow Technology',
    'features.flow.desc': 'Precision-engineered water flow systems for optimal performance and efficiency.',
    'features.energy.title': 'Energy Efficient',
    'features.energy.desc': 'Smart power management reduces energy consumption by up to 60%.',
    'features.eco.title': 'Eco-Friendly Design',
    'features.eco.desc': 'Sustainable materials and green technology for a better tomorrow.',
    'features.durable.title': 'Built to Last',
    'features.durable.desc': 'Premium materials ensure decades of reliable, maintenance-free operation.',
    'features.smart.title': 'Smart Monitoring',
    'features.smart.desc': 'Real-time performance tracking and intelligent diagnostics.',
    'features.install.title': 'Easy Installation',
    'features.install.desc': 'Streamlined setup process with comprehensive support.',
    
    // Technology
    'tech.title': 'Precision Engineering',
    'tech.intro': 'Our water pump systems represent the pinnacle of modern engineering. Every component is meticulously designed and tested to deliver unparalleled performance, efficiency, and reliability.',
    'tech.materials.title': 'Advanced Materials',
    'tech.materials.desc': 'Corrosion-resistant alloys ensure decades of maintenance-free operation',
    'tech.controls.title': 'Smart Controls',
    'tech.controls.desc': 'Intelligent automation optimizes performance in real-time',
    'tech.tested.title': 'Tested Excellence',
    'tech.tested.desc': 'Rigorous quality control in extreme conditions',
    
    // Sustainability
    'sustain.title': 'Green. Sustainable. Future-Ready.',
    'sustain.intro': 'At AquaPump, we believe in creating solutions that don\'t just serve today\'s needs, but protect tomorrow\'s world. Our eco-friendly technology reduces environmental impact while delivering superior performance.',
    'sustain.energy': 'Energy Reduction',
    'sustain.recyclable': 'Recyclable Materials',
    'sustain.lifespan': 'Years Lifespan',
    'sustain.emissions': 'Harmful Emissions',
    'sustain.emissionsValue': 'Net Zero',
    
    // Products
    'products.title': 'Our Product Range',
    'products.subtitle': 'From residential to industrial, discover the perfect water pump solution for your needs',
    'products.pro.category': 'Industrial Series',
    'products.pro.name': 'AquaPump Pro',
    'products.pro.desc': 'High-capacity pumping for large-scale operations',
    'products.eco.category': 'Residential Series',
    'products.eco.name': 'AquaPump Eco',
    'products.eco.desc': 'Perfect for homes and small businesses',
    'products.solar.category': 'Green Energy Series',
    'products.solar.name': 'AquaPump Solar',
    'products.solar.desc': 'Solar-powered sustainable water solutions',
    'products.smart.category': 'IoT Series',
    'products.smart.name': 'AquaPump Smart',
    'products.smart.desc': 'Connected pumps with AI-powered optimization',
    'products.learnMore': 'Learn More',
    
    // Contact
    'contact.title': 'Let\'s Connect',
    'contact.intro': 'Ready to transform your water management? Our team is here to help you find the perfect solution for your needs.',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.form.name': 'Name',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subjectPlaceholder': 'How can we help?',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell us about your project...',
    'contact.form.send': 'Send Message',
    
    // Footer
    'footer.tagline': 'Your Pump, Our Solution. Leading the future of sustainable water technology.',
    'footer.products': 'Products',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.copyright': 'AquaPump. All rights reserved.',
  },
  he: {
    // Navbar
    'nav.features': 'תכונות',
    'nav.technology': 'טכנולוגיה',
    'nav.sustainability': 'קיימות',
    'nav.products': 'מוצרים',
    'nav.contact': 'צור קשר',
    'nav.getStarted': 'התחל עכשיו',
    
    // Hero
    'hero.badge': 'מערכות מים פרימיום',
    'hero.title': 'העתיד של טכנולוגיית המים',
    'hero.subtitle': 'המשאבה שלך, הפתרון שלנו — מערכות משאבות מים פרימיום, בנות קיימא וידידותיות לסביבה',
    'hero.explore': 'גלה מוצרים',
    'hero.learn': 'למד עוד',
    'hero.scrollLabel': 'גלול',
    
    // Features
    'features.title': 'חדשנות בכל טיפה',
    'features.subtitle': 'תכונות מתקדמות שתוכננו ליעילות, קיימות וביצועים מקסימליים',
    'features.flow.title': 'טכנולוגיית זרימה מתקדמת',
    'features.flow.desc': 'מערכות זרימת מים מהונדסות בדיוק לביצועים ויעילות אופטימליים.',
    'features.energy.title': 'יעילות אנרגטית',
    'features.energy.desc': 'ניהול חכם של צריכת חשמל מפחית את צריכת האנרגיה עד 60%.',
    'features.eco.title': 'עיצוב ידידותי לסביבה',
    'features.eco.desc': 'חומרים בני קיימא וטכנולוגיה ירוקה למען מחר טוב יותר.',
    'features.durable.title': 'בנוי להחזיק מעמד',
    'features.durable.desc': 'חומרים פרימיום מבטיחים עשרות שנים של תפעול אמין וללא תחזוקה.',
    'features.smart.title': 'ניטור חכם',
    'features.smart.desc': 'מעקב ביצועים בזמן אמת ואבחון אינטליגנטי.',
    'features.install.title': 'התקנה קלה',
    'features.install.desc': 'תהליך התקנה יעיל עם תמיכה מקיפה.',
    
    // Technology
    'tech.title': 'הנדסת דיוק',
    'tech.intro': 'מערכות המשאבות שלנו מייצגות את שיא ההנדסה המודרנית. כל רכיב מתוכנן ונבדק בקפידה כדי לספק ביצועים, יעילות ואמינות ללא תחרות.',
    'tech.materials.title': 'חומרים מתקדמים',
    'tech.materials.desc': 'סגסוגות עמידות בפני קורוזיה מבטיחות עשרות שנים של פעולה ללא תחזוקה',
    'tech.controls.title': 'בקרה חכמה',
    'tech.controls.desc': 'אוטומציה אינטליגנטית מייעלת ביצועים בזמן אמת',
    'tech.tested.title': 'מצוינות נבדקת',
    'tech.tested.desc': 'בקרת איכות קפדנית בתנאי קיצון',
    
    // Sustainability
    'sustain.title': 'ירוק. בר קיימא. מוכן לעתיד.',
    'sustain.intro': 'ב-AquaPump, אנו מאמינים ביצירת פתרונות שלא רק משרתים את הצרכים של היום, אלא גם מגנים על עולם המחר. הטכנולוגיה הידידותית לסביבה שלנו מפחיתה את ההשפעה הסביבתית תוך מתן ביצועים מעולים.',
    'sustain.energy': 'הפחתת אנרגיה',
    'sustain.recyclable': 'חומרים הניתנים למיחזור',
    'sustain.lifespan': 'שנות חיים',
    'sustain.emissions': 'פליטות מזיקות',
    'sustain.emissionsValue': 'אפס פליטות',
    
    // Products
    'products.title': 'מגוון המוצרים שלנו',
    'products.subtitle': 'ממגורים לתעשייה, גלה את פתרון משאבת המים המושלם לצרכים שלך',
    'products.pro.category': 'סדרה תעשייתית',
    'products.pro.name': 'AquaPump Pro',
    'products.pro.desc': 'שאיבה בקיבולת גבוהה לפעולות בקנה מידה גדול',
    'products.eco.category': 'סדרה למגורים',
    'products.eco.name': 'AquaPump Eco',
    'products.eco.desc': 'מושלם לבתים ועסקים קטנים',
    'products.solar.category': 'סדרת אנרגיה ירוקה',
    'products.solar.name': 'AquaPump Solar',
    'products.solar.desc': 'פתרונות מים בני קיימא המופעלים באנרגיה סולארית',
    'products.smart.category': 'סדרת IoT',
    'products.smart.name': 'AquaPump Smart',
    'products.smart.desc': 'משאבות מחוברות עם אופטימיזציה מבוססת AI',
    'products.learnMore': 'למד עוד',
    
    // Contact
    'contact.title': 'בואו נתחבר',
    'contact.intro': 'מוכנים לשנות את ניהול המים שלכם? הצוות שלנו כאן כדי לעזור לכם למצוא את הפתרון המושלם לצרכים שלכם.',
    'contact.phone': 'טלפון',
    'contact.email': 'אימייל',
    'contact.location': 'מיקום',
    'contact.form.name': 'שם',
    'contact.form.namePlaceholder': 'השם שלך',
    'contact.form.email': 'אימייל',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.subject': 'נושא',
    'contact.form.subjectPlaceholder': 'איך נוכל לעזור?',
    'contact.form.message': 'הודעה',
    'contact.form.messagePlaceholder': 'ספר לנו על הפרויקט שלך...',
    'contact.form.send': 'שלח הודעה',
    
    // Footer
    'footer.tagline': 'המשאבה שלך, הפתרון שלנו. מובילים את עתיד טכנולוגיית המים הברת קיימא.',
    'footer.products': 'מוצרים',
    'footer.company': 'חברה',
    'footer.support': 'תמיכה',
    'footer.copyright': 'AquaPump. כל הזכויות שמורות.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Update document direction and lang attribute
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
