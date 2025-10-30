import { getDb } from './db';
import { leads, activities } from '../drizzle/schema';

// Chatbot AI configuration and logic
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  language: 'de' | 'es' | 'en';
  leadData: Partial<{
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    website: string;
    country: string;
    plan: 'bronze' | 'silver' | 'gold';
    source: string;
    notes: string;
  }>;
  stage: 'greeting' | 'qualifying' | 'capturing' | 'closing' | 'completed';
}

// Translations for chatbot responses
const translations = {
  de: {
    greeting: "Hallo! 👋 Ich bin der Cargo Branding Assistent. Ich helfe Ihnen, die perfekte digitale Lösung für Ihr Transportunternehmen zu finden. Wie kann ich Ihnen heute helfen?",
    askCompany: "Großartig! Wie heißt Ihr Unternehmen?",
    askSize: "Danke! Wie viele Fahrzeuge hat {company}?",
    askNeeds: "Verstanden. Was ist Ihr Hauptziel? (z.B. Mehr Kunden gewinnen, professioneller wirken, Online-Präsenz aufbauen)",
    askContact: "Perfekt! Damit ich Ihnen ein personalisiertes Angebot erstellen kann, benötige ich noch Ihre Kontaktdaten. Wie ist Ihr Name?",
    askEmail: "Danke, {name}! Und Ihre E-Mail-Adresse?",
    askPhone: "Großartig! Möchten Sie auch Ihre Telefonnummer hinterlassen? (Optional)",
    recommendPlan: "Basierend auf Ihren Anforderungen empfehle ich den {plan} Plan. Dieser beinhaltet: {features}",
    closing: "Vielen Dank, {name}! Ich habe Ihre Informationen an unser Team weitergeleitet. Sie werden innerhalb von 24 Stunden kontaktiert. Möchten Sie noch etwas wissen?",
    goodbye: "Vielen Dank für Ihr Interesse! Bis bald! 🚛"
  },
  es: {
    greeting: "¡Hola! 👋 Soy el asistente de Cargo Branding. Te ayudo a encontrar la solución digital perfecta para tu empresa de transporte. ¿En qué puedo ayudarte hoy?",
    askCompany: "¡Genial! ¿Cómo se llama tu empresa?",
    askSize: "¡Gracias! ¿Cuántos vehículos tiene {company}?",
    askNeeds: "Entendido. ¿Cuál es tu objetivo principal? (ej. Conseguir más clientes, verse más profesional, tener presencia online)",
    askContact: "¡Perfecto! Para crear una propuesta personalizada, necesito tus datos de contacto. ¿Cuál es tu nombre?",
    askEmail: "¡Gracias, {name}! ¿Y tu email?",
    askPhone: "¡Excelente! ¿Quieres dejar también tu teléfono? (Opcional)",
    recommendPlan: "Basándome en tus necesidades, recomiendo el plan {plan}. Incluye: {features}",
    closing: "¡Muchas gracias, {name}! He enviado tu información a nuestro equipo. Te contactaremos en las próximas 24 horas. ¿Quieres saber algo más?",
    goodbye: "¡Gracias por tu interés! ¡Hasta pronto! 🚛"
  },
  en: {
    greeting: "Hello! 👋 I'm the Cargo Branding assistant. I help you find the perfect digital solution for your transport company. How can I help you today?",
    askCompany: "Great! What's your company name?",
    askSize: "Thanks! How many vehicles does {company} have?",
    askNeeds: "Got it. What's your main goal? (e.g. Get more clients, look more professional, build online presence)",
    askContact: "Perfect! To create a personalized proposal, I need your contact details. What's your name?",
    askEmail: "Thanks, {name}! And your email?",
    askPhone: "Excellent! Would you like to leave your phone number too? (Optional)",
    recommendPlan: "Based on your needs, I recommend the {plan} plan. It includes: {features}",
    closing: "Thank you, {name}! I've sent your information to our team. We'll contact you within 24 hours. Want to know anything else?",
    goodbye: "Thanks for your interest! See you soon! 🚛"
  }
};

// Plan features
const planFeatures = {
  bronze: {
    de: "Professionelle Website (5 Seiten), E-Mail, Mobile responsive, SEO",
    es: "Sitio web profesional (5 páginas), Email, Responsive, SEO",
    en: "Professional website (5 pages), Email, Mobile responsive, SEO"
  },
  silver: {
    de: "Erweiterte Website (10 Seiten), E-Mail, Analytics, SEO, Social Media",
    es: "Sitio web avanzado (10 páginas), Email, Analytics, SEO, Redes sociales",
    en: "Advanced website (10 pages), Email, Analytics, SEO, Social media"
  },
  gold: {
    de: "Premium Website (unbegrenzt), E-Mail, Analytics, Tracking-System, Kundenportal, API",
    es: "Sitio web premium (ilimitado), Email, Analytics, Sistema de tracking, Portal de clientes, API",
    en: "Premium website (unlimited), Email, Analytics, Tracking system, Client portal, API"
  }
};

