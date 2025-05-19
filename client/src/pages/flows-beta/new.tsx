import React from 'react';
import { useLocation, useAuth } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome do fluxo deve ter pelo menos 3 caracteres",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewFlowBeta() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Form setup with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Create flow mutation
  const createFlowMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest('POST', '/api/flows-beta', values);
    },
    onSuccess: (data) => {
      console.log("Fluxo Beta criado com sucesso:", data);
      toast({
        title: 'Sucesso',
        description: 'Fluxo criado com sucesso',
      });
      navigate(`/flow-builder-beta/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Erro ao criar fluxo beta:", error);
      toast({
        title: 'Erro',
        description: `Falha ao criar fluxo: ${error.message || 'Erro desconhecido'}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    console.log("Enviando dados para criar fluxo beta:", values);
    createFlowMutation.mutate(values);
  };

  return (
    <AppLayout title="Novo Fluxo Beta">
      <div className="container mx-auto py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Fluxo Beta</CardTitle>
            <CardDescription>
              Crie um novo fluxo para começar a construção do seu chatbot no construtor beta.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Fluxo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Atendimento ao Cliente" {...field} />
                      </FormControl>
                      <FormDescription>
                        Um nome descritivo para identificar seu fluxo.
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
                      <FormLabel>Descrição (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Fluxo para gerenciar o primeiro contato com clientes" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Uma breve descrição do propósito deste fluxo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/flows')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={createFlowMutation.isPending}
                >
                  {createFlowMutation.isPending ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Criando...
                    </span>
                  ) : 'Criar Fluxo'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}