import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { createCheckoutSession, PLANS, PlanType } from "./stripe";
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsByStatus,
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  getActiveClients,
  createActivity,
  getActivitiesByLead,
  getActivitiesByClient,
  getRecentActivities,
  createPayment,
  getPaymentsByClient,
  getAllPayments,
  getAllContacts,
  getNewContacts,
  updateContact,
  createDemo,
  getAllDemos,
  getDemoBySlug,
  incrementDemoViews,
  getDashboardStats,
  getAllUsers,
} from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  public: router({
    submitContact: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        company: z.string().optional(),
        message: z.string(),
        language: z.enum(['de', 'es', 'en']),
      }))
      .mutation(async ({ input }) => {
        // Send notification to owner instead of saving to database
        const languageNames = {
          de: 'Alemán',
          es: 'Español',
          en: 'Inglés'
        };
        
        await notifyOwner({
          title: `🚀 Nuevo Lead de Cargo Branding`,
          content: `
**Nuevo contacto desde la web:**

👤 **Nombre:** ${input.name}
📧 **Email:** ${input.email}
🏢 **Empresa:** ${input.company || 'No especificada'}
🌍 **Idioma:** ${languageNames[input.language]}

💬 **Mensaje:**
${input.message}

---
*Responde lo antes posible para cerrar este cliente.*
          `.trim()
        });
        
        return { success: true };
      }),
  }),

  // Stripe payment routers
  payments: router({
    createCheckout: publicProcedure
      .input(
        z.object({
          plan: z.enum(["bronze", "silver", "gold"]),
          email: z.string().email(),
          billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
        })
      )
      .mutation(async ({ input }) => {
        const session = await createCheckoutSession(
          input.plan as PlanType,
          input.email,
          input.billingCycle,
          `${process.env.VITE_APP_URL || 'https://cargobranding.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
          `${process.env.VITE_APP_URL || 'https://cargobranding.com'}/pricing`
        );
        return { url: session.url };
      }),
    getPlans: publicProcedure.query(() => {
      return PLANS;
    }),
    getAllPayments: protectedProcedure.query(async () => {
      return await getAllPayments();
    }),
    getPaymentsByClient: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await getPaymentsByClient(input.clientId);
      }),
  }),

  // CRM - Leads Management
  leads: router({
    getAll: protectedProcedure.query(async () => {
      return await getAllLeads();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getLeadById(input.id);
      }),
    
    getByStatus: protectedProcedure
      .input(z.object({ status: z.string() }))
      .query(async ({ input }) => {
        return await getLeadsByStatus(input.status);
      }),
    
    create: protectedProcedure
      .input(z.object({
        companyName: z.string(),
        contactName: z.string().optional(),
        email: z.string().email(),
        phone: z.string().optional(),
        website: z.string().optional(),
        country: z.string().optional(),
        status: z.enum(['new', 'contacted', 'demo_sent', 'proposal_sent', 'negotiating', 'won', 'lost', 'on_hold']).default('new'),
        interestedPlan: z.enum(['bronze', 'silver', 'gold']).optional(),
        preferredLanguage: z.enum(['de', 'es', 'en']).default('de'),
        source: z.string().optional(),
        notes: z.string().optional(),
        nextFollowUpDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await createLead({
          ...input,
          assignedToUserId: ctx.user.id,
        });
        
        // Log activity
        const leadId = Number((result as any).insertId || 0);
        if (leadId > 0) {
          await createActivity({
            leadId: leadId,
            type: 'note',
            subject: 'Lead creado',
            description: `Lead ${input.companyName} añadido al CRM`,
            userId: ctx.user.id,
          });
        }
        
        return { success: true, id: leadId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        companyName: z.string().optional(),
        contactName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        country: z.string().optional(),
        status: z.enum(['new', 'contacted', 'demo_sent', 'proposal_sent', 'negotiating', 'won', 'lost', 'on_hold']).optional(),
        interestedPlan: z.enum(['bronze', 'silver', 'gold']).optional(),
        preferredLanguage: z.enum(['de', 'es', 'en']).optional(),
        source: z.string().optional(),
        notes: z.string().optional(),
        lastContactDate: z.date().optional(),
        nextFollowUpDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await updateLead(id, data);
        
        // Log activity if status changed
        if (data.status) {
          await createActivity({
            leadId: id,
            type: 'status_change',
            subject: 'Estado actualizado',
            description: `Estado cambiado a: ${data.status}`,
            userId: ctx.user.id,
          });
        }
        
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLead(input.id);
        return { success: true };
      }),
  }),

  // CRM - Clients Management
  clients: router({
    getAll: protectedProcedure.query(async () => {
      return await getAllClients();
    }),
    
    getActive: protectedProcedure.query(async () => {
      return await getActiveClients();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getClientById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        leadId: z.number().optional(),
        companyName: z.string(),
        contactName: z.string().optional(),
        email: z.string().email(),
        phone: z.string().optional(),
        website: z.string().optional(),
        country: z.string().optional(),
        plan: z.enum(['bronze', 'silver', 'gold']),
        billingCycle: z.enum(['monthly', 'annual']).default('monthly'),
        setupFee: z.string().optional(),
        recurringFee: z.string().optional(),
        status: z.enum(['active', 'paused', 'cancelled', 'overdue']).default('active'),
        language: z.enum(['de', 'es', 'en']).default('de'),
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
        contractStartDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await createClient(input);
        
        // Log activity
        const clientId = Number((result as any).insertId || 0);
        if (clientId > 0) {
          await createActivity({
            clientId: clientId,
            type: 'note',
            subject: 'Cliente creado',
            description: `Cliente ${input.companyName} añadido - Plan ${input.plan}`,
            userId: ctx.user.id,
          });
        }
        
        return { success: true, id: clientId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        companyName: z.string().optional(),
        contactName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        country: z.string().optional(),
        plan: z.enum(['bronze', 'silver', 'gold']).optional(),
        billingCycle: z.enum(['monthly', 'annual']).optional(),
        status: z.enum(['active', 'paused', 'cancelled', 'overdue']).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await updateClient(id, data);
        
        // Log activity
        await createActivity({
          clientId: id,
          type: 'note',
          subject: 'Cliente actualizado',
          description: `Información del cliente actualizada`,
          userId: ctx.user.id,
        });
        
        return { success: true };
      }),
  }),

  // CRM - Activities
  activities: router({
    getRecent: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await getRecentActivities(input.limit);
      }),
    
    getByLead: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        return await getActivitiesByLead(input.leadId);
      }),
    
    getByClient: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await getActivitiesByClient(input.clientId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        leadId: z.number().optional(),
        clientId: z.number().optional(),
        type: z.enum(['note', 'email_sent', 'email_received', 'call', 'meeting', 'demo_sent', 'proposal_sent', 'payment_received', 'status_change', 'other']),
        subject: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await createActivity({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),
  }),

  // CRM - Dashboard
  dashboard: router({
    getStats: protectedProcedure.query(async () => {
      return await getDashboardStats();
    }),
  }),

  // CRM - Users Management (Admin only)
  users: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }
      return await getAllUsers();
    }),
  }),

  // Contacts from website
  contacts: router({
    getAll: protectedProcedure.query(async () => {
      return await getAllContacts();
    }),
    
    getNew: protectedProcedure.query(async () => {
      return await getNewContacts();
    }),
    
    convertToLead: protectedProcedure
      .input(z.object({
        contactId: z.number(),
        interestedPlan: z.enum(['bronze', 'silver', 'gold']).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const contact = (await getAllContacts()).find(c => c.id === input.contactId);
        if (!contact) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' });
        }
        
        // Create lead from contact
        const result = await createLead({
          companyName: contact.company || contact.name,
          contactName: contact.name,
          email: contact.email,
          preferredLanguage: contact.language,
          interestedPlan: input.interestedPlan,
          source: 'Website Contact Form',
          notes: `Original message: ${contact.message}`,
          assignedToUserId: ctx.user.id,
        });
        
        const leadId = Number((result as any).insertId || 0);
        
        // Update contact status
        if (leadId > 0) {
          await updateContact(input.contactId, {
            status: 'converted_to_lead',
            convertedToLeadId: leadId,
          });
        }
        
        return { success: true, leadId: leadId };
      }),
  }),
});

export type AppRouter = typeof appRouter;

