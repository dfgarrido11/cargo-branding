import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended for CRM multi-user functionality.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /**
   * Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user.
   * This mirrors the Manus account and should be used for authentication lookups.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Cargo Branding CRM Tables

/**
 * Leads/Prospects table - potential clients in the sales pipeline
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  country: varchar("country", { length: 100 }),
  
  // Sales pipeline status
  status: mysqlEnum("status", [
    "new",           // Just added to CRM
    "contacted",     // Initial contact made
    "demo_sent",     // Demo website sent
    "proposal_sent", // Pricing proposal sent
    "negotiating",   // In negotiation
    "won",          // Converted to client
    "lost",         // Lost opportunity
    "on_hold"       // Paused/waiting
  ]).default("new").notNull(),
  
  // Interest and preferences
  interestedPlan: mysqlEnum("interestedPlan", ["bronze", "silver", "gold"]),
  preferredLanguage: mysqlEnum("preferredLanguage", ["de", "es", "en"]).default("de").notNull(),
  source: varchar("source", { length: 255 }), // Where did we find them? (TimoCom, referral, etc.)
  
  // Assignment
  assignedToUserId: int("assignedToUserId"), // Which CRM user is handling this lead
  
  // Notes and tracking
  notes: text("notes"),
  lastContactDate: timestamp("lastContactDate"),
  nextFollowUpDate: timestamp("nextFollowUpDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Clients table - active paying customers
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"), // Reference to original lead
  
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  country: varchar("country", { length: 100 }),
  
  // Plan and pricing
  plan: mysqlEnum("plan", ["bronze", "silver", "gold"]).notNull(),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "annual"]).default("monthly").notNull(),
  setupFee: decimal("setupFee", { precision: 10, scale: 2 }),
  recurringFee: decimal("recurringFee", { precision: 10, scale: 2 }),
  
  // Status
  status: mysqlEnum("status", ["active", "paused", "cancelled", "overdue"]).default("active").notNull(),
  language: mysqlEnum("language", ["de", "es", "en"]).default("de").notNull(),
  
  // Stripe integration
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  
  // Dates
  contractStartDate: timestamp("contractStartDate"),
  contractEndDate: timestamp("contractEndDate"),
  lastPaymentDate: timestamp("lastPaymentDate"),
  nextPaymentDate: timestamp("nextPaymentDate"),
  
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Activity log - track all interactions with leads and clients
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  
  // What was this activity about?
  leadId: int("leadId"),
  clientId: int("clientId"),
  
  // Activity details
  type: mysqlEnum("type", [
    "note",
    "email_sent",
    "email_received",
    "call",
    "meeting",
    "demo_sent",
    "proposal_sent",
    "payment_received",
    "status_change",
    "other"
  ]).notNull(),
  
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  
  // Who did this?
  userId: int("userId").notNull(), // CRM user who logged this activity
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Contact form submissions from website
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  language: mysqlEnum("language", ["de", "es", "en"]).default("de").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "converted_to_lead"]).default("new").notNull(),
  convertedToLeadId: int("convertedToLeadId"), // If converted, reference to lead
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Demo websites generated for potential clients
 */
export const demos = mysqlTable("demos", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  clientId: int("clientId"),
  
  companyName: varchar("companyName", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#1e40af"),
  language: mysqlEnum("language", ["de", "es", "en"]).default("de").notNull(),
  
  // Tracking
  views: int("views").default(0).notNull(),
  lastViewed: timestamp("lastViewed"),
  sentToEmail: varchar("sentToEmail", { length: 320 }),
  sentAt: timestamp("sentAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Demo = typeof demos.$inferSelect;
export type InsertDemo = typeof demos.$inferInsert;

/**
 * Payments tracking (synced from Stripe)
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  
  stripePaymentId: varchar("stripePaymentId", { length: 255 }).unique(),
  stripeInvoiceId: varchar("stripeInvoiceId", { length: 255 }),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  
  type: mysqlEnum("type", ["setup_fee", "subscription", "one_time"]).notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).notNull(),
  
  description: varchar("description", { length: 500 }),
  
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

