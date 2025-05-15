import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMedia } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showHeaderActions?: boolean;
}

export default function AppLayout({ 
  children, 
  title = "Dashboard",
  showHeaderActions = false 
}: AppLayoutProps) {
  const isMobile = useMedia("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  return (
    <div className="h-screen flex overflow-hidden bg-[#f6f6fa]">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          showActions={showHeaderActions}
        />
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#f6f6fa]">
          {children}
        </div>
      </main>
    </div>
  );
}
