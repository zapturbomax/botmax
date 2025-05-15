import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./lib/auth";

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

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/flows" component={Flows} />
      <Route path="/flows/new" component={NewFlow} />
      <Route path="/flows/:id" component={FlowBuilder} />
      <Route path="/settings/general" component={GeneralSettings} />
      <Route path="/settings/account" component={AccountSettings} />
      <Route path="/settings/billing" component={BillingSettings} />
      <Route path="/settings/whatsapp" component={WhatsAppSettings} />
      
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
