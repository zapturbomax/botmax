import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import FlowCanvas from '@/components/flow-builder-new/FlowCanvas';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';

/**
 * Página do Flow Builder com design baseado no Dispara.ai
 */
const FlowBuilderNew = () => {
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

  // Manipulador para salvar o fluxo
  const handleSave = () => {
    setIsSaving(true);
    // Aqui você deve coletar os dados do canvas
    const canvasData = {
      nodes: [], // Obter os nós do canvas
      edges: [], // Obter as arestas do canvas
    };
    
    saveMutation.mutate(canvasData, {
      onSettled: () => {
        setIsSaving(false);
      }
    });
  };

  // Manipulador para fechar o editor
  const handleClose = () => {
    navigate('/flows');
  };

  // Mostra uma mensagem de carregamento enquanto busca o fluxo
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#26C6B9] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Mostra uma mensagem de erro caso ocorra algum problema
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erro ao carregar o fluxo</h2>
        <p className="text-gray-600 mb-6">{(error as Error).message}</p>
        <button 
          className="px-4 py-2 bg-[#26C6B9] text-white rounded-md hover:bg-opacity-90"
          onClick={() => navigate('/flows')}
        >
          Voltar para a lista de fluxos
        </button>
      </div>
    );
  }

  return (
    <FlowCanvas 
      flowId={id}
      flowName={flow?.name || 'Novo Fluxo'}
      onSave={handleSave}
      onClose={handleClose}
    />
  );
};

export default FlowBuilderNew;