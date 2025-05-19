import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Trash2, Edit, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

type Flow = {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
};

export default function FlowsBeta() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [flowToDelete, setFlowToDelete] = useState<Flow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Consulta para obter a lista de fluxos Beta
  const { data: flows, isLoading, error, refetch } = useQuery({
    queryKey: ['flows-beta'],
    queryFn: async () => {
      const response = await axios.get<Flow[]>('/api/flows-beta');
      console.log("Fluxos Beta recebidos:", response.data);
      return response.data;
    },
    enabled: !!user,
  });

  // Monitorar erros na consulta
  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar fluxos beta:", error);
      toast({
        title: "Erro ao carregar fluxos",
        description: "Não foi possível carregar a lista de fluxos beta.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const confirmDelete = async () => {
    if (!flowToDelete) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`/api/flows-beta/${flowToDelete.id}`);
      toast({
        title: "Fluxo excluído",
        description: `O fluxo "${flowToDelete.name}" foi excluído com sucesso.`,
      });
      refetch(); // Atualizar a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir fluxo:", error);
      toast({
        title: "Erro ao excluir fluxo",
        description: "Não foi possível excluir o fluxo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setFlowToDelete(null);
    }
  };

  // Se estiver carregando, mostrar skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Fluxos Beta</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fluxos Beta</h1>
        <Button onClick={() => setLocation('/flows-beta/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Fluxo Beta
        </Button>
      </div>

      {/* Mensagem quando não há fluxos */}
      {flows && flows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum fluxo Beta encontrado</CardTitle>
            <CardDescription>
              Você ainda não criou nenhum fluxo na versão Beta. Crie seu primeiro fluxo para começar.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation('/flows-beta/new')}>
              <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Fluxo Beta
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Seus Fluxos Beta</CardTitle>
            <CardDescription>
              Gerencie seus fluxos de conversação na versão Beta do construtor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flows && flows.map((flow) => (
                  <TableRow key={flow.id}>
                    <TableCell className="font-medium">{flow.name}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        flow.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {flow.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(flow.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(flow.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setLocation(`/flow-builder-beta/${flow.id}`)}
                          title="Editar fluxo"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => setFlowToDelete(flow)}
                          title="Excluir fluxo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!flowToDelete} onOpenChange={(open) => !open && setFlowToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o fluxo "{flowToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlowToDelete(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}