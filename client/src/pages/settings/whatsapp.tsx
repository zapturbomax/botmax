import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, AlertCircle, MessageSquare, Link, Copy, Info, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Form schema
const whatsappIntegrationSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  phoneNumber: z.string().min(10, 'Digite um número de telefone válido'),
  apiKey: z.string().min(5, 'A chave de API é obrigatória'),
  apiSecret: z.string().min(5, 'O segredo da API é obrigatório'),
});

export default function WhatsAppSettings() {
  const { toast } = useToast();
  const [isAddingIntegration, setIsAddingIntegration] = useState(false);
  const [isEditingIntegration, setIsEditingIntegration] = useState<number | null>(null);
  const [integrationToDelete, setIntegrationToDelete] = useState<number | null>(null);
  
  // Get WhatsApp integrations
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['/api/whatsapp'],
  });
  
  // Get current plan
  const { data: plan } = useQuery({
    queryKey: ['/api/subscription/current'],
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof whatsappIntegrationSchema>>({
    resolver: zodResolver(whatsappIntegrationSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      apiKey: '',
      apiSecret: '',
    },
  });
  
  // Create integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof whatsappIntegrationSchema>) => {
      const res = await apiRequest('POST', '/api/whatsapp', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp'] });
      toast({
        title: 'Integração criada',
        description: 'Integração do WhatsApp foi criada com sucesso.',
      });
      setIsAddingIntegration(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Falha na criação',
        description: error.message || 'Falha ao criar integração do WhatsApp. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
  
  // Update integration mutation
  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof whatsappIntegrationSchema> }) => {
      const res = await apiRequest('PUT', `/api/whatsapp/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp'] });
      toast({
        title: 'Integração atualizada',
        description: 'Integração do WhatsApp foi atualizada com sucesso.',
      });
      setIsEditingIntegration(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Falha na atualização',
        description: error.message || 'Falha ao atualizar integração do WhatsApp. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
  
  // Delete integration mutation
  const deleteIntegrationMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/whatsapp/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp'] });
      toast({
        title: 'Integração excluída',
        description: 'Integração do WhatsApp foi excluída com sucesso.',
      });
      setIntegrationToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Falha na exclusão',
        description: error.message || 'Falha ao excluir integração do WhatsApp. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
  
  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const res = await apiRequest('PUT', `/api/whatsapp/${id}`, { active });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp'] });
      toast({
        title: 'Status atualizado',
        description: 'Status da integração do WhatsApp foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Falha na atualização',
        description: error.message || 'Falha ao atualizar status da integração. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof whatsappIntegrationSchema>) => {
    if (isEditingIntegration !== null) {
      updateIntegrationMutation.mutate({ id: isEditingIntegration, data });
    } else {
      createIntegrationMutation.mutate(data);
    }
  };
  
  // Edit integration
  const handleEdit = (integration: any) => {
    form.reset({
      name: integration.name,
      phoneNumber: integration.phoneNumber,
      apiKey: integration.apiKey,
      apiSecret: integration.apiSecret,
    });
    setIsEditingIntegration(integration.id);
  };
  
  // Handle close dialog
  const handleCloseDialog = () => {
    form.reset();
    setIsAddingIntegration(false);
    setIsEditingIntegration(null);
  };
  
  // Copy webhook URL
  const copyWebhookUrl = (webhookUrl: string) => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: 'Copied!',
      description: 'Webhook URL copied to clipboard.',
    });
  };
  
  // Check if the user can add more integrations
  const canAddIntegration = 
    !plan || 
    !integrations || 
    integrations.length < plan.maxWhatsappIntegrations;
  
  return (
    <AppLayout title="Integração WhatsApp">
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Integrações WhatsApp</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conecte suas contas de API do WhatsApp Business para usar com seus fluxos.
            </p>
          </div>
          
          <Separator />
          
          {/* WhatsApp Integration Guide */}
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>Começando com a Integração do WhatsApp</AlertTitle>
            <AlertDescription>
              <p className="text-sm mt-1">
                Para integrar o WhatsApp com o FlowBot, você precisará:
              </p>
              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                <li>Ter uma Conta WhatsApp Business aprovada</li>
                <li>Criar um aplicativo no Portal de Desenvolvedores da Meta</li>
                <li>Configurar um Usuário do Sistema Empresarial e obter credenciais de API</li>
                <li>Configurar a URL do webhook mostrada nas configurações de integração abaixo</li>
              </ol>
              <a 
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm inline-flex items-center mt-2"
              >
                <Link className="h-3 w-3 mr-1" />
                Ver documentação oficial do Facebook
              </a>
            </AlertDescription>
          </Alert>
          
          {/* WhatsApp Integrations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Suas Integrações</h4>
              <Dialog open={isAddingIntegration} onOpenChange={setIsAddingIntegration}>
                <DialogTrigger asChild>
                  <Button 
                    disabled={!canAddIntegration} 
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Integração
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Integração WhatsApp</DialogTitle>
                    <DialogDescription>
                      Digite os detalhes da API do WhatsApp Business para configurar a integração.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Integração</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Bot de Suporte" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Um nome amigável para identificar esta integração.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Telefone WhatsApp</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+5511999999999" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              O número de telefone associado à sua conta WhatsApp Business.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chave de API</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Chave da API WhatsApp Business" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              A chave de API da sua conta WhatsApp Business API.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="apiSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Segredo da API</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Segredo da API WhatsApp Business" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              O segredo da API da sua conta WhatsApp Business API.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createIntegrationMutation.isPending}
                    >
                      {createIntegrationMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                          Salvando...
                        </span>
                      ) : 'Salvar Integração'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isEditingIntegration !== null} onOpenChange={(open) => !open && setIsEditingIntegration(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit WhatsApp Integration</DialogTitle>
                    <DialogDescription>
                      Update your WhatsApp Business API details.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Integration Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Support Bot" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+1234567890" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="WhatsApp Business API Key" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="apiSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Secret</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="WhatsApp Business API Secret" 
                                type="password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={updateIntegrationMutation.isPending}
                    >
                      {updateIntegrationMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                          Updating...
                        </span>
                      ) : 'Update Integration'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
              </div>
            ) : integrations && integrations.length > 0 ? (
              <div className="space-y-4">
                {integrations.map((integration: any) => (
                  <Card key={integration.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium">{integration.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {integration.phoneNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Active
                            </span>
                            <Switch
                              checked={integration.active}
                              onCheckedChange={(checked) => 
                                toggleActiveMutation.mutate({ 
                                  id: integration.id, 
                                  active: checked 
                                })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(integration)}
                              className="h-8 px-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden md:inline ml-1">Edit</span>
                            </Button>
                            
                            <AlertDialog
                              open={integrationToDelete === integration.id}
                              onOpenChange={(open) => !open && setIntegrationToDelete(null)}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
                                  onClick={() => setIntegrationToDelete(integration.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden md:inline ml-1">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Integration</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this WhatsApp integration? 
                                    This action cannot be undone and will affect any flows using this integration.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => deleteIntegrationMutation.mutate(integration.id)}
                                    disabled={deleteIntegrationMutation.isPending}
                                  >
                                    {deleteIntegrationMutation.isPending ? (
                                      <span className="flex items-center">
                                        <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                                        Deleting...
                                      </span>
                                    ) : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                      
                      {/* Webhook URL */}
                      <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Webhook URL (use this in your Meta Developer Portal):
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded flex-1 overflow-x-auto">
                            {integration.webhookUrl}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyWebhookUrl(integration.webhookUrl)}
                            className="h-7 px-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Integrations Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    You haven't added any WhatsApp integrations. Add your first integration to start building WhatsApp chatbots.
                  </p>
                  <Button 
                    disabled={!canAddIntegration} 
                    onClick={() => setIsAddingIntegration(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Integration
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Integration Limit Warning */}
            {plan && integrations && integrations.length >= plan.maxWhatsappIntegrations && (
              <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle>Integration Limit Reached</AlertTitle>
                <AlertDescription>
                  <p className="text-sm mt-1">
                    You've reached the maximum number of WhatsApp integrations ({plan.maxWhatsappIntegrations}) 
                    allowed on your current plan.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2 text-amber-600 border-amber-300 hover:bg-amber-50"
                    size="sm"
                    onClick={() => window.location.href = '/settings/billing'}
                  >
                    Upgrade Plan
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Setup Guide Card */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Guide</CardTitle>
              <CardDescription>
                Follow these steps to complete your WhatsApp integration setup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex">
                  <Badge className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5">1</Badge>
                  <div>
                    <h4 className="text-sm font-medium">Add your integration details</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Create a new integration with your WhatsApp Business API credentials.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <Badge className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5">2</Badge>
                  <div>
                    <h4 className="text-sm font-medium">Configure webhook in Meta Developer Portal</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Copy the webhook URL from your integration and configure it in your Meta Developer Portal.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <Badge className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5">3</Badge>
                  <div>
                    <h4 className="text-sm font-medium">Set up message templates</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Submit and approve message templates in the Meta Developer Portal to enable the first outbound message capability.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <Badge className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5">4</Badge>
                  <div>
                    <h4 className="text-sm font-medium">Build your first flow</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Create a flow using the Flow Builder and link it to your WhatsApp integration.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open('https://developers.facebook.com/docs/whatsapp/cloud-api/get-started', '_blank')}>
                View Detailed Documentation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
