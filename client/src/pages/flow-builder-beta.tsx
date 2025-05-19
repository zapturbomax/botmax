
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import FlowBuilderLayout from '@/components/flow-builder-beta/FlowBuilderLayout';
import { useToast } from '@/hooks/use-toast';

export default function FlowBuilderBeta() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  // Verificar se o usuário está autenticado antes de carregar o fluxo
  useEffect(() => {
    if (!isAuthLoading && !user) {
      console.log("Usuário não autenticado, redirecionando para login");
      setLocation('/login?redirect=' + encodeURIComponent(location));
    }
  }, [user, isAuthLoading, location, setLocation]);

  // Check flow exists and user has access (using Beta-specific endpoint)
  const { data: flow, isLoading, error, refetch } = useQuery({
    queryKey: ['flows-beta', id],
    queryFn: async () => {
      try {
        console.log(`Carregando fluxo beta id=${id} para tenantId=${user?.tenantId}`);
        const response = await axios.get(`/api/flows-beta/${id}`);
        console.log("Dados do fluxo beta carregados:", response.data);
        return response.data;
      } catch (err) {
        console.error("Erro ao carregar fluxo beta:", err);
        if (axios.isAxiosError(err) && err.response) {
          console.error("Detalhes do erro:", err.response.data);
          toast({
            title: "Erro ao carregar fluxo",
            description: err.response.data.message || "Não foi possível carregar o fluxo",
            variant: "destructive",
          });
        }
        throw err;
      }
    },
    enabled: !!id && !!user && !!user.tenantId,
    retry: 1,
  });

  // Tentar novamente caso falhe na primeira vez
  useEffect(() => {
    if (error && user && id) {
      console.log("Tentando carregar o fluxo novamente após erro");
      const timer = setTimeout(() => {
        refetch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, user, id, refetch]);

  // Redirect if flow not found after retries
  useEffect(() => {
    if (!isLoading && error) {
      console.error("Fluxo não encontrado ou erro persistente:", error);
      setLocation('/flows-beta');
    }
  }, [isLoading, error, setLocation]);

  if (isAuthLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="ml-2">Verificando autenticação...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="ml-2">Carregando fluxo...</p>
      </div>
    );
  }

  if (!flow && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Fluxo não encontrado</h2>
        <p className="mb-4">O fluxo que você está tentando acessar não existe ou você não tem permissão.</p>
        <Button onClick={() => setLocation('/flows-beta')}>
          Voltar para a lista de fluxos
        </Button>
      </div>
    );
  }

  return <FlowBuilderLayout flowId={id} flowName={flow?.name || 'Flow Builder Beta'} />;
}
