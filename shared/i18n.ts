// Internationalization configuration for Cargo Branding
// Supports: German (de), Spanish (es), English (en)

export type Language = 'de' | 'es' | 'en';

export const SUPPORTED_LANGUAGES: Language[] = ['de', 'es', 'en'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  de: 'Deutsch',
  es: 'Español',
  en: 'English',
};

export interface Translations {
  // Navigation
  nav: {
    home: string;
    services: string;
    pricing: string;
    benefits: string;
    testimonials: string;
    contact: string;
    login: string;
    dashboard: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  
  // Services
  services: {
    title: string;
    subtitle: string;
    web: {
      title: string;
      description: string;
    };
    email: {
      title: string;
      description: string;
    };
    dashboard: {
      title: string;
      description: string;
    };
    support: {
      title: string;
      description: string;
    };
  };
  
  // Pricing
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    setup: string;
    getStarted: string;
    bronze: {
      name: string;
      description: string;
      features: string[];
    };
    silver: {
      name: string;
      description: string;
      features: string[];
    };
    gold: {
      name: string;
      description: string;
      features: string[];
    };
  };
  
  // Benefits
  benefits: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  
  // Testimonials
  testimonials: {
    title: string;
    subtitle: string;
  };
  
  // Contact
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    company: string;
    message: string;
    send: string;
    success: string;
    error: string;
  };
  
  // Footer
  footer: {
    tagline: string;
    rights: string;
    privacy: string;
    terms: string;
  };
}

