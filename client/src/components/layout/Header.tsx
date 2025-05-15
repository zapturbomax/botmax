import { FC } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Settings,
  Search,
  PaperclipIcon,
  Mic
} from "lucide-react";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  showActions?: boolean;
}

const Header: FC<HeaderProps> = ({ title, onMenuClick, showActions = false }) => {
  const { user } = useAuth();
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    if (user.fullName) {
      return user.fullName.split(" ").map(n => n[0]).join("").toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-[#f6f6fa] flex items-center py-3 px-4 border-b border-gray-200">
      <div className="flex-1 flex items-center justify-center space-x-3">
        <Button 
          variant="outline" 
          className="bg-[#2b2b36] text-white rounded-full hover:bg-[#35353f] border-0"
        >
          Chat
        </Button>
        <Button 
          variant="outline" 
          className="bg-transparent text-gray-600 rounded-full hover:bg-gray-100 border-0"
        >
          Contacts
        </Button>
        <Button 
          variant="outline" 
          className="bg-transparent text-gray-600 rounded-full hover:bg-gray-100 border-0"
        >
          Templates
        </Button>
        <Button 
          variant="outline" 
          className="bg-transparent text-gray-600 rounded-full hover:bg-gray-100 border-0"
        >
          My Projects
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#5b5dcd] text-white">{getInitials()}</AvatarFallback>
          {/* Avatar image would go here if available */}
        </Avatar>
        <div className="text-sm font-medium">Ashly Boldwin</div>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
