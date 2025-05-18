import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ChartGantt, ArrowRight } from 'lucide-react';

// Form schema
const flowSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

export default function NewFlow() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
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
      const res = await apiRequest('POST', '/api/flows', data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Fluxo criado',
        description: 'Novo fluxo foi criado com sucesso. Redirecionando para o editor...',
      });
      // Redirect to flow editor
      setLocation(`/flows/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Falha na criação',
        description: error.message || 'Falha ao criar fluxo. Por favor tente novamente.',
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof flowSchema>) => {
    createFlowMutation.mutate(data);
  };
  
  // Template selection
  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Bot',
      description: 'Greet new users and collect basic information',
      icon: <ChartGantt className="h-6 w-6 text-blue-500" />,
    },
    {
      id: 'support',
      name: 'Support Bot',
      description: 'Handle common support requests and route to human agents when needed',
      icon: <ChartGantt className="h-6 w-6 text-green-500" />,
    },
    {
      id: 'sales',
      name: 'Sales Bot',
      description: 'Qualify leads and answer product questions',
      icon: <ChartGantt className="h-6 w-6 text-purple-500" />,
    },
  ];
  
  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    form.setValue('name', template.name);
    form.setValue('description', template.description);
  };
  
  return (
    <AppLayout title="Criar Novo Fluxo">
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar Novo Fluxo</CardTitle>
            <CardDescription>
              Configure os detalhes básicos para seu novo fluxo de conversação do WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Fluxo</FormLabel>
                      <FormControl>
                        <Input placeholder="Fluxo de Boas-vindas" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um nome claro para identificar este fluxo no seu painel.
                      </FormDescription>
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
                        <Textarea 
                          placeholder="Descreva o que este fluxo faz ou qual é o seu propósito..." 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Uma breve descrição do que este fluxo faz ou qual é o seu propósito.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Comece com um Modelo (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                        onClick={() => selectTemplate(template.id)}
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                            {template.icon}
                          </div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {template.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/flows')}
            >
              Cancelar
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={createFlowMutation.isPending}
              className="gap-1"
            >
              {createFlowMutation.isPending ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Criando...
                </span>
              ) : (
                <>
                  Criar e Abrir Construtor
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
