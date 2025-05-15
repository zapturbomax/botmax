import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import AppLayout from '@/components/layout/AppLayout';
import NodePalette from './NodePalette';
import FlowCanvas from './FlowCanvas';
import PropertiesPanel from './PropertiesPanel';
import { FlowNode, FlowEdge } from '@shared/schema';
import { useFlowBuilder } from '@/hooks/use-flow-builder';

export default function FlowBuilder() {
  const { id } = useParams();
  const { toast } = useToast();
  const { nodes, edges, setNodes, setEdges, selectedNode, setSelectedNode } = useFlowBuilder();
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);

  // Fetch flow data
  const { data: flow, isLoading } = useQuery({
    queryKey: [`/api/flows/${id}`],
    enabled: !!id,
  });
  
  // Initialize flow data
  useEffect(() => {
    if (flow) {
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  }, [flow, setNodes, setEdges]);
  
  // Save flow nodes mutation
  const saveNodesMutation = useMutation({
    mutationFn: async (nodes: FlowNode[]) => {
      return apiRequest('PUT', `/api/flows/${id}/nodes`, nodes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/flows/${id}`] });
      toast({
        title: 'Success',
        description: 'Flow nodes saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save nodes: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Save flow edges mutation
  const saveEdgesMutation = useMutation({
    mutationFn: async (edges: FlowEdge[]) => {
      return apiRequest('PUT', `/api/flows/${id}/edges`, edges);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/flows/${id}`] });
      toast({
        title: 'Success',
        description: 'Flow connections saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save connections: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Save draft
  const saveDraft = async () => {
    try {
      await saveNodesMutation.mutateAsync(nodes);
      await saveEdgesMutation.mutateAsync(edges);
    } catch (error) {
      console.error('Error saving draft', error);
    }
  };
  
  // Publish flow
  const publishFlowMutation = useMutation({
    mutationFn: async () => {
      await saveDraft();
      return apiRequest('PUT', `/api/flows/${id}/status`, { status: 'published' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/flows/${id}`] });
      toast({
        title: 'Success',
        description: 'Flow published successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to publish flow: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  if (isLoading) {
    return (
      <AppLayout title="Loading Flow..." showHeaderActions>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
        </div>
      </AppLayout>
    );
  }
  
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
          isSaving={saveNodesMutation.isPending || saveEdgesMutation.isPending || publishFlowMutation.isPending}
        />
        
        {/* Properties Panel */}
        {selectedNode && (
          <PropertiesPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            open={propertiesPanelOpen}
            onToggle={() => setPropertiesPanelOpen(!propertiesPanelOpen)}
          />
        )}
      </div>
    </AppLayout>
  );
}
