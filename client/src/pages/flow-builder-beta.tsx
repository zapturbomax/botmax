import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import BetaFlowCanvas from '@/components/flow-builder-beta/BetaFlowCanvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
// Importamos o componente NodePanel
const NodePanel = React.lazy(() => import('@/components/flow-builder-beta/NodePanel'));

/**
 * FlowBuilderBeta Page - Nova implementação do Flow Builder
 * Com design moderno e funcionalidades aprimoradas
 */
const FlowBuilderBeta = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Consulta para buscar o fluxo pelo ID
  const { data: flow, isLoading, error } = useQuery({
    queryKey: ['/api/flows', id],
    queryFn: getFlowById,
    enabled: !!id,
  });

  // Função para buscar o fluxo pelo ID
  async function getFlowById() {
    if (!id) return null;
    const res = await apiRequest('GET', `/api/flows/${id}`);
    return await res.json();
  }

  // Mutation para salvar o fluxo
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PATCH', `/api/flows/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows', id] });
      toast({
        title: 'Fluxo salvo',
        description: 'Seu fluxo foi salvo com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation para publicar o fluxo
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('PATCH', `/api/flows/${id}/status`, { status: 'published' });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows', id] });
      toast({
        title: 'Fluxo publicado',
        description: 'Seu fluxo foi publicado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao publicar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Manipulador para salvar o fluxo como rascunho
  const handleSaveDraft = () => {
    setIsSaving(true);
    // Aqui você deve coletar os dados do canvas
    const canvasData = {
      nodes: [], // Obter os nós do canvas
      edges: [], // Obter as arestas do canvas
    };
    
    saveMutation.mutate({ ...canvasData, status: 'draft' });
    setIsSaving(false);
  };

  // Manipulador para publicar o fluxo
  const handlePublish = () => {
    setIsSaving(true);
    // Primeiro salva o fluxo
    const canvasData = {
      nodes: [], // Obter os nós do canvas
      edges: [], // Obter as arestas do canvas
    };
    
    saveMutation.mutate({ ...canvasData, status: 'draft' }, {
      onSuccess: () => {
        // Depois publica
        publishMutation.mutate();
        setIsSaving(false);
      },
      onError: () => {
        setIsSaving(false);
      }
    });
  };

  // Mostra uma mensagem de carregamento enquanto busca o fluxo
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Mostra uma mensagem de erro caso ocorra algum problema
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao carregar o fluxo</h2>
        <p className="text-gray-600 mb-6">{(error as Error).message}</p>
        <Button onClick={() => navigate('/flows')}>Voltar para a lista de fluxos</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Painel lateral esquerdo com os nós disponíveis */}
      <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <NodePanel />
      </div>
      
      {/* Canvas principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <BetaFlowCanvas 
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default FlowBuilderBeta;