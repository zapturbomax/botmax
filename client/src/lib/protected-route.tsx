import { Route, Redirect, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  return (
    <Route path={path}>
      {(params) => {
        // Show loading state if auth is still being checked
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
            </div>
          );
        }

        // Redirect to login if not authenticated
        if (!user) {
          return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
        }

        // Render the protected component
        return <Component {...params} />;
      }}
    </Route>
  );
}