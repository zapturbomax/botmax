import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  FileText,
  Trash,
  AlertCircle,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
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
        "w-64 flex flex-col bg-[#1c1c24] text-white"
      )}>
        {/* Brand Logo */}
        <div className="p-5 flex items-center">
          <div className="flex items-center space-x-2">
            <div className="text-white text-3xl font-bold flex items-center">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M10 19L19 10M19 10L28 19M19 10V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Attmosfire
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-1.5">
            <NavLink 
              href="/all" 
              icon={<FileText size={18} />} 
              isActive={location === "/all"}
            >
              All
            </NavLink>
            <NavLink 
              href="/assigned-to-me" 
              icon={<FileText size={18} />} 
              isActive={location === "/assigned-to-me"}
            >
              Assigned to Me
            </NavLink>
            <NavLink 
              href="/unassigned" 
              icon={<FileText size={18} />} 
              isActive={location === "/unassigned"}
            >
              Unassigned
            </NavLink>
            <NavLink 
              href="/live-chat" 
              icon={<MessageSquare size={18} />} 
              isActive={location === "/live-chat"}
            >
              Live Chat
            </NavLink>
            <NavLink 
              href="/blocked" 
              icon={<AlertCircle size={18} />} 
              isActive={location === "/blocked"}
              badge="PRO"
            >
              Blocked
            </NavLink>
            <NavLink 
              href="/trash" 
              icon={<Trash size={18} />} 
              isActive={location === "/trash"}
            >
              Trash
            </NavLink>
          </div>
        </nav>
        
        {/* Pro Plan Section */}
        <div className="px-4 py-5 mt-auto mb-5">
          <div className="bg-[#5b5dcd] rounded-lg p-4 text-white">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Pro Plan</h3>
                <div className="text-2xl font-bold flex items-center mt-1">
                  $189<span className="text-sm ml-1 opacity-80">/month</span>
                </div>
              </div>
            </div>
            <p className="text-xs opacity-80 mb-4">
              Open a lot of cool features with our Premium Pro Plan
            </p>
            <Button 
              variant="secondary"
              className="w-full bg-[#6a6cf1] text-white hover:bg-[#7b7df4] border-none"
              size="sm"
            >
              Get Pro Plan
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
  isActive?: boolean;
  badge?: string;
}

function NavLink({ href, icon, children, isActive = false, badge }: NavLinkProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "sidebar-item flex items-center px-3 py-3 text-sm font-medium rounded-md cursor-pointer",
        isActive 
          ? "bg-[#35353f] text-white" 
          : "text-gray-400 hover:bg-[#35353f] hover:text-white"
      )}>
        <span className="mr-3 text-lg">
          {icon}
        </span>
        <span>{children}</span>
        {badge && (
          <span className="ml-auto bg-[#5b5dcd] text-[10px] font-semibold px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}