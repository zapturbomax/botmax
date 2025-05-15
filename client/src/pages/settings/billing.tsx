import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price / 100);
};

export default function BillingSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  
  // Check for success/canceled in URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get('success') === 'true';
    const isCanceled = searchParams.get('canceled') === 'true';
    
    if (isSuccess) {
      toast({
        title: 'Subscription updated',
        description: 'Your subscription has been updated successfully.',
      });
      // Remove query params from URL without refreshing the page
      window.history.replaceState({}, '', window.location.pathname);
    } else if (isCanceled) {
      toast({
        title: 'Subscription update canceled',
        description: 'You canceled the subscription update.',
        variant: 'destructive',
      });
      // Remove query params from URL without refreshing the page
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);
  
  // Get current plan
  const { data: currentPlan, isLoading: isLoadingCurrentPlan } = useQuery({
    queryKey: ['/api/subscription/current'],
    enabled: !!user,
  });
  
  // Get all plans
  const { data: availablePlans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['/api/plans'],
  });
  
  // Create checkout session mutation
  const createCheckoutSessionMutation = useMutation({
    mutationFn: async (planId: number) => {
      const res = await apiRequest('POST', '/api/subscription/checkout', { planId });
      return res.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: 'Checkout failed',
        description: error.message || 'Failed to create checkout session. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Create billing portal session mutation
  const createPortalSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/subscription/portal');
      return res.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe billing portal
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast({
        title: 'Portal failed',
        description: error.message || 'Failed to create billing portal session. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle subscription checkout
  const handleSubscribe = (planId: number) => {
    setSelectedPlanId(planId);
    createCheckoutSessionMutation.mutate(planId);
  };
  
  // Handle billing portal
  const handleBillingPortal = () => {
    createPortalSessionMutation.mutate();
  };
  
  const isLoading = isLoadingCurrentPlan || isLoadingPlans;
  const isPending = createCheckoutSessionMutation.isPending || createPortalSessionMutation.isPending;
  
  return (
    <AppLayout title="Billing Settings">
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Subscription & Billing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your subscription plan and billing information.
            </p>
          </div>
          
          <Separator />
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Your current subscription plan and usage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold flex items-center">
                        {currentPlan?.name}
                        {currentPlan?.name === 'Pro' && <span className="text-yellow-500 ml-1">★</span>}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {currentPlan?.price > 0
                          ? `${formatPrice(currentPlan.price)} / ${currentPlan.interval}`
                          : 'Free'}
                      </p>
                    </div>
                    <Badge variant={currentPlan?.price > 0 ? 'default' : 'outline'}>
                      {currentPlan?.price > 0 ? 'Active' : 'Free Tier'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Flows</p>
                      <p className="text-lg font-semibold mt-1">{currentPlan?.maxFlows}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Messages/month</p>
                      <p className="text-lg font-semibold mt-1">{currentPlan?.maxMessages}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contacts</p>
                      <p className="text-lg font-semibold mt-1">{currentPlan?.maxContacts}</p>
                    </div>
                  </div>
                  
                  {currentPlan?.features && currentPlan.features.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentPlan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {user?.stripeCustomerId ? (
                    <Button
                      onClick={handleBillingPortal}
                      disabled={isPending}
                      className="flex items-center gap-2"
                    >
                      {isPending ? (
                        <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      Manage Billing
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Upgrade to a paid plan to manage your billing information.
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              {/* Available Plans */}
              <div>
                <h3 className="text-lg font-medium mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availablePlans?.map((plan: any) => (
                    <Card 
                      key={plan.id} 
                      className={
                        currentPlan?.id === plan.id
                          ? 'border-primary ring-1 ring-primary'
                          : ''
                      }
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          {plan.name === 'Pro' && <span className="text-yellow-500 text-lg">★</span>}
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline mb-4">
                          <span className="text-2xl font-bold">
                            {plan.price > 0 ? formatPrice(plan.price) : 'Free'}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-gray-500 dark:text-gray-400 ml-1">
                              /{plan.interval}
                            </span>
                          )}
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{plan.maxFlows} flows</span>
                          </li>
                          <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{plan.maxMessages} messages/month</span>
                          </li>
                          <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{plan.maxContacts} contacts</span>
                          </li>
                          <li className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span>{plan.maxWhatsappIntegrations} WhatsApp {plan.maxWhatsappIntegrations === 1 ? 'integration' : 'integrations'}</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {currentPlan?.id === plan.id ? (
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            disabled
                          >
                            Current Plan
                          </Button>
                        ) : (
                          <Button 
                            className="w-full" 
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isPending && selectedPlanId === plan.id}
                          >
                            {isPending && selectedPlanId === plan.id ? (
                              <span className="flex items-center">
                                <span className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                                Processing...
                              </span>
                            ) : plan.price > 0 ? 'Upgrade' : 'Downgrade'}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Billing History */}
              {user?.stripeCustomerId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View and download your invoices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      Your billing history is available in the Stripe Customer Portal.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      onClick={handleBillingPortal}
                      disabled={isPending}
                      className="flex items-center gap-2"
                    >
                      {isPending ? (
                        <span className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></span>
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      View Billing History
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
