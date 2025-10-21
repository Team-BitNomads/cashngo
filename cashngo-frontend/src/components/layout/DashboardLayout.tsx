import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Gigs", href: "/gigs", icon: Wallet },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  searchTerm,
  setSearchTerm,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-white">
      <aside
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out",
          isSidebarExpanded ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-20 items-center px-6 border-b border-slate-800">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 font-bold text-lg text-green-400 overflow-hidden"
          >
            <div className="h-8 w-8 bg-green-500 rounded-lg flex-shrink-0" />
            <span
              className={cn(
                "transition-opacity whitespace-nowrap",
                !isSidebarExpanded && "opacity-0"
              )}
            >
              CashnGo
            </span>
          </NavLink>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors duration-200 overflow-hidden",
                  isActive
                    ? "bg-green-500 text-slate-900 font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "font-medium transition-opacity whitespace-nowrap",
                  !isSidebarExpanded && "opacity-0"
                )}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start mt-2 text-slate-400 hover:bg-slate-800 hover:text-red-500"
          >
            <LogOut className="h-5 w-5 mr-4 flex-shrink-0" />
            <span
              className={cn(
                "transition-opacity whitespace-nowrap",
                !isSidebarExpanded && "opacity-0"
              )}
            >
              Logout
            </span>
          </Button>
        </div>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="flex h-20 items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-6 sticky top-0 z-30">
          <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
          <div className="flex-1 ml-auto max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <Input
                type="search"
                placeholder="Search for gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                  user?.name || "User"
                }`}
              />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-400">{user?.major}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
