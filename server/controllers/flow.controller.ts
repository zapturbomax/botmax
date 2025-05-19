import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertFlowSchema, FlowNode, FlowEdge } from '@shared/schema';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import * as schema from '@shared/schema';

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

    const flows = await storage.getFlows(tenantId, false); // false para fluxos normais
    res.status(200).json(flows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Beta flow controller methods
export const getFlowsBeta = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const flows = await storage.getFlows(tenantId, true); // true para fluxos beta
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

    const flow = await storage.getFlow(flowId, tenantId, false);
    if (!flow) {
      return res.status(404).json({ message: "Flow not found" });
    }

    res.status(200).json(flow);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFlowBeta = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const flowId = parseInt(req.params.id);
    if (isNaN(flowId)) {
      return res.status(400).json({ message: "Invalid flow ID" });
    }

    const flow = await storage.getFlow(flowId, tenantId, true);
    if (!flow) {
      return res.status(404).json({ message: "Flow Beta not found" });
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

    // Get tenant's flows to check against plan limit
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const user = await storage.getUser(tenant.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentFlows = await storage.getFlows(tenantId, false);
    const plan = user.planId ? await storage.getPlan(user.planId) : await storage.getPlan(1); // Default to Free plan

    if (plan && currentFlows.length >= plan.maxFlows) {
      return res.status(403).json({ 
        message: "Flow limit reached", 
        plan: plan.name, 
        limit: plan.maxFlows 
      });
    }

    // Prepare flow data with tenantId automatically added
    const flowData = {
      ...req.body,
      tenantId,
      status: req.body.status || 'draft',
      nodes: req.body.nodes || null,
      edges: req.body.edges || null,
      isBeta: false // Fluxo normal
    };

    // Validate the combined data
    const validatedData = insertFlowSchema.parse(flowData);

    // Create flow
    const flow = await storage.createFlow(validatedData);

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

export const createFlowBeta = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get tenant's flows to check against plan limit
    const tenant = await storage.getTenant(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const user = await storage.getUser(tenant.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Não limitamos a quantidade de fluxos beta para testes

    // Prepare flow data with tenantId automatically added
    const flowData = {
      ...req.body,
      tenantId,
      status: req.body.status || 'draft',
      nodes: req.body.nodes || null,
      edges: req.body.edges || null,
      isBeta: true // Marcar como fluxo beta
    };

    // Validate the combined data
    const validatedData = insertFlowSchema.parse(flowData);

    // Create flow
    const flow = await storage.createFlow(validatedData);

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

// Beta Flow Controller Functions
export const getFlowsBeta1 = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;

    const flows = await storage.db.select().from(schema.flows)
      .where(and(
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ));

    return res.json(flows);
  } catch (error: any) {
    console.error("Error fetching beta flows:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFlowBeta1 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;

    const flow = await storage.db.select().from(schema.flows)
      .where(and(
        eq(schema.flows.id, Number(id)),
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ))
      .limit(1);

    if (!flow.length) {
      return res.status(404).json({ message: "Flow not found" });
    }

    return res.json(flow[0]);
  } catch (error: any) {
    console.error("Error fetching beta flow:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createFlowBeta1 = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    const { name, description } = req.body;

    // Schema validation
    const schemaZ = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    });

    const validation = schemaZ.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const newFlow = await storage.db.insert(schema.flows).values({
      name,
      description: description || "",
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      isBeta: true,
      nodes: JSON.stringify([]),
      edges: JSON.stringify([]),
    }).returning();

    return res.json(newFlow[0]);
  } catch (error: any) {
    console.error("Error creating beta flow:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFlowBeta1 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    const { name, description } = req.body;

    // Schema validation
    const schemaZ = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    });

    const validation = schemaZ.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const updateData = {
      name,
      description: description || "",
      updatedAt: new Date(),
    };

    const result = await storage.db.update(schema.flows)
      .set(updateData)
      .where(and(
        eq(schema.flows.id, Number(id)),
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ))
      .returning();

    if (!result.length) {
      return res.status(404).json({ message: "Flow not found" });
    }

    return res.json(result[0]);
  } catch (error: any) {
    console.error("Error updating beta flow:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteFlowBeta1 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;

    const result = await storage.db.delete(schema.flows)
      .where(and(
        eq(schema.flows.id, Number(id)),
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ))
      .returning();

    if (!result.length) {
      return res.status(404).json({ message: "Flow not found" });
    }

    return res.json({ message: "Flow deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting beta flow:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFlowBetaStatus1 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    const { status } = req.body;

    // Schema validation
    const schemaZ = z.object({
      status: z.enum(["draft", "published"]),
    });

    const validation = schemaZ.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const result = await storage.db.update(schema.flows)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(and(
        eq(schema.flows.id, Number(id)),
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ))
      .returning();

    if (!result.length) {
      return res.status(404).json({ message: "Flow not found" });
    }

    return res.json(result[0]);
  } catch (error: any) {
    console.error("Error updating beta flow status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFlowBetaNodes1 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    const { nodes } = req.body;

    // Schema validation
    const schemaZ = z.object({
      nodes: z.array(z.any()),
    });

    const validation = schemaZ.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const result = await storage.db.update(schema.flows)
      .set({
        nodes: JSON.stringify(nodes),
        updatedAt: new Date(),
      })
      .where(and(
        eq(schema.flows.id, Number(id)),
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ))
      .returning();

    if (!result.length) {
      return res.status(404).json({ message: "Flow not found" });
    }

    return res.json(result[0]);
  } catch (error: any) {
    console.error("Error updating beta flow nodes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFlowBetaEdges1 = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    const { edges } = req.body;

    // Schema validation
    const schemaZ = z.object({
      edges: z.array(z.any()),
    });

    const validation = schemaZ.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.errors,
      });
    }

    const result = await storage.db.update(schema.flows)
      .set({
        edges: JSON.stringify(edges),
        updatedAt: new Date(),
      })
      .where(and(
        eq(schema.flows.id, Number(id)),
        eq(schema.flows.tenantId, tenantId),
        eq(schema.flows.isBeta, true)
      ))
      .returning();

    if (!result.length) {
      return res.status(404).json({ message: "Flow not found" });
    }

    return res.json(result[0]);
  } catch (error: any) {
    console.error("Error updating beta flow edges:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};