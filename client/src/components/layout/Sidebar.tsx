import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ChartGantt,
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChartBig,
  Settings2,
  User,
  CreditCard,
  Eye
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: plan } = useQuery({
    queryKey: ['/api/subscription/current'],
    enabled: !!user,
  });

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
        "w-64 flex flex-col bg-[#1c1c24] text-white my-2 ml-2 rounded-3xl shadow-md"
      )}>
        {/* Brand Logo */}
        <div className="p-5 flex items-center">
          <div className="flex items-center space-x-2">
            <div className="text-white text-2xl font-bold flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M4 16L16 4L28 16M16 4V28" stroke="#a5a6f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              BotMAX
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-1.5">
            <NavLink 
              href="/dashboard" 
              icon={<LayoutDashboard size={18} />} 
              isActive={location === "/dashboard" || location === "/"}
            >
              Painel
            </NavLink>
            <NavLink 
              href="/flows" 
              icon={<ChartGantt size={18} />} 
              isActive={location.startsWith("/flows") && !location.startsWith("/flows-beta")}
            >
              Construtor de Fluxo
            </NavLink>
            <NavLink 
              href="/flows-beta" 
              icon={<ChartGantt size={18} />} 
              isActive={location.startsWith("/flows-beta") || location.startsWith("/flow-builder-beta")}
            >
              Construtor Beta
            </NavLink>
            <NavLink 
              href="/settings/whatsapp" 
              icon={<MessageSquare size={18} />} 
              isActive={location === "/settings/whatsapp"}
            >
              Integração WhatsApp
            </NavLink>
            <NavLink 
              href="/conversations" 
              icon={<MessageSquare size={18} />} 
              isActive={location === "/conversations"}
            >
              Conversas
            </NavLink>
            <NavLink 
              href="/contacts" 
              icon={<Users size={18} />} 
              isActive={location === "/contacts"}
            >
              Contatos
            </NavLink>
            <NavLink 
              href="/analytics" 
              icon={<BarChartBig size={18} />} 
              isActive={location === "/analytics"}
              badge={plan?.name === "Free" ? "PRO" : undefined}
            >
              Análises
            </NavLink>
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-xs text-gray-400 uppercase tracking-wider mb-2">
              Configurações
            </h3>
            <div className="space-y-1.5">
              <NavLink 
                href="/settings/general" 
                icon={<Settings2 size={18} />} 
                isActive={location === "/settings/general"}
              >
                Geral
              </NavLink>
              <NavLink 
                href="/settings/account" 
                icon={<User size={18} />} 
                isActive={location === "/settings/account"}
              >
                Conta
              </NavLink>
              <NavLink 
                href="/settings/billing" 
                icon={<CreditCard size={18} />} 
                isActive={location === "/settings/billing"}
              >
                Faturamento
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Pro Plan Section */}
        <div className="px-4 py-5 mt-auto mb-5">
          <div className="bg-[#5b5dcd] rounded-lg p-4 text-white relative overflow-hidden">
            {/* Background icons */}
            <div className="absolute right-2 top-2 opacity-20">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L16 4L28 16M16 4V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="absolute right-10 bottom-6 opacity-20">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L16 4L28 16M16 4V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  Plano {plan?.name || "Pro"}
                </h3>
                <div className="text-2xl font-bold flex items-center mt-1">
                  R${plan?.price || 189}<span className="text-sm ml-1 opacity-80">/mês</span>
                </div>
              </div>
            </div>
            <p className="text-xs opacity-80 my-3">
              {plan?.name === "Pro" 
                ? "Você está aproveitando todos os recursos premium"
                : "Desbloqueie muitos recursos incríveis com nosso Plano Premium Pro"}
            </p>
            <Button 
              variant="secondary"
              className="w-full bg-[#2b2b36] text-white hover:bg-[#35353f] border-none flex items-center justify-center"
              size="sm"
            >
              {plan?.name === "Pro" ? (
                <>
                  <Eye size={14} className="mr-1.5" />
                  Ver Plano
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                    <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V12M9 15V12M12 15V10M15 15V8M17.5858 1.58579C18.3668 0.804738 19.6332 0.804738 20.4142 1.58579C21.1953 2.36683 21.1953 3.63316 20.4142 4.41421L12.8284 12H9V8.17157L16.5858 0.585786C17.3668 -0.195262 18.6332 -0.195262 19.4142 0.585786C20.1953 1.36683 20.1953 2.63316 19.4142 3.41421L11.8284 11H8V7.17157L17.5858 1.58579Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Obter Plano Pro
                </>
              )}
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
          ? "bg-[#35353f] text-white border-l-2 border-[#a5a6f6]" 
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