// Detect language from user message
export function detectLanguage(message: string): 'de' | 'es' | 'en' {
  const lowerMessage = message.toLowerCase();
  
  // German keywords
  if (lowerMessage.match(/\b(hallo|guten|danke|ja|nein|ich|mein|website|unternehmen|transport|lkw)\b/)) {
    return 'de';
  }
  
  // Spanish keywords
  if (lowerMessage.match(/\b(hola|gracias|si|no|mi|empresa|transporte|camion|pagina)\b/)) {
    return 'es';
  }
  
  // Default to English
  return 'en';
}

// Recommend plan based on company size and needs
export function recommendPlan(fleetSize: number, needs: string): 'bronze' | 'silver' | 'gold' {
  const needsLower = needs.toLowerCase();
  
  // Gold plan for large fleets or advanced needs
  if (fleetSize > 20 || needsLower.includes('tracking') || needsLower.includes('portal') || needsLower.includes('api')) {
    return 'gold';
  }
  
  // Silver plan for medium fleets or growth focus
  if (fleetSize > 5 || needsLower.includes('analytics') || needsLower.includes('seo') || needsLower.includes('social')) {
    return 'silver';
  }
  
  // Bronze for small fleets or basic needs
  return 'bronze';
}

// Process user message and generate response
export async function processChatMessage(
  session: ChatSession,
  userMessage: string
): Promise<{ response: string; session: ChatSession }> {
  
  // Detect language if first message
  if (session.messages.length === 0) {
    session.language = detectLanguage(userMessage);
  }
  
  const t = translations[session.language];
  
  // Add user message to session
  session.messages.push({ role: 'user', content: userMessage });
  
  let response = '';
  
  // State machine for conversation flow
  switch (session.stage) {
    case 'greeting':
      // First interaction - ask for company name
      response = t.askCompany;
      session.stage = 'qualifying';
      break;
      
    case 'qualifying':
      if (!session.leadData.companyName) {
        // Capture company name
        session.leadData.companyName = userMessage;
        response = t.askSize.replace('{company}', userMessage);
      } else if (!session.leadData.notes) {
        // Capture fleet size and ask about needs
        const fleetSize = parseInt(userMessage) || 0;
        session.leadData.notes = `Fleet size: ${fleetSize} vehicles. `;
        response = t.askNeeds;
      } else {
        // Capture needs and recommend plan
        session.leadData.notes += `Needs: ${userMessage}`;
        const fleetSize = parseInt(session.leadData.notes.match(/(\d+) vehicles/)?.[1] || '0');
        const plan = recommendPlan(fleetSize, userMessage);
        session.leadData.plan = plan;
        
        response = t.recommendPlan
          .replace('{plan}', plan.toUpperCase())
          .replace('{features}', planFeatures[plan][session.language]);
        
        response += '\n\n' + t.askContact;
        session.stage = 'capturing';
      }
      break;
      
    case 'capturing':
      if (!session.leadData.contactName) {
        // Capture contact name
        session.leadData.contactName = userMessage;
        response = t.askEmail.replace('{name}', userMessage);
      } else if (!session.leadData.email) {
        // Capture email
        session.leadData.email = userMessage;
        response = t.askPhone;
      } else if (!session.leadData.phone) {
        // Capture phone (optional)
        if (userMessage.match(/\d{6,}/)) {
          session.leadData.phone = userMessage;
        }
        session.stage = 'closing';
        
        // Create lead in database
        try {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          
          const [newLead] = await db.insert(leads).values({
            companyName: session.leadData.companyName!,
            contactName: session.leadData.contactName!,
            email: session.leadData.email!,
            phone: session.leadData.phone || null,
            country: session.leadData.country || null,
            plan: session.leadData.plan || 'silver',
            language: session.language,
            source: 'chatbot',
            status: 'new',
            notes: session.leadData.notes || null,
          }).returning();
          
          // Log activity
          await db.insert(activities).values({
            type: 'note',
            description: `Lead captured via AI chatbot. Language: ${session.language}. Recommended plan: ${session.leadData.plan}`,
            userId: 1, // System/Bot user
          });
          
          response = t.closing.replace('{name}', session.leadData.contactName!);
        } catch (error) {
          console.error('Error creating lead:', error);
          response = 'Thank you! We will contact you soon.';
        }
      }
      break;
      
    case 'closing':
      // Handle additional questions or say goodbye
      if (userMessage.toLowerCase().match(/\b(no|nein|gracias|danke|thanks|bye|tschüss|adiós)\b/)) {
        response = t.goodbye;
        session.stage = 'completed';
      } else {
        // Answer common questions
        response = "I've noted your question. Our team will address it when they contact you. Anything else?";
      }
      break;
      
    case 'completed':
      response = t.goodbye;
      break;
  }
  
  // Add assistant response to session
  session.messages.push({ role: 'assistant', content: response });
  
  return { response, session };
}

// Initialize new chat session
export function createChatSession(): ChatSession {
  return {
    id: Math.random().toString(36).substring(7),
    messages: [],
    language: 'en',
    leadData: {},
    stage: 'greeting',
  };
}

