import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { contacts } from "../drizzle/schema";

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
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        
        await db.insert(contacts).values({
          name: input.name,
          email: input.email,
          company: input.company,
          message: input.message,
          language: input.language,
        });
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
