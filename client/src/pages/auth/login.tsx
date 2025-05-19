import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { ChartGantt, Eye, EyeOff } from 'lucide-react';

// Form schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      return await auth.login(data.email, data.password);
    },
    onSuccess: (data) => {
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta!',
      });
      
      // Add a short delay to ensure state is updated before redirecting
      setTimeout(() => {
        // Get redirect from URL or go to dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/dashboard';
        console.log("Redirecionando para:", redirect);
        setLocation(redirect);
      }, 500);
    },
    onError: (error) => {
      toast({
        title: 'Falha no login',
        description: error.message || 'Email ou senha inválidos',
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
            <ChartGantt size={24} />
          </div>
        </div>
        <h2 className="mt-5 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Entrar no BotMAX
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou{' '}
          <Link href="/register">
            <span className="font-medium text-primary hover:text-primary-600 cursor-pointer">
              criar uma nova conta
            </span>
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="voce@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex justify-end">
                        <Link href="/forgot-password">
                          <span className="text-sm text-primary hover:text-primary-600 cursor-pointer">
                            Esqueceu sua senha?
                          </span>
                        </Link>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Entrando...
                    </span>
                  ) : 'Entrar'}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <Link href="/register">
                <span className="font-medium text-primary hover:text-primary-600 cursor-pointer">
                  Cadastre-se
                </span>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
