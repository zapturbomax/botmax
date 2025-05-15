import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChartGantt,
  LayoutDashboard,
  Settings,
  LogOut,
  MessageSquare,
  Users,
  BarChartBig,
  CreditCard,
  User,
  Settings2
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    if (user.fullName) {
      return user.fullName.split(" ").map(n => n[0]).join("").toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed md:relative md:translate-x-0 z-50 md:z-0 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        "w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
      )}>
        {/* Brand Logo */}
        <div className="p-4 flex items-center border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
              <ChartGantt size={18} />
            </div>
            <span className="text-xl font-semibold">FlowBot</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <NavLink 
              href="/dashboard" 
              icon={<LayoutDashboard size={18} />} 
              current={location}
            >
              Dashboard
            </NavLink>
            <NavLink 
              href="/flows" 
              icon={<ChartGantt size={18} />} 
              current={location}
            >
              Flow Builder
            </NavLink>
            <NavLink 
              href="/settings/whatsapp" 
              icon={<MessageSquare size={18} />} 
              current={location}
            >
              WhatsApp Integration
            </NavLink>
            <NavLink 
              href="/conversations" 
              icon={<MessageSquare size={18} />} 
              current={location}
            >
              Conversations
            </NavLink>
            <NavLink 
              href="/contacts" 
              icon={<Users size={18} />} 
              current={location}
            >
              Contacts
            </NavLink>
            <NavLink 
              href="/analytics" 
              icon={<BarChartBig size={18} />} 
              current={location}
            >
              Analytics
            </NavLink>
          </div>
          
          <div className="mt-10">
            <h3 className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              <NavLink 
                href="/settings/general" 
                icon={<Settings2 size={18} />} 
                current={location}
              >
                General
              </NavLink>
              <NavLink 
                href="/settings/account" 
                icon={<User size={18} />} 
                current={location}
              >
                Account
              </NavLink>
              <NavLink 
                href="/settings/billing" 
                icon={<CreditCard size={18} />} 
                current={location}
              >
                Billing
              </NavLink>
            </div>
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="ml-3 min-w-0 flex-1">
              <div className="text-sm font-medium truncate">
                {user?.fullName || user?.username || "User"}
              </div>
              <div className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email || "user@example.com"}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  current: string;
}

function NavLink({ href, icon, children, current }: NavLinkProps) {
  const isActive = current === href || current.startsWith(`${href}/`);
  
  return (
    <Link href={href}>
      <a className={cn(
        "sidebar-item flex items-center px-3 py-2.5 text-sm font-medium rounded-md",
        isActive ? "active" : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
      )}>
        <span className={cn(
          "mr-3 text-lg",
          isActive ? "text-primary" : "text-sidebar-foreground/70"
        )}>
          {icon}
        </span>
        {children}
      </a>
    </Link>
  );
}
