import { 
  User, InsertUser, 
  Plan, InsertPlan, 
  Tenant, InsertTenant, 
  Flow, InsertFlow,
  WhatsappIntegration, InsertWhatsappIntegration,
  Contact, InsertContact,
  FlowNode, FlowEdge
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateUserStripeInfo(id: number, data: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined>;

  // Plan operations
  getPlans(): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, data: Partial<Plan>): Promise<Plan | undefined>;

  // Tenant operations
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenantByUserId(userId: number): Promise<Tenant | undefined>;
  getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;

  // Flow operations
  getFlows(tenantId: number, isBeta?: boolean): Promise<Flow[]>;
  getFlow(id: number, tenantId: number, isBeta?: boolean): Promise<Flow | undefined>;
  createFlow(flow: InsertFlow): Promise<Flow>;
  updateFlow(id: number, tenantId: number, data: Partial<Flow>): Promise<Flow | undefined>;
  deleteFlow(id: number, tenantId: number): Promise<boolean>;
  updateFlowStatus(id: number, tenantId: number, status: 'draft' | 'published'): Promise<Flow | undefined>;
  updateFlowNodes(id: number, tenantId: number, nodes: FlowNode[]): Promise<Flow | undefined>;
  updateFlowEdges(id: number, tenantId: number, edges: FlowEdge[]): Promise<Flow | undefined>;

  // WhatsApp integration operations
  getWhatsappIntegrations(tenantId: number): Promise<WhatsappIntegration[]>;
  getWhatsappIntegration(id: number, tenantId: number): Promise<WhatsappIntegration | undefined>;
  createWhatsappIntegration(integration: InsertWhatsappIntegration): Promise<WhatsappIntegration>;
  updateWhatsappIntegration(id: number, tenantId: number, data: Partial<WhatsappIntegration>): Promise<WhatsappIntegration | undefined>;
  deleteWhatsappIntegration(id: number, tenantId: number): Promise<boolean>;

  // Contact operations
  getContacts(tenantId: number): Promise<Contact[]>;
  getContact(id: number, tenantId: number): Promise<Contact | undefined>;
  getContactByPhoneNumber(phoneNumber: string, tenantId: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, tenantId: number, data: Partial<Contact>): Promise<Contact | undefined>;
  updateContactVariables(id: number, tenantId: number, variables: Record<string, string>): Promise<Contact | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plans: Map<number, Plan>;
  private tenants: Map<number, Tenant>;
  private flows: Map<number, Flow>;
  private whatsappIntegrations: Map<number, WhatsappIntegration>;
  private contacts: Map<number, Contact>;

  private currentUserId: number = 1;
  private currentPlanId: number = 1;
  private currentTenantId: number = 1;
  private currentFlowId: number = 1;
  private currentWhatsappIntegrationId: number = 1;
  private currentContactId: number = 1;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.tenants = new Map();
    this.flows = new Map();
    this.whatsappIntegrations = new Map();
    this.contacts = new Map();

    // Initialize with default plans
    this.initializePlans();
  }

  private initializePlans() {
    const freePlan: Plan = {
      id: this.currentPlanId++,
      name: "Free",
      description: "Basic features for individuals",
      price: 0,
      interval: "month",
      stripePriceId: "price_free",
      active: true,
      maxFlows: 1,
      maxMessages: 100,
      maxContacts: 50,
      maxWhatsappIntegrations: 1,
      features: ["Text Messages", "Quick Replies"]
    };

    const basicPlan: Plan = {
      id: this.currentPlanId++,
      name: "Basic",
      description: "Great for small businesses",
      price: 2900,
      interval: "month",
      stripePriceId: "price_basic_monthly",
      active: true,
      maxFlows: 5,
      maxMessages: 1000,
      maxContacts: 500,
      maxWhatsappIntegrations: 1,
      features: ["Text Messages", "Media Messages", "Quick Replies", "List Messages", "Basic Conditions"]
    };

    const proPlan: Plan = {
      id: this.currentPlanId++,
      name: "Pro",
      description: "For growing businesses",
      price: 7900,
      interval: "month",
      stripePriceId: "price_pro_monthly",
      active: true,
      maxFlows: 20,
      maxMessages: 10000,
      maxContacts: 5000,
      maxWhatsappIntegrations: 3,
      features: ["All Basic Features", "HTTP Requests", "Advanced Conditions", "Human Transfer", "Templates"]
    };

    this.plans.set(freePlan.id, freePlan);
    this.plans.set(basicPlan.id, basicPlan);
    this.plans.set(proPlan.id, proPlan);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, role: "customer" };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, data: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Plan operations
  async getPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const id = this.currentPlanId++;
    const newPlan: Plan = { 
      ...plan, 
      id, 
      active: true,
      features: [] 
    };
    this.plans.set(id, newPlan);
    return newPlan;
  }

  async updatePlan(id: number, data: Partial<Plan>): Promise<Plan | undefined> {
    const plan = this.plans.get(id);
    if (!plan) return undefined;

    const updatedPlan = { ...plan, ...data };
    this.plans.set(id, updatedPlan);
    return updatedPlan;
  }

  // Tenant operations
  async getTenant(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async getTenantByUserId(userId: number): Promise<Tenant | undefined> {
    return Array.from(this.tenants.values()).find(
      (tenant) => tenant.userId === userId
    );
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    return Array.from(this.tenants.values()).find(
      (tenant) => tenant.subdomain === subdomain
    );
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const id = this.currentTenantId++;
    const now = new Date();
    const newTenant: Tenant = { 
      ...tenant, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.tenants.set(id, newTenant);
    return newTenant;
  }

  // Flow operations
  async getFlows(tenantId: number, isBeta: boolean = false): Promise<Flow[]> {
    return Array.from(this.flows.values()).filter(
      (flow) => flow.tenantId === tenantId && flow.isBeta === isBeta
    );
  }

  async getFlow(id: number, tenantId: number, isBeta: boolean = false): Promise<Flow | undefined> {
    const flow = this.flows.get(id);
    if (!flow || flow.tenantId !== tenantId) return undefined;
    return flow;
  }

  async createFlow(flow: InsertFlow): Promise<Flow> {
    const id = this.currentFlowId++;
    const now = new Date();
    const newFlow: Flow = { 
      ...flow, 
      id, 
      status: 'draft', 
      createdAt: now, 
      updatedAt: now,
      nodes: [],
      edges: []
    };
    this.flows.set(id, newFlow);
    return newFlow;
  }

  async updateFlow(id: number, tenantId: number, data: Partial<Flow>): Promise<Flow | undefined> {
    const flow = this.flows.get(id);
    if (!flow || flow.tenantId !== tenantId) return undefined;

    const updatedFlow = { 
      ...flow, 
      ...data, 
      updatedAt: new Date() 
    };
    this.flows.set(id, updatedFlow);
    return updatedFlow;
  }

  async deleteFlow(id: number, tenantId: number): Promise<boolean> {
    const flow = this.flows.get(id);
    if (!flow || flow.tenantId !== tenantId) return false;

    return this.flows.delete(id);
  }

  async updateFlowStatus(id: number, tenantId: number, status: 'draft' | 'published'): Promise<Flow | undefined> {
    const flow = this.flows.get(id);
    if (!flow || flow.tenantId !== tenantId) return undefined;

    const updatedFlow = { 
      ...flow, 
      status, 
      updatedAt: new Date() 
    };
    this.flows.set(id, updatedFlow);
    return updatedFlow;
  }

  async updateFlowNodes(id: number, tenantId: number, nodes: FlowNode[]): Promise<Flow | undefined> {
    const flow = this.flows.get(id);
    if (!flow || flow.tenantId !== tenantId) return undefined;

    const updatedFlow = { 
      ...flow, 
      nodes, 
      updatedAt: new Date() 
    };
    this.flows.set(id, updatedFlow);
    return updatedFlow;
  }

  async updateFlowEdges(id: number, tenantId: number, edges: FlowEdge[]): Promise<Flow | undefined> {
    const flow = this.flows.get(id);
    if (!flow || flow.tenantId !== tenantId) return undefined;

    const updatedFlow = { 
      ...flow, 
      edges, 
      updatedAt: new Date() 
    };
    this.flows.set(id, updatedFlow);
    return updatedFlow;
  }

  // WhatsApp integration operations
  async getWhatsappIntegrations(tenantId: number): Promise<WhatsappIntegration[]> {
    return Array.from(this.whatsappIntegrations.values()).filter(
      (integration) => integration.tenantId === tenantId
    );
  }

  async getWhatsappIntegration(id: number, tenantId: number): Promise<WhatsappIntegration | undefined> {
    const integration = this.whatsappIntegrations.get(id);
    if (!integration || integration.tenantId !== tenantId) return undefined;
    return integration;
  }

  async createWhatsappIntegration(integration: InsertWhatsappIntegration): Promise<WhatsappIntegration> {
    const id = this.currentWhatsappIntegrationId++;
    const now = new Date();
    const newIntegration: WhatsappIntegration = { 
      ...integration, 
      id, 
      active: true, 
      createdAt: now, 
      updatedAt: now,
      webhookUrl: `https://api.flowbot.io/webhook/${id}`
    };
    this.whatsappIntegrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateWhatsappIntegration(id: number, tenantId: number, data: Partial<WhatsappIntegration>): Promise<WhatsappIntegration | undefined> {
    const integration = this.whatsappIntegrations.get(id);
    if (!integration || integration.tenantId !== tenantId) return undefined;

    const updatedIntegration = { 
      ...integration, 
      ...data, 
      updatedAt: new Date() 
    };
    this.whatsappIntegrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  async deleteWhatsappIntegration(id: number, tenantId: number): Promise<boolean> {
    const integration = this.whatsappIntegrations.get(id);
    if (!integration || integration.tenantId !== tenantId) return false;

    return this.whatsappIntegrations.delete(id);
  }

  // Contact operations
  async getContacts(tenantId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      (contact) => contact.tenantId === tenantId
    );
  }

  async getContact(id: number, tenantId: number): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact || contact.tenantId !== tenantId) return undefined;
    return contact;
  }

  async getContactByPhoneNumber(phoneNumber: string, tenantId: number): Promise<Contact | undefined> {
    return Array.from(this.contacts.values()).find(
      (contact) => contact.phoneNumber === phoneNumber && contact.tenantId === tenantId
    );
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const now = new Date();
    const newContact: Contact = { 
      ...contact, 
      id, 
      createdAt: now, 
      updatedAt: now,
      variables: {}
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async updateContact(id: number, tenantId: number, data: Partial<Contact>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact || contact.tenantId !== tenantId) return undefined;

    const updatedContact = { 
      ...contact, 
      ...data, 
      updatedAt: new Date() 
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  async updateContactVariables(id: number, tenantId: number, variables: Record<string, string>): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact || contact.tenantId !== tenantId) return undefined;

    const updatedContact = { 
      ...contact, 
      variables: { ...contact.variables, ...variables }, 
      updatedAt: new Date() 
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
}

import { db, pool } from './db';
import { eq, and } from 'drizzle-orm';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { 
  users, 
  plans, 
  tenants, 
  flows, 
  whatsappIntegrations,
  contacts
} from '@shared/schema';
import { z } from 'zod';

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: number, data: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Plan operations
  async getPlans(): Promise<Plan[]> {
    return db.select().from(plans).orderBy(plans.price);
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan;
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const [newPlan] = await db.insert(plans).values(plan).returning();
    return newPlan;
  }

  async updatePlan(id: number, data: Partial<Plan>): Promise<Plan | undefined> {
    const [plan] = await db.update(plans)
      .set(data)
      .where(eq(plans.id, id))
      .returning();
    return plan;
  }

  // Tenant operations
  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async getTenantByUserId(userId: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.userId, userId));
    return tenant;
  }

  async getTenantBySubdomain(subdomain: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async updateTenant(id: number, data: Partial<Tenant>): Promise<Tenant | undefined> {
    const [tenant] = await db.update(tenants)
      .set(data)
      .where(eq(tenants.id, id))
      .returning();
    return tenant;
  }

  // Flow operations
  async getFlows(tenantId: number, isBeta: boolean = false): Promise<Flow[]> {
    try {
      console.log(`Getting flows for tenant ${tenantId}, isBeta=${isBeta}`);
      // Obter fluxos do tenant com filtro direto na consulta SQL
      const flowsResult = await db.select()
        .from(flows)
        .where(
          and(
            eq(flows.tenantId, tenantId),
            // Usar SQL diretamente para lidar com valores nulos adequadamente
            isBeta 
              ? eq(flows.isBeta, true)
              : or(eq(flows.isBeta, false), sql`${flows.isBeta} IS NULL`)
          )
        );

      console.log(`Found ${flowsResult.length} flows for tenant ${tenantId} with isBeta=${isBeta}`);
      return flowsResult;
    } catch (error) {
      console.error("Error getting flows:", error);
      throw error;
    }
  }

  async getFlow(id: number, tenantId: number, isBeta: boolean = false): Promise<Flow | undefined> {
    try {
      const [flow] = await db.select().from(flows)
        .where(and(
          eq(flows.id, id),
          eq(flows.tenantId, tenantId)
        ));

      if (flow) {
        // Converter para boolean para tratar possíveis valores undefined
        const flowIsBeta = flow.isBeta === true;
        if (flowIsBeta === isBeta) {
          return flow;
        }
      }
      return undefined;
    } catch (error) {
      console.error("Error getting flow:", error);
      throw error;
    }
  }

  async createFlow(flow: InsertFlow): Promise<Flow> {
    const [newFlow] = await db.insert(flows).values(flow).returning();
    return newFlow;
  }

  async updateFlow(id: number, tenantId: number, data: Partial<Flow>): Promise<Flow | undefined> {
    const [flow] = await db.update(flows)
      .set(data)
      .where(
        and(
          eq(flows.id, id),
          eq(flows.tenantId, tenantId)
        )
      )
      .returning();
    return flow;
  }

  async deleteFlow(id: number, tenantId: number): Promise<boolean> {
    const result = await db.delete(flows).where(
      and(
        eq(flows.id, id),
        eq(flows.tenantId, tenantId)
      )
    );
    return !!result;
  }

  async updateFlowStatus(id: number, tenantId: number, status: 'draft' | 'published'): Promise<Flow | undefined> {
    const [flow] = await db.update(flows)
      .set({ status })
      .where(
        and(
          eq(flows.id, id),
          eq(flows.tenantId, tenantId)
        )
      )
      .returning();
    return flow;
  }

  async updateFlowNodes(id: number, tenantId: number, flowNodes: FlowNode[]): Promise<Flow | undefined> {
    const [flow] = await db.update(flows)
      .set({ nodes: flowNodes })
      .where(
        and(
          eq(flows.id, id),
          eq(flows.tenantId, tenantId)
        )
      )
      .returning();
    return flow;
  }

  async updateFlowEdges(id: number, tenantId: number, flowEdges: FlowEdge[]): Promise<Flow | undefined> {
    const [flow] = await db.update(flows)
      .set({ edges: flowEdges })
      .where(
        and(
          eq(flows.id, id),
          eq(flows.tenantId, tenantId)
        )
      )
      .returning();
    return flow;
  }

  // WhatsApp integration operations
  async getWhatsappIntegrations(tenantId: number): Promise<WhatsappIntegration[]> {
    return db.select().from(whatsappIntegrations).where(eq(whatsappIntegrations.tenantId, tenantId));
  }

  async getWhatsappIntegration(id: number, tenantId: number): Promise<WhatsappIntegration | undefined> {
    const [integration] = await db.select().from(whatsappIntegrations).where(
      and(
        eq(whatsappIntegrations.id, id),
        eq(whatsappIntegrations.tenantId, tenantId)
      )
    );
    return integration;
  }

  async createWhatsappIntegration(integration: InsertWhatsappIntegration): Promise<WhatsappIntegration> {
    const [newIntegration] = await db.insert(whatsappIntegrations).values(integration).returning();
    return newIntegration;
  }

  async updateWhatsappIntegration(id: number, tenantId: number, data: Partial<WhatsappIntegration>): Promise<WhatsappIntegration | undefined> {
    const [integration] = await db.update(whatsappIntegrations)
      .set(data)
      .where(
        and(
          eq(whatsappIntegrations.id, id),
          eq(whatsappIntegrations.tenantId, tenantId)
        )
      )
      .returning();
    return integration;
  }

  async deleteWhatsappIntegration(id: number, tenantId: number): Promise<boolean> {
    const result = await db.delete(whatsappIntegrations).where(
      and(
        eq(whatsappIntegrations.id, id),
        eq(whatsappIntegrations.tenantId, tenantId)
      )
    );
    return !!result;
  }

  // Contact operations
  async getContacts(tenantId: number): Promise<Contact[]> {
    return db.select().from(contacts).where(eq(contacts.tenantId, tenantId));
  }

  async getContact(id: number, tenantId: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(
      and(
        eq(contacts.id, id),
        eq(contacts.tenantId, tenantId)
      )
    );
    return contact;
  }

  async getContactByPhoneNumber(phoneNumber: string, tenantId: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(
      and(
        eq(contacts.phoneNumber, phoneNumber),
        eq(contacts.tenantId, tenantId)
      )
    );
    return contact;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async updateContact(id: number, tenantId: number, data: Partial<Contact>): Promise<Contact | undefined> {
    const [contact] = await db.update(contacts)
      .set(data)
      .where(
        and(
          eq(contacts.id, id),
          eq(contacts.tenantId, tenantId)
        )
      )
      .returning();
    return contact;
  }

  async updateContactVariables(id: number, tenantId: number, variables: Record<string, string>): Promise<Contact | undefined> {
    const [contact] = await db.update(contacts)
      .set({ variables })
      .where(
        and(
          eq(contacts.id, id),
          eq(contacts.tenantId, tenantId)
        )
      )
      .returning();
    return contact;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
import * as schema from '@shared/schema';
export const getFlows = async (tenantId: number, isBeta: boolean = false) => {
    try {
      console.log(`Buscando fluxos com tenantId=${tenantId} e isBeta=${isBeta}`);
      const flowsList = await db.select().from(schema.flows).where(
        eq(schema.flows.tenantId, tenantId)
      );

      // Filtrar baseado na flag isBeta
      const filteredFlows = flowsList.filter(flow => {
        // Converter para boolean para tratar possíveis valores undefined
        const flowIsBeta = flow.isBeta === true;
        return flowIsBeta === isBeta;
      });

    return filteredFlows;
    } catch (error) {
      console.error("Error getting flows:", error);
      throw error;
    }
  };

export const getFlow = async (id: number, tenantId: number, isBeta: boolean = false) => {
  try {
    const flow = await db.select().from(schema.flows)
      .where(and(
        eq(schema.flows.id, id),
        eq(schema.flows.tenantId, tenantId)
      ))
      .limit(1);

    if (flow.length > 0) {
      // Converter para boolean para tratar possíveis valores undefined
      const flowIsBeta = flow[0].isBeta === true;
      if (flowIsBeta === isBeta) {
        return flow[0];
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting flow:", error);
    throw error;
  }
};

export const createFlow = async (data: z.infer<typeof schema.insertFlowSchema>) => {
  try {
    const flow = await db.insert(flows).values(data).returning();
    return flow[0];
  } catch (error) {
    console.error("Error creating flow:", error);
    throw error;
  }
};