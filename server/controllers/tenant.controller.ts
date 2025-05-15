import { Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';

// Validation schemas
const updateTenantSchema = z.object({
  name: z.string().optional(),
  subdomain: z.string().optional(),
});

// Tenant controller methods
export const getTenant = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate input
    const validatedData = updateTenantSchema.parse(req.body);
    
    // Check if subdomain is being updated and is available
    if (validatedData.subdomain) {
      const existingTenant = await storage.getTenantBySubdomain(validatedData.subdomain);
      if (existingTenant && existingTenant.id !== tenantId) {
        return res.status(400).json({ message: "Subdomain is already taken" });
      }
    }
    
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    // Update tenant
    const updatedTenant = await storage.updateTenant(tenantId, {
      ...validatedData,
      updatedAt: new Date(),
    });
    
    res.status(200).json(updatedTenant);
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

// Add this method to the storage interface
storage.updateTenant = async (id: number, data: Partial<{ name: string; subdomain: string; updatedAt: Date }>) => {
  const tenant = await storage.getTenant(id);
  if (!tenant) return undefined;
  
  const updatedTenant = { ...tenant, ...data };
  
  // Simulate updating in the "database"
  for (const [key, value] of Object.entries(data)) {
    (tenant as any)[key] = value;
  }
  
  return updatedTenant;
};
