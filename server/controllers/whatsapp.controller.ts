import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertWhatsappIntegrationSchema } from '@shared/schema';
import { z } from 'zod';

// Validation schemas
const updateWhatsappIntegrationSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  active: z.boolean().optional(),
});

// WhatsApp controller methods
export const getWhatsappIntegrations = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const integrations = await storage.getWhatsappIntegrations(tenantId);
    res.status(200).json(integrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWhatsappIntegration = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const integrationId = parseInt(req.params.id);
    if (isNaN(integrationId)) {
      return res.status(400).json({ message: "Invalid integration ID" });
    }
    
    const integration = await storage.getWhatsappIntegration(integrationId, tenantId);
    if (!integration) {
      return res.status(404).json({ message: "WhatsApp integration not found" });
    }
    
    res.status(200).json(integration);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createWhatsappIntegration = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate input
    const validatedData = insertWhatsappIntegrationSchema.parse(req.body);
    
    // Check tenant's plan limit for integrations
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    const user = await storage.getUser(tenant.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const currentIntegrations = await storage.getWhatsappIntegrations(tenantId);
    const plan = user.planId ? await storage.getPlan(user.planId) : await storage.getPlan(1); // Default to Free plan
    
    if (plan && currentIntegrations.length >= plan.maxWhatsappIntegrations) {
      return res.status(403).json({ 
        message: "WhatsApp integration limit reached", 
        plan: plan.name, 
        limit: plan.maxWhatsappIntegrations 
      });
    }
    
    // Create WhatsApp integration
    const integration = await storage.createWhatsappIntegration({
      ...validatedData,
      tenantId
    });
    
    res.status(201).json(integration);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateWhatsappIntegration = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const integrationId = parseInt(req.params.id);
    if (isNaN(integrationId)) {
      return res.status(400).json({ message: "Invalid integration ID" });
    }
    
    // Validate input
    const validatedData = updateWhatsappIntegrationSchema.parse(req.body);
    
    // Update WhatsApp integration
    const updatedIntegration = await storage.updateWhatsappIntegration(integrationId, tenantId, validatedData);
    if (!updatedIntegration) {
      return res.status(404).json({ message: "WhatsApp integration not found" });
    }
    
    res.status(200).json(updatedIntegration);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteWhatsappIntegration = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const integrationId = parseInt(req.params.id);
    if (isNaN(integrationId)) {
      return res.status(400).json({ message: "Invalid integration ID" });
    }
    
    const success = await storage.deleteWhatsappIntegration(integrationId, tenantId);
    if (!success) {
      return res.status(404).json({ message: "WhatsApp integration not found" });
    }
    
    res.status(200).json({ message: "WhatsApp integration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Webhooks for WhatsApp
export const handleWhatsappWebhook = async (req: Request, res: Response) => {
  try {
    const integrationId = parseInt(req.params.id);
    if (isNaN(integrationId)) {
      return res.status(400).json({ message: "Invalid integration ID" });
    }
    
    // Find the WhatsApp integration
    let integration;
    const tenants = await Promise.all((await storage.getPlans()).map(async () => {
      const allIntegrations = [];
      for (let i = 1; i <= 100; i++) {
        const tenant = await storage.getTenant(i);
        if (tenant) {
          const integrations = await storage.getWhatsappIntegrations(tenant.id);
          allIntegrations.push(...integrations);
        }
      }
      return allIntegrations;
    }));
    
    integration = tenants.flat().find(i => i.id === integrationId);
    
    if (!integration) {
      return res.status(404).json({ message: "WhatsApp integration not found" });
    }
    
    // Verify the request is from WhatsApp (in a real implementation)
    // ...
    
    // Process incoming message
    // 1. Parse the incoming message from the request body
    const incomingMessage = req.body;
    
    // 2. Find the appropriate flow to execute based on the message
    const flows = await storage.getFlows(integration.tenantId);
    const activeFlows = flows.filter(flow => flow.status === 'published');
    
    // In a real implementation, we would:
    // - Identify the sender
    // - Check if there's an ongoing conversation
    // - Find the appropriate flow to execute
    // - Execute the flow
    // - Send a response back to WhatsApp
    
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
