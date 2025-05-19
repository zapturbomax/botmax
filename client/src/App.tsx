import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./lib/protected-route";
import { useAuth } from "@/hooks/use-auth";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ForgotPassword from "@/pages/auth/forgot-password";
import Dashboard from "@/pages/dashboard";
import FlowBuilder from "@/pages/flow-builder";
import Flows from "@/pages/flows/index";
import NewFlow from "@/pages/flows/new";
import GeneralSettings from "@/pages/settings/general";
import AccountSettings from "@/pages/settings/account";
import BillingSettings from "@/pages/settings/billing";
import WhatsAppSettings from "@/pages/settings/whatsapp";
import Chat from "@/pages/chat";

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
      <ProtectedRoute path="/flows/:id" component={FlowBuilder} />
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
