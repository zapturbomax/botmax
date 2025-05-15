import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AppLayout from '@/components/layout/AppLayout';
import NodePalette from './NodePalette';
import FlowCanvas from './FlowCanvas';
import { FlowNode, FlowEdge, Flow } from '@shared/schema';
import { useFlowBuilder } from '@/hooks/use-flow-builder';

interface FlowBuilderProps {
  flow?: Flow;
  flowId?: string;
}

export default function FlowBuilder({ flow, flowId }: FlowBuilderProps) {
  const { toast } = useToast();
  const { nodes, edges, setNodes, setEdges, selectedNode, setSelectedNode, getSerializableFlow } = useFlowBuilder();
  
  // Initialize flow data
  useEffect(() => {
    if (flow && flow.nodes && flow.edges) {
      try {
        // Process nodes: convert to ReactFlow format if needed
        const processedNodes = Array.isArray(flow.nodes) ? flow.nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data || {},
        })) : [];
        
        // Process edges: convert to ReactFlow format if needed
        const processedEdges = Array.isArray(flow.edges) ? flow.edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: 'smoothstep',
          animated: true,
        })) : [];
        
        console.log("Setting nodes:", processedNodes);
        console.log("Setting edges:", processedEdges);
        
        setNodes(processedNodes);
        setEdges(processedEdges);
      } catch (error) {
        console.error("Error initializing flow data:", error);
        toast({
          title: 'Error',
          description: 'Failed to load flow data',
          variant: 'destructive',
        });
      }
    }
  }, [flow, setNodes, setEdges, toast]);
  
  // Save flow nodes mutation
  const saveNodesMutation = useMutation({
    mutationFn: async () => {
      if (!flowId) throw new Error("Flow ID is required");
      const { nodes } = getSerializableFlow();
      return await apiRequest('PUT', `/api/flows/${flowId}/nodes`, nodes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows', flowId] });
      toast({
        title: 'Success',
        description: 'Flow nodes saved successfully',
      });
    },
    onError: (error: any) => {
      console.error("Save nodes error:", error);
      toast({
        title: 'Error',
        description: `Failed to save nodes: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });
  
  // Save flow edges mutation
  const saveEdgesMutation = useMutation({
    mutationFn: async () => {
      if (!flowId) throw new Error("Flow ID is required");
      const { edges } = getSerializableFlow();
      return await apiRequest('PUT', `/api/flows/${flowId}/edges`, edges);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows', flowId] });
      toast({
        title: 'Success',
        description: 'Flow connections saved successfully',
      });
    },
    onError: (error: any) => {
      console.error("Save edges error:", error);
      toast({
        title: 'Error',
        description: `Failed to save connections: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });
  
  // Save draft
  const saveDraft = async () => {
    try {
      await saveNodesMutation.mutateAsync();
      await saveEdgesMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error('Error saving draft', error);
      return false;
    }
  };
  
  // Publish flow
  const publishFlowMutation = useMutation({
    mutationFn: async () => {
      if (!flowId) throw new Error("Flow ID is required");
      const success = await saveDraft();
      if (!success) throw new Error("Failed to save draft before publishing");
      return await apiRequest('PUT', `/api/flows/${flowId}/status`, { status: 'published' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows', flowId] });
      toast({
        title: 'Success',
        description: 'Flow published successfully',
      });
    },
    onError: (error: any) => {
      console.error("Publish flow error:", error);
      toast({
        title: 'Error',
        description: `Failed to publish flow: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });
  
  const isSaving = saveNodesMutation.isPending || saveEdgesMutation.isPending || publishFlowMutation.isPending;
  
  return (
    <AppLayout title={flow?.name || 'Flow Builder'} showHeaderActions>
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <NodePalette />
        
        {/* Canvas Area */}
        <FlowCanvas
          onSaveDraft={saveDraft}
          onPublish={() => publishFlowMutation.mutate()}
          onNodeSelect={setSelectedNode}
          isSaving={isSaving}
        />
      </div>
    </AppLayout>
  );
}
