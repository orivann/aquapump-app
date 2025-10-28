import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'aquapump.language';

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
    'hero.metrics.energy.label': 'kWh saved',
    'hero.metrics.energy.value': '60%',
    'hero.metrics.energy.description': 'Average reduction in energy consumption',
    'hero.metrics.roi.label': 'ROI horizon',
    'hero.metrics.roi.value': '18 mo',
    'hero.metrics.roi.description': 'Typical deployment payback',
    'hero.metrics.support.label': 'Support',
    'hero.metrics.support.value': '24/7',
    'hero.metrics.support.description': 'Human experts backed by AI',
    'hero.metrics.ariaLabel': 'Performance highlights',

    // Features
    'features.badge': 'Design DNA',
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
    'tech.badge': 'Engineering Core',
    'tech.title': 'Precision Engineering',
    'tech.intro': 'Our water pump systems represent the pinnacle of modern engineering. Every component is meticulously designed and tested to deliver unparalleled performance, efficiency, and reliability.',
    'tech.materials.title': 'Advanced Materials',
    'tech.materials.desc': 'Corrosion-resistant alloys ensure decades of maintenance-free operation',
    'tech.controls.title': 'Smart Controls',
    'tech.controls.desc': 'Intelligent automation optimizes performance in real-time',
    'tech.tested.title': 'Tested Excellence',
    'tech.tested.desc': 'Rigorous quality control in extreme conditions',
    
    // Sustainability
    'sustain.badge': 'Sustainability at scale',
    'sustain.title': 'Green. Sustainable. Future-Ready.',
    'sustain.intro': 'At AquaPump, we believe in creating solutions that don\'t just serve today\'s needs, but protect tomorrow\'s world. Our eco-friendly technology reduces environmental impact while delivering superior performance.',
    'sustain.energy': 'Energy Reduction',
    'sustain.recyclable': 'Recyclable Materials',
    'sustain.lifespan': 'Years Lifespan',
    'sustain.emissions': 'Harmful Emissions',
    'sustain.emissionsValue': 'Net Zero',
    'sustain.metrics.ariaLabel': 'Sustainability highlights',
    
    // Products
    'products.badge': 'Product lineup',
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
    'products.listAriaLabel': 'Product cards',

    // Chatbot
    'chatbot.badge': 'Conversational AI',
    'chatbot.title': 'Meet Aqua AI, your on-demand pump specialist',
    'chatbot.description': 'Aqua AI handles inbound questions, technical clarifications, and project discovery so your team can focus on closing deals. Conversations persist automatically and can hand off to humans at any time.',
    'chatbot.cta': 'Chat with Aqua AI',
    'chatbot.secondaryCta': 'Talk to sales',
    'chatbot.highlight.instant.title': 'Instant expertise',
    'chatbot.highlight.instant.desc': 'Get immediate answers about product specs, configurations, and ROI calculations.',
    'chatbot.highlight.reliable.title': 'Reliable guidance',
    'chatbot.highlight.reliable.desc': 'Responses are grounded in curated AquaPump knowledge and best practices.',
    'chatbot.highlight.available.title': 'Always available',
    'chatbot.highlight.available.desc': 'Engage prospects 24/7 and capture context for seamless human follow-up.',
    'chatbot.highlights.ariaLabel': 'Aqua AI advantages',

    // Chat widget
    'chatwidget.launcher.tooltip': 'Chat with Aqua AI',
    'chatwidget.launcher.srLabel': 'Open Aqua AI assistant',
    'chatwidget.title': 'Aqua AI Assistant',
    'chatwidget.subtitle': 'Ask anything about AquaPump products and sustainability practices.',
    'chatwidget.persist': 'Conversations persist automatically',
    'chatwidget.reset': 'Reset',
    'chatwidget.loading': 'Loading previous messages…',
    'chatwidget.empty': 'Welcome! Ask about pump specifications, energy efficiency, or installation guidance.',
    'chatwidget.role.assistant': 'Aqua AI',
    'chatwidget.role.user': 'You',
    'chatwidget.role.system': 'System',
    'chatwidget.placeholder': 'Ask Aqua AI anything about our pumps…',
    'chatwidget.helper': 'Press Enter to send, Shift + Enter for a new line',
    'chatwidget.sending': 'Sending',
    'chatwidget.send': 'Send',
    'chatwidget.error.loadHistory': 'Unable to load chat history',
    'chatwidget.error.send': 'Unable to send message',
    
    // Contact
    'contact.badge': 'Let’s talk',
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
    'hero.metrics.energy.label': 'קוט"ש שנחסכו',
    'hero.metrics.energy.value': '60%',
    'hero.metrics.energy.description': 'חיסכון ממוצע בצריכת אנרגיה',
    'hero.metrics.roi.label': 'החזר השקעה',
    'hero.metrics.roi.value': '18 ח׳',
    'hero.metrics.roi.description': 'תקופת החזר טיפוסית לאחר ההטמעה',
    'hero.metrics.support.label': 'תמיכה',
    'hero.metrics.support.value': '24/7',
    'hero.metrics.support.description': 'מומחים אנושיים עם גב AI',
    'hero.metrics.ariaLabel': 'מדדי ביצועים מובילים',

    // Features
    'features.badge': 'DNA הנדסי',
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
    'tech.badge': 'ליבת ההנדסה',
    'tech.title': 'הנדסת דיוק',
    'tech.intro': 'מערכות המשאבות שלנו מייצגות את שיא ההנדסה המודרנית. כל רכיב מתוכנן ונבדק בקפידה כדי לספק ביצועים, יעילות ואמינות ללא תחרות.',
    'tech.materials.title': 'חומרים מתקדמים',
    'tech.materials.desc': 'סגסוגות עמידות בפני קורוזיה מבטיחות עשרות שנים של פעולה ללא תחזוקה',
    'tech.controls.title': 'בקרה חכמה',
    'tech.controls.desc': 'אוטומציה אינטליגנטית מייעלת ביצועים בזמן אמת',
    'tech.tested.title': 'מצוינות נבדקת',
    'tech.tested.desc': 'בקרת איכות קפדנית בתנאי קיצון',
    
    // Sustainability
    'sustain.badge': 'קיימות בהיקף',
    'sustain.title': 'ירוק. בר קיימא. מוכן לעתיד.',
    'sustain.intro': 'ב-AquaPump, אנו מאמינים ביצירת פתרונות שלא רק משרתים את הצרכים של היום, אלא גם מגנים על עולם המחר. הטכנולוגיה הידידותית לסביבה שלנו מפחיתה את ההשפעה הסביבתית תוך מתן ביצועים מעולים.',
    'sustain.energy': 'הפחתת אנרגיה',
    'sustain.recyclable': 'חומרים הניתנים למיחזור',
    'sustain.lifespan': 'שנות חיים',
    'sustain.emissions': 'פליטות מזיקות',
    'sustain.emissionsValue': 'אפס פליטות',
    'sustain.metrics.ariaLabel': 'עיקרי הקיימות',
    
    // Products
    'products.badge': 'סדרת המוצרים',
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
    'products.listAriaLabel': 'כרטיסי מוצרים',

    // Chatbot
    'chatbot.badge': 'בינה מלאכותית שיחתית',
    'chatbot.title': 'הכירו את Aqua AI, המומחה למשאבות הזמין תמיד',
    'chatbot.description': 'Aqua AI מטפל בשאלות נכנסות, בהבהרות טכניות ובאיסוף צרכים כך שהצוות שלכם יכול להתמקד בסגירת עסקאות. השיחות נשמרות אוטומטית וניתנות להעברה חלקה לנציג אנושי בכל שלב.',
    'chatbot.cta': 'דברו עם Aqua AI',
    'chatbot.secondaryCta': 'דברו עם המכירות',
    'chatbot.highlight.instant.title': 'מומחיות מיידית',
    'chatbot.highlight.instant.desc': 'קבלו תשובות מידיות על מפרטי מוצר, תצורות וחישובי ROI.',
    'chatbot.highlight.reliable.title': 'הכוונה אמינה',
    'chatbot.highlight.reliable.desc': 'התשובות מבוססות על הידע המסונן של AquaPump ועל שיטות עבודה מומלצות.',
    'chatbot.highlight.available.title': 'זמין תמיד',
    'chatbot.highlight.available.desc': 'העוזר זמין 24/7 ושומר הקשר להמשך טיפול אנושי חסר מאמץ.',
    'chatbot.highlights.ariaLabel': 'היתרונות של Aqua AI',

    // Chat widget
    'chatwidget.launcher.tooltip': 'דברו עם Aqua AI',
    'chatwidget.launcher.srLabel': 'פתחו את עוזר Aqua AI',
    'chatwidget.title': 'עוזר Aqua AI',
    'chatwidget.subtitle': 'שאלו כל דבר על מוצרי AquaPump ועל יוזמות הקיימות שלנו.',
    'chatwidget.persist': 'השיחות נשמרות אוטומטית',
    'chatwidget.reset': 'איפוס',
    'chatwidget.loading': 'טוען שיחות קודמות…',
    'chatwidget.empty': 'ברוכים הבאים! שאלו על מפרטי משאבות, יעילות אנרגטית או הנחיות התקנה.',
    'chatwidget.role.assistant': 'Aqua AI',
    'chatwidget.role.user': 'אתם',
    'chatwidget.role.system': 'מערכת',
    'chatwidget.placeholder': 'שאלו את Aqua AI כל דבר על המשאבות שלנו…',
    'chatwidget.helper': 'לחצו Enter לשליחה, Shift + Enter לשורה חדשה',
    'chatwidget.sending': 'שולח',
    'chatwidget.send': 'שלח',
    'chatwidget.error.loadHistory': 'לא ניתן לטעון את היסטוריית השיחות',
    'chatwidget.error.send': 'לא ניתן לשלוח את ההודעה',
    
    // Contact
    'contact.badge': 'נדבר?',
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

const resolveInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'he') {
      return stored;
    }
  } catch (error) {
    // Access to storage can fail in private browsing modes; ignore and fall back.
  }

  const navigatorLanguage = window.navigator.language?.toLowerCase() ?? '';
  if (navigatorLanguage.startsWith('he')) {
    return 'he';
  }

  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => resolveInitialLanguage());

  useEffect(() => {
    const direction = language === 'he' ? 'rtl' : 'ltr';

    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      if (document.body) {
        document.body.dir = direction;
      }
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, language);
      } catch (error) {
        // Ignore storage write errors (e.g. private browsing).
      }
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  }, [language]);

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
