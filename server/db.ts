import { eq, desc, and, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  InsertLead, leads,
  InsertClient, clients,
  InsertActivity, activities,
  InsertPayment, payments,
  InsertContact, contacts,
  InsertDemo, demos
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

// ============================================================================
// LEADS MANAGEMENT
// ============================================================================

export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(leads).values(lead);
  return result;
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0] || null;
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(leads).set(data).where(eq(leads.id, id));
}

export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(leads).where(eq(leads.id, id));
}

export async function getLeadsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(leads).where(eq(leads.status, status as any)).orderBy(desc(leads.createdAt));
}

export async function getLeadsByAssignedUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(leads).where(eq(leads.assignedToUserId, userId)).orderBy(desc(leads.createdAt));
}

// ============================================================================
// CLIENTS MANAGEMENT
// ============================================================================

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(client);
  return result;
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0] || null;
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function getActiveClients() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clients).where(eq(clients.status, 'active')).orderBy(desc(clients.createdAt));
}

// ============================================================================
// ACTIVITIES MANAGEMENT
// ============================================================================

export async function createActivity(activity: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(activities).values(activity);
  return result;
}

export async function getActivitiesByLead(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(activities).where(eq(activities.leadId, leadId)).orderBy(desc(activities.createdAt));
}

export async function getActivitiesByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(activities).where(eq(activities.clientId, clientId)).orderBy(desc(activities.createdAt));
}

export async function getRecentActivities(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(limit);
}

// ============================================================================
// PAYMENTS MANAGEMENT
// ============================================================================

export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payments).values(payment);
  return result;
}

export async function getPaymentsByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).where(eq(payments.clientId, clientId)).orderBy(desc(payments.createdAt));
}

export async function getAllPayments() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).orderBy(desc(payments.createdAt));
}

// ============================================================================
// CONTACTS MANAGEMENT
// ============================================================================

export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contacts).values(contact);
  return result;
}

export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function getNewContacts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contacts).where(eq(contacts.status, 'new')).orderBy(desc(contacts.createdAt));
}

export async function updateContact(id: number, data: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contacts).set(data).where(eq(contacts.id, id));
}

// ============================================================================
// DEMOS MANAGEMENT
// ============================================================================

export async function createDemo(demo: InsertDemo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(demos).values(demo);
  return result;
}

export async function getAllDemos() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(demos).orderBy(desc(demos.createdAt));
}

export async function getDemoBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(demos).where(eq(demos.slug, slug)).limit(1);
  return result[0] || null;
}

export async function incrementDemoViews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(demos).set({
    views: sql`${demos.views} + 1`,
    lastViewed: new Date()
  }).where(eq(demos.id, id));
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [
    totalLeads,
    totalClients,
    activeClients,
    totalPayments,
    recentActivitiesData
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(leads),
    db.select({ count: sql<number>`count(*)` }).from(clients),
    db.select({ count: sql<number>`count(*)` }).from(clients).where(eq(clients.status, 'active')),
    db.select({ 
      total: sql<number>`sum(amount)`,
      count: sql<number>`count(*)`
    }).from(payments).where(eq(payments.status, 'succeeded')),
    getRecentActivities(10)
  ]);
  
  return {
    totalLeads: totalLeads[0]?.count || 0,
    totalClients: totalClients[0]?.count || 0,
    activeClients: activeClients[0]?.count || 0,
    totalRevenue: totalPayments[0]?.total || 0,
    totalPayments: totalPayments[0]?.count || 0,
    recentActivities: recentActivitiesData
  };
}

