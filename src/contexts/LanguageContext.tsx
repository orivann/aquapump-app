import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Language = "en" | "he";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "workwave.language";

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.features": "Platform",
    "nav.technology": "How it works",
    "nav.sustainability": "Impact",
    "nav.products": "Hiring plans",
    "nav.contact": "Contact",
    "nav.getStarted": "Post a job",

    // Hero
    "hero.badge": "WorkWave Careers",
    "hero.title": "Build high-performing teams with confidence",
    "hero.subtitle": "WorkWave unifies sourcing, screening, and candidate care so you can launch roles and hire faster.",
    "hero.explore": "Explore plans",
    "hero.learn": "View open roles",
    "hero.scrollLabel": "Scroll",

    // Features
    "features.title": "Everything you need to hire faster",
    "features.subtitle": "Modern recruiting workflows for lean teams and global enterprises alike.",
    "features.flow.title": "Intelligent role matching",
    "features.flow.desc": "AI-powered recommendations surface the right candidates for every job posting.",
    "features.energy.title": "Automated outreach",
    "features.energy.desc": "Sequenced messaging keeps prospects engaged without manual follow-up.",
    "features.eco.title": "Inclusive by design",
    "features.eco.desc": "Bias-aware tooling and structured interview kits create equitable hiring journeys.",
    "features.durable.title": "Compliance ready",
    "features.durable.desc": "Global privacy controls and audit logs keep every search compliant.",
    "features.smart.title": "Real-time analytics",
    "features.smart.desc": "Dashboards highlight funnel health, conversion rates, and hiring velocity.",
    "features.install.title": "Launch in days",
    "features.install.desc": "Guided onboarding and integrations connect WorkWave to your ATS instantly.",

    // Technology
    "tech.title": "A platform recruiters love, and candidates trust",
    "tech.intro": "WorkWave orchestrates sourcing, nurturing, and scheduling in a unified workspace so hiring teams can collaborate effortlessly.",
    "tech.materials.title": "Unified candidate graph",
    "tech.materials.desc": "Aggregate applications, referrals, and talent network data into one living profile.",
    "tech.controls.title": "Workflow automation",
    "tech.controls.desc": "Trigger assessments, background checks, and updates with reusable playbooks.",
    "tech.tested.title": "Enterprise-grade security",
    "tech.tested.desc": "SOC 2 compliant infrastructure, SSO, and granular permissions from day one.",

    // Impact
    "sustain.title": "Hiring outcomes you can measure",
    "sustain.intro": "From sourcing to signed offer, WorkWave gives your team the data and guardrails to hire confidently at scale.",
    "sustain.energy": "Average time to shortlist",
    "sustain.recyclable": "Offer acceptance rate",
    "sustain.lifespan": "Candidate NPS",
    "sustain.emissions": "Manual busywork reduced",
    "sustain.emissionsValue": "70%",

    // Plans
    "products.title": "Flexible hiring plans",
    "products.subtitle": "Choose the package that matches your growth stage and hiring goals.",
    "products.pro.category": "Scale plan",
    "products.pro.name": "Growth hiring suite",
    "products.pro.desc": "Unlimited roles, talent network automation, and advanced analytics.",
    "products.eco.category": "Starter plan",
    "products.eco.name": "Launch essentials",
    "products.eco.desc": "Up to 10 active roles with branded job pages and quick offers.",
    "products.solar.category": "Global plan",
    "products.solar.name": "Worldwide recruiting",
    "products.solar.desc": "Localized compliance, multi-currency offers, and visa workflows.",
    "products.smart.category": "Talent network",
    "products.smart.name": "Community nurture",
    "products.smart.desc": "Always-on talent CRM with events, referrals, and alumni campaigns.",
    "products.learnMore": "See plan details",

    // Chatbot
    "chatbot.badge": "AI talent concierge",
    "chatbot.title": "Meet Wave, your always-on recruiting copilot",
    "chatbot.description": "Wave answers candidate questions, screens applicants, and syncs notes to your ATS so recruiters stay focused on the conversations that matter.",
    "chatbot.cta": "Chat with Wave",
    "chatbot.secondaryCta": "Book a walkthrough",
    "chatbot.highlight.instant.title": "Instant expertise",
    "chatbot.highlight.instant.desc": "Give candidates fast, accurate answers about roles, culture, and next steps.",
    "chatbot.highlight.reliable.title": "Reliable screening",
    "chatbot.highlight.reliable.desc": "AI summaries capture intent and qualification data for every conversation.",
    "chatbot.highlight.available.title": "Always available",
    "chatbot.highlight.available.desc": "Engage talent 24/7 while keeping humans in the loop when you need them.",

    // Contact
    "contact.title": "Let’s talk hiring",
    "contact.intro": "Share your hiring goals and we’ll tailor a WorkWave plan for your team.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.location": "HQ",
    "contact.form.name": "Name",
    "contact.form.namePlaceholder": "Your name",
    "contact.form.email": "Email",
    "contact.form.emailPlaceholder": "you@company.com",
    "contact.form.subject": "Subject",
    "contact.form.subjectPlaceholder": "What roles are you hiring for?",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "Tell us about your talent goals...",
    "contact.form.send": "Request demo",

    // Footer
    "footer.tagline": "Powering confident hiring for modern teams.",
    "footer.products": "Hiring plans",
    "footer.company": "Company",
    "footer.support": "Resources",
    "footer.copyright": "WorkWave Careers. All rights reserved.",
  },
  he: {
    // Navbar
    "nav.features": "הפלטפורמה",
    "nav.technology": "איך זה עובד",
    "nav.sustainability": "השפעה",
    "nav.products": "תוכניות גיוס",
    "nav.contact": "צור קשר",
    "nav.getStarted": "פרסם משרה",

    // Hero
    "hero.badge": "WorkWave Careers",
    "hero.title": "בנו צוותים מצטיינים בביטחון",
    "hero.subtitle": "WorkWave מאחדת סורסינג, סינון ודאגה למועמדים כך שתוכלו להשיק משרות ולגייס מהר יותר.",
    "hero.explore": "גלו תוכניות",
    "hero.learn": "צפו במשרות פתוחות",
    "hero.scrollLabel": "גללו",

    // Features
    "features.title": "כל מה שצריך כדי לגייס מהר",
    "features.subtitle": "זרימות גיוס מודרניות לצוותים רזים ולארגונים גלובליים כאחד.",
    "features.flow.title": "התאמת תפקידים חכמה",
    "features.flow.desc": "המלצות מבוססות בינה מלאכותית מציעות את המועמדים הנכונים לכל משרה.",
    "features.energy.title": "אוטומציה של פנייה",
    "features.energy.desc": "רצפי מסרים שומרים על עניין המועמדים בלי מעקב ידני.",
    "features.eco.title": "עיצוב כוללני",
    "features.eco.desc": "כלים מודעים להטיה ומדריכי ריאיון מובנים מייצרים מסע גיוס הוגן.",
    "features.durable.title": "תואם רגולציה",
    "features.durable.desc": "בקרות פרטיות גלובליות ולוגי ביקורת שומרים על תאימות בכל חיפוש.",
    "features.smart.title": "ניתוח בזמן אמת",
    "features.smart.desc": "לוחות מחוונים מציגים את בריאות המשפך, שיעורי ההמרה ומהירות הגיוס.",
    "features.install.title": "השקה תוך ימים",
    "features.install.desc": "הטמעה מודרכת ואינטגרציות מחברות את WorkWave ל-ATS שלכם מיד.",

    // Technology
    "tech.title": "פלטפורמה שמגייסים אוהבים ומועמדים סומכים עליה",
    "tech.intro": "WorkWave מתזמרת סורסינג, טיפוח ותזמון בחלל עבודה אחד כך שצוותי הגיוס ישתפו פעולה ללא מאמץ.",
    "tech.materials.title": "גרף מועמדים מאוחד",
    "tech.materials.desc": "אוספים קורות חיים, הפניות ומידע מרשת הכישרונות לפרופיל חי אחד.",
    "tech.controls.title": "אוטומציית תהליכים",
    "tech.controls.desc": "מפעילים בדיקות רקע, הערכות ועדכונים עם פלייבוקים חוזרים.",
    "tech.tested.title": "אבטחה ברמת אנטרפרייז",
    "tech.tested.desc": "תשתית תואמת SOC 2, התחברות אחודה והרשאות מפורטות מהיום הראשון.",

    // Impact
    "sustain.title": "תוצאות גיוס שאפשר למדוד",
    "sustain.intro": "מהסורסינג ועד החתימה, WorkWave מספקת נתונים וכללי עבודה כדי לגייס בביטחון ובקנה מידה.",
    "sustain.energy": "זמן ממוצע לרשימת מועמדים",
    "sustain.recyclable": "שיעור קבלת הצעה",
    "sustain.lifespan": "ציון NPS של מועמדים",
    "sustain.emissions": "הפחתת עבודה ידנית",
    "sustain.emissionsValue": "70%",

    // Plans
    "products.title": "תוכניות גיוס גמישות",
    "products.subtitle": "בחרו את החבילה שמתאימה לשלב הצמיחה ויעדי הגיוס שלכם.",
    "products.pro.category": "תוכנית צמיחה",
    "products.pro.name": "חבילת גיוס לצמיחה",
    "products.pro.desc": "תפקידים ללא הגבלה, אוטומציה של רשת טאלנט וניתוחים מתקדמים.",
    "products.eco.category": "תוכנית סטארט-אפ",
    "products.eco.name": "כלי השקה חיוניים",
    "products.eco.desc": "עד 10 משרות פעילות עם דפי קריירה ממותגים והצעות מהירות.",
    "products.solar.category": "תוכנית גלובלית",
    "products.solar.name": "גיוס עולמי",
    "products.solar.desc": "תאימות מקומית, הצעות במטבעות שונים ותהליכי ויזה.",
    "products.smart.category": "קהילת טאלנט",
    "products.smart.name": "טיפוח קהילה",
    "products.smart.desc": "CRM טאלנט פעיל תמיד עם אירועים, הפניות וקמפיינים לבוגרים.",
    "products.learnMore": "ראו פרטי תוכנית",

    // Chatbot
    "chatbot.badge": "קונסיירז׳ טאלנט מבוסס בינה מלאכותית",
    "chatbot.title": "הכירו את Wave, הקופיילוט הקבוע שלכם בגיוס",
    "chatbot.description": "Wave עונה לשאלות מועמדים, מסננת פניות ומסנכרנת הערות עם ה-ATS כדי שהמגייסים יתמקדו בשיחות החשובות.",
    "chatbot.cta": "שוחחו עם Wave",
    "chatbot.secondaryCta": "קבעו סיור",
    "chatbot.highlight.instant.title": "מומחיות מיידית",
    "chatbot.highlight.instant.desc": "מספק תשובות מהירות ומדויקות על תפקידים, תרבות ושלבים הבאים.",
    "chatbot.highlight.reliable.title": "סינון אמין",
    "chatbot.highlight.reliable.desc": "תקצירים מבוססי AI מתעדים כוונה ונתוני התאמה לכל שיחה.",
    "chatbot.highlight.available.title": "זמין תמיד",
    "chatbot.highlight.available.desc": "מפעילים את המועמדים 24/7 תוך שמירת צוות הגיוס בלופ כשצריך.",

    // Contact
    "contact.title": "בואו נדבר על גיוס",
    "contact.intro": "שתפו את יעדי הגיוס שלכם ונבנה עבורכם תוכנית WorkWave מותאמת.",
    "contact.phone": "טלפון",
    "contact.email": "אימייל",
    "contact.location": "מטה",
    "contact.form.name": "שם",
    "contact.form.namePlaceholder": "השם שלך",
    "contact.form.email": "אימייל",
    "contact.form.emailPlaceholder": "you@company.com",
    "contact.form.subject": "נושא",
    "contact.form.subjectPlaceholder": "אילו תפקידים אתם מחפשים?",
    "contact.form.message": "הודעה",
    "contact.form.messagePlaceholder": "ספרו לנו על יעדי הטאלנט שלכם...",
    "contact.form.send": "בקשת הדגמה",

    // Footer
    "footer.tagline": "מניעים גיוס בטוח לצוותים מודרניים.",
    "footer.products": "תוכניות גיוס",
    "footer.company": "חברה",
    "footer.support": "משאבים",
    "footer.copyright": "WorkWave Careers. כל הזכויות שמורות.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "he" ? "he" : "en";
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    // Update document direction and lang attribute for accessibility and RTL support.
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  const t = useCallback(
    (key: string): string => translations[language][key] ?? key,
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
