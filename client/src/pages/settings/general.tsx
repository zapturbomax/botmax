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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

// Form schema
const tenantFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subdomain: z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
});

export default function GeneralSettings() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get tenant
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['/api/tenant'],
  });
  
  // Initialize form
  const form = useForm<z.infer<typeof tenantFormSchema>>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      subdomain: '',
    },
    values: tenant ? {
      name: tenant.name,
      subdomain: tenant.subdomain,
    } : undefined,
  });
  
  // Update tenant mutation
  const updateTenantMutation = useMutation({
    mutationFn: async (data: z.infer<typeof tenantFormSchema>) => {
      const res = await apiRequest('PUT', '/api/tenant', data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenant'] });
      toast({
        title: 'Settings updated',
        description: 'Your general settings have been updated successfully.',
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: z.infer<typeof tenantFormSchema>) => {
    updateTenantMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <AppLayout title="General Settings">
        <div className="container max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout title="General Settings">
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Tenant Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your organization's basic information and subdomain.
            </p>
          </div>
          
          <Separator />
          
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                How your organization appears across the platform.
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
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing} 
                            placeholder="Your Organization" 
                          />
                        </FormControl>
                        <FormDescription>
                          This is the name that will be displayed throughout the platform.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subdomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subdomain</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input 
                              {...field} 
                              disabled={!isEditing} 
                              placeholder="your-org" 
                              className="rounded-r-none"
                            />
                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-md text-gray-500 dark:text-gray-400">
                              .flowbot.io
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your WhatsApp webhook URL will be https://{field.value || 'your-org'}.flowbot.io/webhook
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button type="submit" disabled={updateTenantMutation.isPending}>
                        {updateTenantMutation.isPending ? (
                          <span className="flex items-center">
                            <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                            Saving...
                          </span>
                        ) : 'Save Changes'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Settings
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
