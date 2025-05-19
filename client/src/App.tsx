import { Switch, Route, Redirect } from "wouter";
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

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/chat" component={Chat} />

      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />

      {/* Flows - Original */}
      <ProtectedRoute path="/flows" component={Flows} />
      <ProtectedRoute path="/flows/new" component={NewFlow} />
      <Route path="/flows/:id">
        {(params) => <FlowBuilder />}
      </Route>

      {/* Flows - Beta */}
      <ProtectedRoute path="/flows-beta" component={FlowsBeta} />
      <ProtectedRoute path="/flows-beta/new" component={NewFlowBeta} />
      <Route path="/flow-builder-beta/:id">
        {(params) => <FlowBuilderBeta />}
      </Route>

      {/* Settings */}
      <ProtectedRoute path="/settings/general" component={GeneralSettings} />
      <ProtectedRoute path="/settings/account" component={AccountSettings} />
      <ProtectedRoute path="/settings/billing" component={BillingSettings} />
      <ProtectedRoute path="/settings/whatsapp" component={WhatsAppSettings} />

      {/* Dashboard Sections */}
      <ProtectedRoute path="/all" component={Dashboard} />
      <ProtectedRoute path="/assigned-to-me" component={Dashboard} />
      <ProtectedRoute path="/unassigned" component={Dashboard} />
      <ProtectedRoute path="/live-chat" component={Dashboard} />
      <ProtectedRoute path="/blocked" component={Dashboard} />
      <ProtectedRoute path="/trash" component={Dashboard} />

      {/* Home Page / Redirect */}
      <Route path="/">
        {() => <Home />}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check authentication state
  const { isLoading, user, token } = useAuth();

  // Verificar autenticação ao iniciar a aplicação
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