import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { 
  ChartGantt, Plus, MessageSquare, Users, BarChart3, PlusCircle, Activity,
  ArrowRight, CheckCircle, AlertTriangle, Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Get flows
  const { data: flows, isLoading: isLoadingFlows } = useQuery({
    queryKey: ['/api/flows'],
    enabled: !!user,
  });
  
  // Get plan
  const { data: plan } = useQuery({
    queryKey: ['/api/subscription/current'],
    enabled: !!user,
  });
  
  return (
    <AppLayout title="Dashboard">
      <div className="container mx-auto p-4 md:p-6">
        {/* Welcome section */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome back, {user?.fullName || user?.username || 'User'}!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Here's what's happening with your chatbots today.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/flows/new">
                    <Button className="gap-2">
                      <Plus size={16} />
                      Create New Flow
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      
        {/* Stats section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Flows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ChartGantt className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{flows?.filter(f => f.status === 'published').length || 0}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {plan && `${flows?.filter(f => f.status === 'published').length || 0}/${plan.maxFlows} flows used`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-secondary mr-2" />
                  <span className="text-2xl font-bold">0</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {plan && `0/${plan.maxMessages} messages used`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">0</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {plan && `0/${plan.maxContacts} contacts created`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold">-</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">No data available yet</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Recent flows section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Flows</h2>
            <Link href="/flows">
              <Button variant="link" className="gap-1">
                View All <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingFlows ? (
              <Card className="col-span-full">
                <CardContent className="p-8 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </CardContent>
              </Card>
            ) : flows && flows.length > 0 ? (
              <>
                {flows.slice(0, 3).map((flow) => (
                  <Card key={flow.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{flow.name}</CardTitle>
                        {flow.status === 'published' ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <Clock size={12} className="mr-1" />
                            Draft
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {flow.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <span className="text-xs text-gray-500">
                          Last updated: {new Date(flow.updatedAt).toLocaleDateString()}
                        </span>
                        <Link href={`/flows/${flow.id}`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
                
                <Link href="/flows/new">
                  <Card className="h-full cursor-pointer border-dashed hover:border-primary hover:bg-primary/5 transition-colors">
                    <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                      <PlusCircle size={24} className="text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Create New Flow</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Build a new conversational flow for WhatsApp
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            ) : (
              <>
                <Card className="h-full col-span-full md:col-span-1">
                  <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                    <AlertTriangle size={24} className="text-amber-500 mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">No Flows Found</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You haven't created any flows yet. Get started now!
                    </p>
                    <Link href="/flows/new">
                      <Button className="mt-4 gap-2">
                        <Plus size={16} />
                        Create Your First Flow
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </section>
        
        {/* Getting started section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Getting Started</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="h-10 w-10 bg-primary-50 dark:bg-primary-900/30 text-primary rounded-lg flex items-center justify-center mb-2">
                  <ChartGantt size={20} />
                </div>
                <CardTitle>Build a Flow</CardTitle>
                <CardDescription>
                  Create your first conversational flow with our drag-and-drop builder
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/flows/new">
                  <Button variant="outline" className="gap-1">
                    Start Building <ArrowRight size={16} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 bg-secondary-50 dark:bg-secondary-900/30 text-secondary rounded-lg flex items-center justify-center mb-2">
                  <MessageSquare size={20} />
                </div>
                <CardTitle>Connect WhatsApp</CardTitle>
                <CardDescription>
                  Link your WhatsApp Business account to start engaging with users
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/settings/whatsapp">
                  <Button variant="outline" className="gap-1">
                    Setup WhatsApp <ArrowRight size={16} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-10 w-10 bg-green-50 dark:bg-green-900/30 text-green-500 rounded-lg flex items-center justify-center mb-2">
                  <Activity size={20} />
                </div>
                <CardTitle>View Analytics</CardTitle>
                <CardDescription>
                  Track performance and optimize your conversational flows
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/analytics">
                  <Button variant="outline" className="gap-1">
                    Explore Analytics <ArrowRight size={16} />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
