import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { 
  Plus, 
  Search, 
  ChartGantt, 
  CheckCircle, 
  Clock, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Form schema
const flowSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export default function Flows({ isBeta = false }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<number | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState<number | null>(null);
  
  // Get flows (standard or beta)
  const endpoint = isBeta ? '/api/flows-beta' : '/api/flows';
  const { data: flows, isLoading } = useQuery({
    queryKey: [endpoint],
  });
  
  // Get current plan
  const { data: plan } = useQuery({
    queryKey: ['/api/subscription/current'],
    enabled: !!user,
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof flowSchema>>({
    resolver: zodResolver(flowSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  
  // Create flow mutation
  const createFlowMutation = useMutation({
    mutationFn: async (data: z.infer<typeof flowSchema>) => {
      const endpoint = isBeta ? '/api/flows-beta' : '/api/flows';
      const res = await apiRequest('POST', endpoint, data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows'] });
      toast({
        title: 'Flow created',
        description: 'New flow has been created successfully.',
      });
      // Redirecionar para o fluxo padrão ou fluxo Beta conforme necessário
      window.location.href = isBeta ? `/flow-builder-beta/${data.id}` : `/flows/${data.id}`;
    },
    onError: (error) => {
      toast({
        title: 'Creation failed',
        description: error.message || 'Failed to create flow. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Delete flow mutation
  const deleteFlowMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/flows/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows'] });
      toast({
        title: 'Flow deleted',
        description: 'Flow has been deleted successfully.',
      });
      setShowDeleteDialog(null);
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete flow. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Duplicate flow mutation
  const duplicateFlowMutation = useMutation({
    mutationFn: async (id: number) => {
      const flow = flows.find((f: any) => f.id === id);
      if (!flow) throw new Error('Flow not found');
      
      const newFlow = {
        name: `${flow.name} (Copy)`,
        description: flow.description,
        tenantId: flow.tenantId,
      };
      
      const res = await apiRequest('POST', '/api/flows', newFlow);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows'] });
      toast({
        title: 'Flow duplicated',
        description: 'Flow has been duplicated successfully.',
      });
      setShowDuplicateDialog(null);
    },
    onError: (error) => {
      toast({
        title: 'Duplication failed',
        description: error.message || 'Failed to duplicate flow. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Toggle flow status mutation
  const toggleFlowStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'draft' | 'published' }) => {
      const res = await apiRequest('PUT', `/api/flows/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flows'] });
      toast({
        title: 'Status updated',
        description: 'Flow status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update flow status. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof flowSchema>) => {
    createFlowMutation.mutate(data);
  };
  
  // Filter flows by search term
  const filteredFlows = flows
    ? flows.filter((flow: any) => 
        flow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (flow.description && flow.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
  
  // Check if the user can create more flows
  const canCreateFlow = 
    !plan || 
    !flows || 
    flows.filter((f: any) => f.status === 'published').length < plan.maxFlows;
  
  return (
    <AppLayout title="Fluxos">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Seus Fluxos
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gerencie e crie seus fluxos de conversação do WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input 
                type="text" 
                placeholder="Buscar fluxos..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={!canCreateFlow} className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Criar Fluxo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Fluxo</DialogTitle>
                  <DialogDescription>
                    Dê um nome ao seu fluxo e uma descrição opcional.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Fluxo de Boas-vindas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Saudação inicial para novos usuários" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={createFlowMutation.isPending}
                  >
                    {createFlowMutation.isPending ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                        Criando...
                      </span>
                    ) : 'Criar Fluxo'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
          </div>
        ) : flows && flows.length > 0 ? (
          <>
            {flows.length > 0 && searchTerm && filteredFlows.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum fluxo correspondente encontrado</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Tente um termo de busca diferente ou limpe a busca para ver todos os fluxos.
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar Busca
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFlows.map((flow: any) => (
                  <Card key={flow.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {flow.name}
                            {flow.status === 'published' ? (
                              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                <CheckCircle size={10} className="mr-1" />
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs px-2 py-1 rounded-full flex items-center">
                                <Clock size={10} className="mr-1" />
                                Rascunho
                              </Badge>
                            )}
                          </CardTitle>
                          {flow.description && (
                            <CardDescription className="mt-1 line-clamp-2">
                              {flow.description}
                            </CardDescription>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => window.location.href = `/flows/${flow.id}`}
                              className="flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setShowDuplicateDialog(flow.id)}
                              className="flex items-center"
                              disabled={!canCreateFlow}
                            >
                              <Copy className="h-4 w-4 mr-2" /> Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {flow.status === 'published' ? (
                              <DropdownMenuItem
                                onClick={() => toggleFlowStatusMutation.mutate({ id: flow.id, status: 'draft' })}
                                className="flex items-center text-amber-500 hover:text-amber-600 focus:text-amber-600"
                              >
                                <Clock className="h-4 w-4 mr-2" /> Definir como Rascunho
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => toggleFlowStatusMutation.mutate({ id: flow.id, status: 'published' })}
                                className="flex items-center text-green-500 hover:text-green-600 focus:text-green-600"
                                disabled={!canCreateFlow && flow.status !== 'published'}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" /> Publicar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setShowDeleteDialog(flow.id)}
                              className="flex items-center text-red-500 hover:text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 flex-1">
                      <div className="flex text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <ChartGantt className="h-4 w-4 mr-1" />
                          <span>{(flow.nodes?.length || 0)} Nós</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <div className="w-full flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Última atualização: {new Date(flow.updatedAt).toLocaleDateString()}
                        </span>
                        <Link href={`/flows/${flow.id}`}>
                          <Button variant="ghost" size="sm">
                            Abrir
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                
                {canCreateFlow && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="h-full cursor-pointer border-dashed hover:border-primary hover:bg-primary/5 transition-colors">
                        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
                          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Criar Novo Fluxo</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Construa um novo fluxo de conversação para WhatsApp
                          </p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Novo Fluxo</DialogTitle>
                        <DialogDescription>
                          Dê um nome ao seu fluxo e uma descrição opcional.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input placeholder="Fluxo de Boas-vindas" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Descrição (Opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Saudação inicial para novos usuários" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={createFlowMutation.isPending}
                        >
                          {createFlowMutation.isPending ? (
                            <span className="flex items-center">
                              <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                              Criando...
                            </span>
                          ) : 'Criar Fluxo'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <ChartGantt className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhum Fluxo Ainda</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                Você ainda não criou nenhum fluxo. Comece criando seu primeiro fluxo de conversação do WhatsApp.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Criar Seu Primeiro Fluxo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Fluxo</DialogTitle>
                    <DialogDescription>
                      Dê um nome ao seu fluxo e uma descrição opcional.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Fluxo de Boas-vindas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição (Opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Saudação inicial para novos usuários" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createFlowMutation.isPending}
                    >
                      {createFlowMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                          Criando...
                        </span>
                      ) : 'Criar Fluxo'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
        
        {/* Plan Limit Warning */}
        {plan && flows && flows.filter((f: any) => f.status === 'published').length >= plan.maxFlows && (
          <div className="mt-6">
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Flow Limit Reached</AlertTitle>
              <AlertDescription>
                <p className="text-sm mt-1">
                  You've reached the maximum number of active flows ({plan.maxFlows}) 
                  allowed on your current plan.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    className="text-amber-600 border-amber-300 hover:bg-amber-50"
                    size="sm"
                    onClick={() => window.location.href = '/settings/billing'}
                  >
                    Upgrade Plan
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-600"
                  >
                    Set a flow to draft
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      
      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog !== null} onOpenChange={(open) => !open && setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flow</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your flow and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteFlowMutation.mutate(showDeleteDialog!)}
              disabled={deleteFlowMutation.isPending}
            >
              {deleteFlowMutation.isPending ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Deleting...
                </span>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Duplicate Dialog */}
      <AlertDialog open={showDuplicateDialog !== null} onOpenChange={(open) => !open && setShowDuplicateDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Flow</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of the flow including all nodes and connections. The new flow will be set to draft mode.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => duplicateFlowMutation.mutate(showDuplicateDialog!)}
              disabled={duplicateFlowMutation.isPending}
            >
              {duplicateFlowMutation.isPending ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Duplicating...
                </span>
              ) : 'Duplicate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
