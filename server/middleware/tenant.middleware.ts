import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export const validateTenant = async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.user?.tenantId;
  
  if (!tenantId) {
    return res.status(401).json({ message: 'Unauthorized: No tenant ID in token' });
  }
  
  try {
    const tenant = await storage.getTenant(tenantId);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Add tenant info to request for potential use later
    req.tenant = tenant;
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error validating tenant', error: error.message });
  }
};

// Extend Express Request to include tenant
declare global {
  namespace Express {
    interface Request {
      tenant?: any; // Replace with proper tenant type if needed
    }
  }
}
