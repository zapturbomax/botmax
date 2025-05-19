import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Flow } from '@shared/schema';
import { Toaster } from '@/components/ui/toaster';

import NewCanvas from '@/components/flow-builder/NewCanvas';
import VisualNodeSettings from '@/components/flow-builder/VisualNodeSettings';
import FlowControllerProvider from '@/contexts/FlowControllerContext';
import PageHeader from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Send, Save } from 'lucide-react';

export default function FlowDetails() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const { data: flow, isLoading, error } = useQuery<Flow>({
    queryKey: ['/api/flows', id],
    queryFn: () => apiRequest('GET', `/api/flows/${id}`).then(res => res.json()),
    enabled: !!id,
  });
  
  // Mutação para salvar o fluxo como rascunho
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('PUT', `/api/flows/${id}/status`, { status: 'draft' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flows', id] });
      toast({
        title: "Rascunho salvo",
        description: "Seu fluxo foi salvo como rascunho com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o rascunho.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para publicar o fluxo
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('PUT', `/api/flows/${id}/status`, { status: 'published' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flows', id] });
      toast({
        title: "Fluxo publicado",
        description: "Seu fluxo foi publicado com sucesso e já está ativo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao publicar",
        description: error.message || "Ocorreu um erro ao publicar o fluxo.",
        variant: "destructive",
      });
    },
  });
  
  // Redirecionar para a lista de fluxos se o fluxo não for encontrado
  useEffect(() => {
    if (error) {
      toast({
        title: "Fluxo não encontrado",
        description: "O fluxo solicitado não existe ou você não tem permissão para acessá-lo.",
        variant: "destructive",
      });
      setLocation('/flows');
    }
  }, [error, setLocation, toast]);
  
  // Handler para selecionar um nó
  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
  };
  
  // Handler para salvar o fluxo como rascunho
  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };
  
  // Handler para publicar o fluxo
  const handlePublish = () => {
    publishMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-[70vh] w-full rounded-lg" />
      </div>
    );
  }
  
  return (
    <FlowControllerProvider flowId={id}>
      <div className="container h-[calc(100vh-64px)] py-4 max-w-7xl mx-auto flex flex-col">
        <PageHeader
          title={flow?.name || "Flow Builder"}
          description={flow?.description || "Visual flow builder for WhatsApp communications"}
          backUrl="/flows"
          backText="Back to Flows"
        />
        
        <div className="flex-1 mt-4 min-h-0 flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex-1 min-w-0">
            <NewCanvas
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onNodeSelect={handleNodeSelect}
              isSaving={saveDraftMutation.isPending || publishMutation.isPending}
            />
          </div>
          
          {selectedNode && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-auto">
              <VisualNodeSettings 
                node={selectedNode} 
                onClose={() => setSelectedNode(null)} 
              />
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </FlowControllerProvider>
  );
}