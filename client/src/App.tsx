import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./lib/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import React, { useEffect } from 'react';
import axios from 'axios';

// Pages
import Home from '@/pages/home';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import Dashboard from '@/pages/dashboard';
import FlowBuilder from '@/pages/flow-builder';
import Chat from '@/pages/chat';
import ForgotPassword from '@/pages/auth/forgot-password';
import NotFound from '@/pages/not-found';

// Settings
import GeneralSettings from '@/pages/settings/general';
import AccountSettings from '@/pages/settings/account';
import BillingSettings from '@/pages/settings/billing';
import WhatsAppSettings from '@/pages/settings/whatsapp';

// Flow related pages
import Flows from '@/pages/flows';
import NewFlow from '@/pages/flows/new';
import FlowBuilderBeta from '@/pages/flow-builder-beta';
import NewFlowBeta from '@/pages/flows-beta/new';
import FlowsBeta from '@/pages/flows-beta';

// Router component to manage routes
function Router() {
  const { isLoading, user, token } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && !token && !location.includes('/login') && !location.includes('/register')) {
      console.log("Redirecionando para:", "/login");
      setLocation('/login');
    }
  }, [isLoading, user, token, location, setLocation]);

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
        {() => (
          <ProtectedRoute>
            <FlowBuilder />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/flow-builder-beta/:id">
        {() => (
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Verificar autenticação global ao iniciar a aplicação
  const { isLoading, user, token } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user && token) {
        console.log("Usuário autenticado:", user.email);
        // Garantir que o token está configurado no Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        console.log("Usuário não autenticado");
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  }, [isLoading, user, token]);

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