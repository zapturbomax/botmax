import { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }).max(50),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewFlowBeta() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Verificar se o token está configurado
      const authHeader = axios.defaults.headers.common['Authorization'];
      if (!authHeader) {
        console.log("Token não encontrado nos headers, reconfigurando...");
        const token = localStorage.getItem('flowbot_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          throw new Error("Sessão expirada. Por favor, faça login novamente.");
        }
      }
      
      console.log("Enviando requisição para criar fluxo beta:", data);
      const response = await axios.post('/api/flows-beta', data);
      console.log("Resposta da criação de fluxo beta:", response.data);

      toast({
        title: "Fluxo Beta criado com sucesso",
        description: `O fluxo "${data.name}" foi criado.`,
        variant: "default",
      });

      // Redirecionar para o construtor de fluxo com o novo ID
      setLocation(`/flow-builder-beta/${response.data.id}`);
    } catch (error) {
      console.error("Erro ao criar fluxo beta:", error);
      let errorMessage = "Ocorreu um erro ao criar o fluxo.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;
          console.error("Detalhes do erro:", error.response.data);
        } else if (error.request) {
          errorMessage = "Servidor não respondeu. Verifique sua conexão.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao criar fluxo",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Se o usuário não estiver autenticado, redirecionamos para login
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Novo Fluxo Beta</CardTitle>
          <CardDescription>Crie um novo fluxo de conversa para testar na versão Beta.</CardDescription>
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
                      <Input placeholder="Ex: Atendimento Comercial" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este nome será exibido na lista de fluxos.
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
                      <Input placeholder="Descreva o propósito deste fluxo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Uma breve descrição sobre o que este fluxo faz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setLocation('/flows-beta')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Fluxo"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}