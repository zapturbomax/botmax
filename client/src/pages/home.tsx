import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight, ChartGantt, CheckCircle, Gift } from 'lucide-react';

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
    <div className="h-12 w-12 bg-primary-50 dark:bg-primary-900/50 text-primary-500 dark:text-primary-400 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
              <ChartGantt size={20} />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">FlowBot</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <a className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Log in</a>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-850">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Build WhatsApp Chatbots <span className="text-primary">Visually</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Create, deploy, and manage conversational WhatsApp flows without coding. 
              Drag-and-drop interface for businesses of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Building for Free
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create engaging WhatsApp experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Visual Flow Builder" 
              description="Drag and drop interface to create complex conversational flows without coding"
              icon={<ChartGantt size={24} />}
            />
            <FeatureCard 
              title="WhatsApp Integration" 
              description="Seamless integration with WhatsApp Business API for high-quality messaging"
              icon={<CheckCircle size={24} />}
            />
            <FeatureCard 
              title="Multi-tenant Architecture" 
              description="Securely manage multiple businesses or teams from a single platform"
              icon={<Gift size={24} />}
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Teaser */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Plans that grow with your business. Start free, upgrade as you scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="default" size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                <ChartGantt size={20} />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">FlowBot</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Terms
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Privacy
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FlowBot SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
