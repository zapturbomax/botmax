import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useParams } from 'wouter';
import FlowBuilderComponent from '@/components/flow-builder/FlowBuilder';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function FlowBuilderPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Estado para controlar o carregamento e erros
  const [isLoading, setIsLoading] = useState(true);
  const [flow, setFlow] = useState(null);
  const [error, setError] = useState(null);
  
  // Carregar dados do fluxo
  useEffect(() => {
    if (!id || !user) return;
    
    const fetchFlow = async () => {
      setIsLoading(true);
      try {
        // Garantir que o token está nos headers
        const token = localStorage.getItem('flowbot_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        console.log(`Carregando fluxo id=${id} para usuário ${user.username}`);
        const response = await axios.get(`/api/flows/${id}`);
        console.log("Dados do fluxo carregados:", response.data);
        
        if (!response.data) {
          throw new Error("API retornou resposta vazia");
        }
        
        // Processar os dados recebidos
        const flowData = response.data;
        setFlow(flowData);
      } catch (err) {
        console.error("Erro ao carregar fluxo:", err);
        setError(err);
        
        // Mostrar mensagem de erro para o usuário
        toast({
          title: "Erro ao carregar fluxo",
          description: err instanceof Error ? err.message : "Erro desconhecido",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlow();
  }, [id, user, toast]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation('/login?redirect=' + encodeURIComponent(location));
    }
  }, [user, isAuthLoading, location, setLocation]);
  
  // Redirect if flow not found
  useEffect(() => {
    if (!isLoading && error) {
      console.error("Flow not found or error:", error);
      
      // Aguardar um momento antes de redirecionar
      const timer = setTimeout(() => {
        setLocation('/flows');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, setLocation]);
  
  // Debugging logs
  useEffect(() => {
    if (flow) {
      console.log("Flow data carregado:", flow);
      console.log("Flow ID:", id);
    }
  }, [flow, id]);
  
  if (isAuthLoading || !user) {
    return null; // Don't render anything while checking auth
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="ml-2">Carregando fluxo...</p>
      </div>
    );
  }
  
  if (!flow) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Fluxo não encontrado</h1>
        <p className="mb-4">O fluxo que você está tentando acessar não existe ou você não tem permissão para visualizá-lo.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => setLocation('/flows')}
        >
          Voltar para fluxos
        </button>
      </div>
    );
  }

  return <FlowBuilderComponent flow={flow} flowId={id} />;
}