export const translations: Record<Language, Translations> = {
  de: {
    nav: {
      home: 'Startseite',
      services: 'Leistungen',
      pricing: 'Preise',
      benefits: 'Vorteile',
      testimonials: 'Referenzen',
      contact: 'Kontakt',
      login: 'Anmelden',
      dashboard: 'Dashboard',
    },
    hero: {
      title: 'Professionelle Digitalisierung für Transport- und Logistikunternehmen',
      subtitle: 'Ihre neue Website in 7 Tagen. Professionell, modern und bereit für Wachstum. Spezialisiert auf europäische Transport- und Logistikunternehmen.',
      cta: 'Kostenlose Demo ansehen',
      ctaSecondary: 'Preise ansehen',
    },
    services: {
      title: 'Unsere Leistungen',
      subtitle: 'Alles, was Ihr Transportunternehmen für eine starke Online-Präsenz braucht',
      web: {
        title: 'Professionelle Website',
        description: 'Moderne, responsive Websites, die auf allen Geräten perfekt aussehen und Ihre Kunden überzeugen.',
      },
      email: {
        title: 'Professionelle E-Mail',
        description: 'Schluss mit Gmail. Nutzen Sie professionelle E-Mail-Adressen mit Ihrer eigenen Domain.',
      },
      dashboard: {
        title: 'Kunden-Dashboard',
        description: 'Geben Sie Ihren Kunden Zugriff auf Sendungsverfolgung und wichtige Informationen.',
      },
      support: {
        title: 'Laufender Support',
        description: 'Wir kümmern uns um Hosting, Updates und technischen Support – Sie konzentrieren sich auf Ihr Geschäft.',
      },
    },
    pricing: {
      title: 'Transparente Preise',
      subtitle: 'Wählen Sie den Plan, der zu Ihrem Unternehmen passt',
      monthly: 'pro Monat',
      setup: 'Einrichtung',
      getStarted: 'Jetzt starten',
      bronze: {
        name: 'Bronze',
        description: 'Perfekt für kleine Unternehmen und Einzelunternehmer',
        features: [
          'Professionelle Website (5 Seiten)',
          'Responsive Design',
          'Professionelle E-Mail-Adresse',
          'Hosting & SSL-Zertifikat',
          'Monatliche Updates',
          'E-Mail-Support',
        ],
      },
      silver: {
        name: 'Silber',
        description: 'Ideal für wachsende Unternehmen',
        features: [
          'Alles aus Bronze',
          'Erweiterte Website (10 Seiten)',
          'Blog-Funktion',
          'Analytics-Dashboard',
          'SEO-Optimierung',
          'Social Media Integration',
          'Prioritäts-Support',
        ],
      },
      gold: {
        name: 'Gold',
        description: 'Für etablierte Unternehmen mit hohen Ansprüchen',
        features: [
          'Alles aus Silber',
          'Sendungsverfolgung-System',
          'Kunden-Portal',
          'API-Integrationen (TimoCom, etc.)',
          'Mehrsprachige Website',
          'Premium-Support (24/7)',
          'Monatliche Strategie-Calls',
        ],
      },
    },
    benefits: {
      title: 'Warum Cargo Branding?',
      subtitle: 'Wir verstehen die Transport- und Logistikbranche',
      items: [
        {
          title: 'Branchenexpertise',
          description: 'Wir kennen die Herausforderungen der Transport- und Logistikbranche und entwickeln Lösungen, die wirklich funktionieren.',
        },
        {
          title: 'Schnelle Umsetzung',
          description: 'Ihre neue Website ist in nur 7 Tagen online. Keine langen Wartezeiten, keine komplizierten Prozesse.',
        },
        {
          title: 'Faire Preise',
          description: 'Transparente Preisgestaltung ohne versteckte Kosten. Professionelle Qualität zu einem Preis, den sich jedes Unternehmen leisten kann.',
        },
        {
          title: 'Rundum-Service',
          description: 'Von der Entwicklung über Hosting bis zum Support – wir kümmern uns um alles, damit Sie sich auf Ihr Kerngeschäft konzentrieren können.',
        },
      ],
    },
    testimonials: {
      title: 'Was unsere Kunden sagen',
      subtitle: 'Erfolgsgeschichten von Transport- und Logistikunternehmen',
    },
    contact: {
      title: 'Bereit für Ihre neue Website?',
      subtitle: 'Kontaktieren Sie uns für eine kostenlose Demo',
      name: 'Name',
      email: 'E-Mail',
      company: 'Unternehmen',
      message: 'Nachricht',
      send: 'Nachricht senden',
      success: 'Vielen Dank! Wir melden uns in Kürze bei Ihnen.',
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    },
    footer: {
      tagline: 'Professionelle Digitalisierung für Transport- und Logistikunternehmen in Europa',
      rights: 'Alle Rechte vorbehalten',
      privacy: 'Datenschutz',
      terms: 'AGB',
    },
  },
  
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      pricing: 'Precios',
      benefits: 'Beneficios',
      testimonials: 'Testimonios',
      contact: 'Contacto',
      login: 'Iniciar sesión',
      dashboard: 'Panel',
    },
    hero: {
      title: 'Digitalización Profesional para Empresas de Transporte y Logística',
      subtitle: 'Tu nueva web en 7 días. Profesional, moderna y lista para crecer. Especializados en empresas europeas de transporte y logística.',
      cta: 'Ver demo gratuita',
      ctaSecondary: 'Ver precios',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Todo lo que tu empresa de transporte necesita para una presencia online sólida',
      web: {
        title: 'Sitio Web Profesional',
        description: 'Sitios web modernos y responsive que se ven perfectos en todos los dispositivos y convencen a tus clientes.',
      },
      email: {
        title: 'Email Profesional',
        description: 'Adiós a Gmail. Utiliza direcciones de email profesionales con tu propio dominio.',
      },
      dashboard: {
        title: 'Panel de Cliente',
        description: 'Da a tus clientes acceso a seguimiento de envíos e información importante.',
      },
      support: {
        title: 'Soporte Continuo',
        description: 'Nos encargamos del hosting, actualizaciones y soporte técnico – tú concéntrate en tu negocio.',
      },
    },
    pricing: {
      title: 'Precios Transparentes',
      subtitle: 'Elige el plan que se adapte a tu empresa',
      monthly: 'por mes',
      setup: 'Configuración',
      getStarted: 'Empezar ahora',
      bronze: {
        name: 'Bronce',
        description: 'Perfecto para pequeñas empresas y autónomos',
        features: [
          'Sitio web profesional (5 páginas)',
          'Diseño responsive',
          'Email profesional',
          'Hosting y certificado SSL',
          'Actualizaciones mensuales',
          'Soporte por email',
        ],
      },
      silver: {
        name: 'Plata',
        description: 'Ideal para empresas en crecimiento',
        features: [
          'Todo lo de Bronce',
          'Sitio web avanzado (10 páginas)',
          'Función de blog',
          'Dashboard de analíticas',
          'Optimización SEO',
          'Integración redes sociales',
          'Soporte prioritario',
        ],
      },
      gold: {
        name: 'Oro',
        description: 'Para empresas establecidas con altas exigencias',
        features: [
          'Todo lo de Plata',
          'Sistema de seguimiento de cargas',
          'Portal de clientes',
          'Integraciones API (TimoCom, etc.)',
          'Sitio web multiidioma',
          'Soporte premium (24/7)',
          'Llamadas estratégicas mensuales',
        ],
      },
    },
    benefits: {
      title: '¿Por qué Cargo Branding?',
      subtitle: 'Entendemos la industria del transporte y la logística',
      items: [
        {
          title: 'Experiencia en el Sector',
          description: 'Conocemos los desafíos de la industria del transporte y la logística y desarrollamos soluciones que realmente funcionan.',
        },
        {
          title: 'Implementación Rápida',
          description: 'Tu nueva web estará online en solo 7 días. Sin largas esperas, sin procesos complicados.',
        },
        {
          title: 'Precios Justos',
          description: 'Precios transparentes sin costos ocultos. Calidad profesional a un precio que cualquier empresa puede permitirse.',
        },
        {
          title: 'Servicio Integral',
          description: 'Desde el desarrollo hasta el hosting y el soporte – nos encargamos de todo para que te concentres en tu negocio principal.',
        },
      ],
    },
    testimonials: {
      title: 'Lo que dicen nuestros clientes',
      subtitle: 'Historias de éxito de empresas de transporte y logística',
    },
    contact: {
      title: '¿Listo para tu nueva web?',
      subtitle: 'Contáctanos para una demo gratuita',
      name: 'Nombre',
      email: 'Email',
      company: 'Empresa',
      message: 'Mensaje',
      send: 'Enviar mensaje',
      success: '¡Gracias! Nos pondremos en contacto contigo pronto.',
      error: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
    },
    footer: {
      tagline: 'Digitalización profesional para empresas de transporte y logística en Europa',
      rights: 'Todos los derechos reservados',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
  },
  
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      pricing: 'Pricing',
      benefits: 'Benefits',
      testimonials: 'Testimonials',
      contact: 'Contact',
      login: 'Login',
      dashboard: 'Dashboard',
    },
    hero: {
      title: 'Professional Digitalization for Transport & Logistics Companies',
      subtitle: 'Your new website in 7 days. Professional, modern, and ready to grow. Specialized in European transport and logistics companies.',
      cta: 'See free demo',
      ctaSecondary: 'View pricing',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Everything your transport company needs for a strong online presence',
      web: {
        title: 'Professional Website',
        description: 'Modern, responsive websites that look perfect on all devices and convince your customers.',
      },
      email: {
        title: 'Professional Email',
        description: 'Say goodbye to Gmail. Use professional email addresses with your own domain.',
      },
      dashboard: {
        title: 'Client Dashboard',
        description: 'Give your clients access to shipment tracking and important information.',
      },
      support: {
        title: 'Ongoing Support',
        description: 'We handle hosting, updates, and technical support – you focus on your business.',
      },
    },
    pricing: {
      title: 'Transparent Pricing',
      subtitle: 'Choose the plan that fits your company',
      monthly: 'per month',
      setup: 'Setup',
      getStarted: 'Get started',
      bronze: {
        name: 'Bronze',
        description: 'Perfect for small businesses and sole proprietors',
        features: [
          'Professional website (5 pages)',
          'Responsive design',
          'Professional email address',
          'Hosting & SSL certificate',
          'Monthly updates',
          'Email support',
        ],
      },
      silver: {
        name: 'Silver',
        description: 'Ideal for growing companies',
        features: [
          'Everything in Bronze',
          'Advanced website (10 pages)',
          'Blog functionality',
          'Analytics dashboard',
          'SEO optimization',
          'Social media integration',
          'Priority support',
        ],
      },
      gold: {
        name: 'Gold',
        description: 'For established companies with high demands',
        features: [
          'Everything in Silver',
          'Shipment tracking system',
          'Client portal',
          'API integrations (TimoCom, etc.)',
          'Multilingual website',
          'Premium support (24/7)',
          'Monthly strategy calls',
        ],
      },
    },
    benefits: {
      title: 'Why Cargo Branding?',
      subtitle: 'We understand the transport and logistics industry',
      items: [
        {
          title: 'Industry Expertise',
          description: 'We know the challenges of the transport and logistics industry and develop solutions that really work.',
        },
        {
          title: 'Fast Implementation',
          description: 'Your new website will be online in just 7 days. No long waits, no complicated processes.',
        },
        {
          title: 'Fair Pricing',
          description: 'Transparent pricing with no hidden costs. Professional quality at a price every company can afford.',
        },
        {
          title: 'Full Service',
          description: 'From development to hosting and support – we take care of everything so you can focus on your core business.',
        },
      ],
    },
    testimonials: {
      title: 'What our clients say',
      subtitle: 'Success stories from transport and logistics companies',
    },
    contact: {
      title: 'Ready for your new website?',
      subtitle: 'Contact us for a free demo',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      message: 'Message',
      send: 'Send message',
      success: 'Thank you! We will get back to you soon.',
      error: 'An error occurred. Please try again.',
    },
    footer: {
      tagline: 'Professional digitalization for transport and logistics companies in Europe',
      rights: 'All rights reserved',
      privacy: 'Privacy',
      terms: 'Terms',
    },
  },
};

