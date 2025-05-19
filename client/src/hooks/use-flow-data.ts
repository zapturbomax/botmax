import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Flow } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

/**
 * Hook para gerenciamento de dados do fluxo
 */
export function useFlowData(id?: string) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Consulta para obter dados do fluxo
  const { 
    data: flow, 
    isLoading, 
    error 
  } = useQuery<Flow>({
    queryKey: ['/api/flows', id],
    queryFn: () => apiRequest('GET', `/api/flows/${id}`).then(res => res.json()),
    enabled: !!id,
  });
  
  // Mutação para salvar o fluxo como rascunho
  const draftMutation = useMutation({
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
  
  // Redirecionar se o fluxo não for encontrado
  if (error) {
    toast({
      title: "Fluxo não encontrado",
      description: "O fluxo solicitado não existe ou você não tem permissão para acessá-lo.",
      variant: "destructive",
    });
    setLocation('/flows');
  }
  
  // Handler para salvar o fluxo como rascunho
  const handleSaveDraft = () => {
    draftMutation.mutate();
  };
  
  // Handler para publicar o fluxo
  const handlePublish = () => {
    publishMutation.mutate();
  };
  
  return {
    flow,
    isLoading,
    error,
    handleSaveDraft,
    handlePublish,
    draftMutation,
    publishMutation
  };
}