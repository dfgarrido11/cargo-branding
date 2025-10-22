import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Cargo Branding Tables

/**
 * Clients table - stores information about transport/logistics companies
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  plan: mysqlEnum("plan", ["bronze", "silver", "gold"]),
  status: mysqlEnum("status", ["lead", "demo_sent", "contacted", "active", "inactive"]).default("lead").notNull(),
  language: mysqlEnum("language", ["de", "es", "en"]).default("de").notNull(),
  setupFee: int("setupFee"),
  monthlyFee: int("monthlyFee"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Contact form submissions
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  language: mysqlEnum("language", ["de", "es", "en"]).default("de").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "converted"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Demo websites generated for potential clients
 */
export const demos = mysqlTable("demos", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: varchar("logoUrl", { length: 500 }),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#1e40af"),
  language: mysqlEnum("language", ["de", "es", "en"]).default("de").notNull(),
  views: int("views").default(0).notNull(),
  lastViewed: timestamp("lastViewed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Demo = typeof demos.$inferSelect;
export type InsertDemo = typeof demos.$inferInsert;