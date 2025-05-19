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

// Pages
import Home from '@/pages/home';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import Dashboard from '@/pages/dashboard';
import FlowBuilder from '@/pages/flow-builder';
import Chat from '@/pages/chat';
import ForgotPassword from '@/pages/auth/forgot-password';
import NotFound from '@/pages/not-found';
import Account from '@/pages/settings/account';
import Billing from '@/pages/settings/billing';
import WhatsApp from '@/pages/settings/whatsapp';
import General from '@/pages/settings/general';
import Flows from '@/pages/flows';
import NewFlow from '@/pages/flows/new';
import FlowBuilderBeta from '@/pages/flow-builder-beta';
import NewFlowBeta from '@/pages/flows-beta/new';

// Componente temporário para listar fluxos beta
const FlowsBeta = () => {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  return <Flows isBeta={true} />;
};

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
      <ProtectedRoute path="/flows" component={Flows} />
      <ProtectedRoute path="/flows/new" component={NewFlow} />
      <Route path="/flows/:id">
            {(params) => <FlowBuilderPage />}
          </Route>
      <Route path="/flows-beta/new">
            {() => <React.Suspense fallback={<div>Carregando...</div>}>
              <NewFlowBeta />
            </React.Suspense>}
          </Route>
      <Route path="/flows-beta">
            {() => <React.Suspense fallback={<div>Carregando...</div>}>
              <FlowsBeta />
            </React.Suspense>}
          </Route>
      <Route path="/flow-builder-beta/:id">
            {(params) => <React.Suspense fallback={<div>Carregando...</div>}>
              <FlowBuilderBeta />
            </React.Suspense>}
          </Route>
      <ProtectedRoute path="/settings/general" component={GeneralSettings} />
      <ProtectedRoute path="/settings/account" component={AccountSettings} />
      <ProtectedRoute path="/settings/billing" component={BillingSettings} />
      <ProtectedRoute path="/settings/whatsapp" component={WhatsAppSettings} />
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