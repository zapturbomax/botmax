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
    <header className="bg-[#f6f6fa] flex items-center justify-end py-3 px-4 border-b border-gray-200">
      <div className="p-[3px] pl-[10px] pr-[10px] bg-white rounded-full shadow-sm flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#5b5dcd] text-white">{getInitials()}</AvatarFallback>
            {/* Avatar image would go here if available */}
          </Avatar>
          <div className="text-sm font-medium">{user?.fullName || user?.username || "Ashly Boldwin"}</div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full bg-white hover:bg-gray-100 h-10 w-10">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-white hover:bg-gray-100 h-10 w-10">
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
