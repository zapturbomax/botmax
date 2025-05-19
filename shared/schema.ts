import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication and profile information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  avatar: text("avatar"),
  role: text("role").default("customer").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  planId: integer("plan_id").references(() => plans.id),
});

// Plans schema for subscription tiers
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  interval: text("interval").default("month").notNull(), // month or year
  stripePriceId: text("stripe_price_id"),
  active: boolean("active").default(true).notNull(),
  maxFlows: integer("max_flows").notNull(),
  maxMessages: integer("max_messages").notNull(),
  maxContacts: integer("max_contacts").notNull(),
  maxWhatsappIntegrations: integer("max_whatsapp_integrations").notNull(),
  features: json("features").$type<string[]>().default([]),
});

// Tenants schema for multi-tenant architecture
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flows schema for chatbot flows
export const flows = pgTable("flows", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("draft").notNull(), // draft, published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  nodes: json("nodes").$type<FlowNode[]>().default([]),
  edges: json("edges").$type<FlowEdge[]>().default([]),
  isBeta: boolean('is_beta').default(false).notNull(),
});

// WhatsApp Integration schema
export const whatsappIntegrations = pgTable("whatsapp_integrations", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  apiKey: text("api_key").notNull(),
  apiSecret: text("api_secret").notNull(),
  webhookUrl: text("webhook_url"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contacts schema for WhatsApp contacts
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  phoneNumber: text("phone_number").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  variables: json("variables").$type<Record<string, string>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  planId: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  active: true,
  features: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Fluxo base, para validação interna
const baseFlowSchema = createInsertSchema(flows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema para inserção com campos opcionais para facilitar a criação pelo cliente
export const insertFlowSchema = baseFlowSchema.extend({
  status: z.enum(['draft', 'published']).default('draft').optional(),
  nodes: z.array(z.any()).nullable().default(null).optional(),
  edges: z.array(z.any()).nullable().default(null).optional(),
  tenantId: z.number().optional(), // Será adicionado automaticamente pelo controller
});

export const insertWhatsappIntegrationSchema = createInsertSchema(whatsappIntegrations).omit({
  id: true,
  active: true,
  createdAt: true,
  updatedAt: true,
  webhookUrl: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  variables: true,
});

// Define flow node and edge types for the builder
export type FlowNodeType = 
  | 'startTrigger'
  | 'textMessage'
  | 'mediaMessage'
  | 'quickReplies'
  | 'listMessage'
  | 'condition'
  | 'waitResponse'
  | 'delay'
  | 'httpRequest'
  | 'setVariable'
  | 'humanTransfer'
  | 'actionButtons';

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

// Define types based on insert schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type InsertFlow = z.infer<typeof insertFlowSchema>;
export type InsertWhatsappIntegration = z.infer<typeof insertWhatsappIntegrationSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Define types based on select schemas
export type User = typeof users.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type Flow = typeof flows.$inferSelect;
export type WhatsappIntegration = typeof whatsappIntegrations.$inferSelect;
export type Contact = typeof contacts.$inferSelect;