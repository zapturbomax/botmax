import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate, authorize } from "./middleware/auth.middleware";
import { validateTenant } from "./middleware/tenant.middleware";
import * as authController from "./controllers/auth.controller";
import * as flowController from "./controllers/flow.controller";
import * as subscriptionController from "./controllers/subscription.controller";
import * as tenantController from "./controllers/tenant.controller";
import * as whatsAppController from "./controllers/whatsapp.controller";
import express from "express";
import Stripe from "stripe";

// Middleware to parse Stripe webhook events
const stripeWebhookMiddleware = express.raw({ type: 'application/json' });

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", authController.login);
  app.get("/api/auth/profile", authenticate, authController.getProfile);
  app.put("/api/auth/profile", authenticate, authController.updateProfile);
  app.post("/api/auth/change-password", authenticate, authController.changePassword);
  
  // Tenant routes
  app.get("/api/tenant", authenticate, tenantController.getTenant);
  app.put("/api/tenant", authenticate, tenantController.updateTenant);
  
  // Flow routes
  app.get("/api/flows", authenticate, validateTenant, flowController.getFlows);
  app.get("/api/flows/:id", authenticate, validateTenant, flowController.getFlow);
  app.post("/api/flows", authenticate, validateTenant, flowController.createFlow);
  app.put("/api/flows/:id", authenticate, validateTenant, flowController.updateFlow);
  app.delete("/api/flows/:id", authenticate, validateTenant, flowController.deleteFlow);
  app.put("/api/flows/:id/status", authenticate, validateTenant, flowController.updateFlowStatus);
  app.put("/api/flows/:id/nodes", authenticate, validateTenant, flowController.updateFlowNodes);
  app.put("/api/flows/:id/edges", authenticate, validateTenant, flowController.updateFlowEdges);
  
  // Subscription routes
  app.get("/api/plans", subscriptionController.getPlans);
  app.get("/api/plans/:id", subscriptionController.getPlan);
  app.get("/api/subscription/current", authenticate, subscriptionController.getCurrentPlan);
  app.post("/api/subscription/checkout", authenticate, subscriptionController.createCheckoutSession);
  app.post("/api/subscription/portal", authenticate, subscriptionController.getPortalSession);
  app.post("/api/webhook/stripe", stripeWebhookMiddleware, subscriptionController.handleStripeWebhook);
  
  // WhatsApp routes
  app.get("/api/whatsapp", authenticate, validateTenant, whatsAppController.getWhatsappIntegrations);
  app.get("/api/whatsapp/:id", authenticate, validateTenant, whatsAppController.getWhatsappIntegration);
  app.post("/api/whatsapp", authenticate, validateTenant, whatsAppController.createWhatsappIntegration);
  app.put("/api/whatsapp/:id", authenticate, validateTenant, whatsAppController.updateWhatsappIntegration);
  app.delete("/api/whatsapp/:id", authenticate, validateTenant, whatsAppController.deleteWhatsappIntegration);
  app.post("/api/webhook/whatsapp/:id", whatsAppController.handleWhatsappWebhook);
  
  const httpServer = createServer(app);
  
  return httpServer;
}
