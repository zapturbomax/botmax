import { FC } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MenuIcon,
  Bell,
  HelpCircle,
  Save,
  Rocket,
  MoreVertical,
  Settings,
  Edit,
  CheckCircle
} from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  showActions?: boolean;
}

const Header: FC<HeaderProps> = ({ title, onMenuClick, showActions = false }) => {
  const { user } = useAuth();
  
  const { data: plan } = useQuery({
    queryKey: ['/api/subscription/current'],
    enabled: !!user,
  });

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={onMenuClick}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
            
            {showActions && (
              <div className="ml-4 lg:ml-8 flex items-center space-x-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save as Draft</span>
                  <span className="sm:hidden">Save</span>
                </Button>
                <Button size="sm" className="gap-1">
                  <Rocket className="h-4 w-4" />
                  <span className="hidden sm:inline">Publish</span>
                  <span className="sm:hidden">Publish</span>
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {plan && (
              <div className="hidden sm:flex items-center mr-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{plan.name} Plan</span>
                <Badge variant="outline" className="bg-primary-50 text-primary-800 dark:bg-primary-900 dark:text-primary-300 flex items-center gap-1">
                  {plan.name === "Pro" && <span className="text-yellow-500">★</span>}
                  {plan.name}
                </Badge>
              </div>
            )}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="ml-3 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </div>
        
        {showActions && (
          <div className="bg-gray-50 dark:bg-gray-850 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Edit className="h-4 w-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  defaultValue="Welcome Flow" 
                  className="text-sm font-medium bg-transparent border-0 focus:ring-0 focus:outline-none p-0 dark:text-gray-200" 
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Last edited: 5 minutes ago</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-xs">
                <Badge className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Flow Settings</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate Flow</DropdownMenuItem>
                  <DropdownMenuItem>Export Flow</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Analytics</DropdownMenuItem>
                  <DropdownMenuItem>Test Flow</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">Delete Flow</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
