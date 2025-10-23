import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";

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
});

export type AppRouter = typeof appRouter;

