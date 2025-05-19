import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
  description: z.string().optional(),
});

export default function NewBetaFlow() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Create flow mutation
  const createFlowMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest('POST', '/api/flows-beta', data);
      return res.json();
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      toast({
        title: 'Fluxo criado',
        description: 'Novo fluxo foi criado com sucesso.',
      });
      window.location.href = `/flow-builder-beta/${data.id}`;
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o fluxo.',
        variant: 'destructive',
      });
    },
  });

  // Submit form
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    createFlowMutation.mutate(values);
  }

  return (
    <div className="container flex flex-col items-center justify-center py-10">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Fluxo Beta</h1>
      
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Informações do Fluxo</CardTitle>
              <CardDescription>
                Crie um novo fluxo no ambiente Beta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Fluxo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Atendimento Inteligente" {...field} />
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
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o propósito deste fluxo..."
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Criando...
                  </span>
                ) : (
                  <>
                    Criar e Abrir Construtor Beta
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}