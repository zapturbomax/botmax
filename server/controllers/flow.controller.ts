import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertFlowSchema, FlowNode, FlowEdge } from '@shared/schema';
import { z } from 'zod';

// Validation schemas
const updateFlowSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

const flowNodesSchema = z.array(z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()),
}));

const flowEdgesSchema = z.array(z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
}));

// Flow controller methods
export const getFlows = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flows = await storage.getFlows(tenantId);
    res.status(200).json(flows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFlow = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }
    
    const flow = await storage.getFlow(flowId, tenantId);
    if (!flow) {
      return res.status(404).json({ message: "Flow not found" });
    }
    
    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createFlow = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate input
    const validatedData = insertFlowSchema.parse(req.body);
    
    // Get tenant's flows to check against plan limit
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    const user = await storage.getUser(tenant.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const currentFlows = await storage.getFlows(tenantId);
    const plan = user.planId ? await storage.getPlan(user.planId) : await storage.getPlan(1); // Default to Free plan
    
    if (plan && currentFlows.length >= plan.maxFlows) {
      return res.status(403).json({ 
        message: "Flow limit reached", 
        plan: plan.name, 
        limit: plan.maxFlows 
      });
    }
    
    // Create flow
    const flow = await storage.createFlow({
      ...validatedData,
      tenantId
    });
    
    res.status(201).json(flow);
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

export const updateFlow = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }
    
    // Validate input
    const validatedData = updateFlowSchema.parse(req.body);
    
    // Update flow
    const updatedFlow = await storage.updateFlow(flowId, tenantId, validatedData);
    if (!updatedFlow) {
      return res.status(404).json({ message: "Flow not found" });
    }
    
    res.status(200).json(updatedFlow);
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

export const deleteFlow = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }
    
    const success = await storage.deleteFlow(flowId, tenantId);
    if (!success) {
      return res.status(404).json({ message: "Flow not found" });
    }
    
    res.status(200).json({ message: "Flow deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFlowStatus = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }
    
    // Validate input
    const statusSchema = z.object({
      status: z.enum(['draft', 'published']),
    });
    
    const { status } = statusSchema.parse(req.body);
    
    // Update flow status
    const updatedFlow = await storage.updateFlowStatus(flowId, tenantId, status);
    if (!updatedFlow) {
      return res.status(404).json({ message: "Flow not found" });
    }
    
    res.status(200).json(updatedFlow);
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

export const updateFlowNodes = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }
    
    // Validate input
    const nodes = flowNodesSchema.parse(req.body);
    
    // Update flow nodes
    const updatedFlow = await storage.updateFlowNodes(flowId, tenantId, nodes as FlowNode[]);
    if (!updatedFlow) {
      return res.status(404).json({ message: "Flow not found" });
    }
    
    res.status(200).json(updatedFlow);
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

export const updateFlowEdges = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }
    
    // Validate input
    const edges = flowEdgesSchema.parse(req.body);
    
    // Update flow edges
    const updatedFlow = await storage.updateFlowEdges(flowId, tenantId, edges as FlowEdge[]);
    if (!updatedFlow) {
      return res.status(404).json({ message: "Flow not found" });
    }
    
    res.status(200).json(updatedFlow);
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
