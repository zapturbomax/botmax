import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useParams } from 'wouter';
import FlowBuilderComponent from '@/components/flow-builder/FlowBuilder';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';

export default function FlowBuilderPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  
  // Check flow exists and user has access
  const { data: flow, isLoading, error } = useQuery({
    queryKey: ['/api/flows', id],
    enabled: !!id && !!user,
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation('/login?redirect=' + encodeURIComponent(location));
    }
  }, [user, isAuthLoading, location, setLocation]);
  
  // Redirect if flow not found
  useEffect(() => {
    if (!isLoading && error) {
      console.error("Flow not found or error:", error);
      setLocation('/flows');
    }
  }, [isLoading, error, setLocation]);
  
  // Debugging logs
  useEffect(() => {
    console.log("Flow data:", flow);
    console.log("Flow ID:", id);
  }, [flow, id]);
  
  if (isAuthLoading || !user) {
    return null; // Don't render anything while checking auth
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
      </div>
    );
  }
  
  return <FlowBuilderComponent flow={flow} flowId={id} />;
}
