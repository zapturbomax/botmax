
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";
import { useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { useLocation } from "wouter";
import React, { useEffect } from 'react';
import axios from 'axios';

// Pages
import Home from './pages/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard from './pages/dashboard';
import FlowBuilder from './pages/flow-builder';
import FlowBuilderBeta from './pages/flow-builder-beta';
import Chat from './pages/chat';
import ForgotPassword from './pages/auth/forgot-password';
import NotFound from './pages/not-found';

// Settings pages
// Placeholder components para settings
const GeneralSettings = () => <div>General Settings</div>;
const AccountSettings = () => <div>Account Settings</div>;
const BillingSettings = () => <div>Billing Settings</div>;
const WhatsAppSettings = () => <div>WhatsApp Settings</div>;

// Flow related pages
import Flows from './pages/flows';
import NewFlow from './pages/flows/new';
import FlowsBeta from './pages/flows-beta';
import NewFlowBeta from './pages/flows-beta/new';

// Router component to manage routes
function Router() {
  const { isLoading, user, token } = useAuth();
  const [location, setLocation] = useLocation();

  // Setup Axios defaults when authenticated
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && !token && 
       !location.startsWith('/login') && 
       !location.startsWith('/register') && 
       !location.startsWith('/forgot-password') && 
       location !== '/') {
      console.log("Redirecionando para login, localização atual:", location);
      setLocation('/login');
    }
  }, [isLoading, user, token, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Protected routes */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flows">
        {() => (
          <ProtectedRoute>
            <Flows />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flows/new">
        {() => (
          <ProtectedRoute>
            <NewFlow />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flows-beta">
        {() => (
          <ProtectedRoute>
            <FlowsBeta />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flows-beta/new">
        {() => (
          <ProtectedRoute>
            <NewFlowBeta />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flow-builder/:id">
        {(params) => (
          <ProtectedRoute>
            <FlowBuilder />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flow-builder-beta/:id">
        {(params) => (
          <ProtectedRoute>
            <FlowBuilderBeta />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/chat">
        {() => (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/settings/general">
        {() => (
          <ProtectedRoute>
            <GeneralSettings />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/settings/account">
        {() => (
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/settings/billing">
        {() => (
          <ProtectedRoute>
            <BillingSettings />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/settings/whatsapp">
        {() => (
          <ProtectedRoute>
            <WhatsAppSettings />
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback route */}
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
