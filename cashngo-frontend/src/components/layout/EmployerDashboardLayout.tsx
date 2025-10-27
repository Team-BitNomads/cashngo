/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Briefcase,
  Users,
  Menu, // <-- Added Menu icon
  X, // <-- Added X icon
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Employer-specific nav items ---
const employerNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Gigs", href: "/gigs", icon: Briefcase }, // Employer sees their posted gigs
  { name: "Applicants", href: "/dashboard/applicants", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface EmployerDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

// --- Changed to export default function ---
export default function EmployerDashboardLayout({
  children,
  title,
  searchTerm,
  setSearchTerm,
}: EmployerDashboardLayoutProps) {
  // Use destructuring directly
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] =
    useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar
  const { user, logout } = useAuth();

  const navItems = employerNavItems; // Use employer nav items

  return (
    <div className="flex min-h-screen w-full bg-slate-950 text-white">
      {/* --- Desktop Sidebar --- */}
      <aside
        onMouseEnter={() => setIsDesktopSidebarExpanded(true)}
        onMouseLeave={() => setIsDesktopSidebarExpanded(false)}
        className={cn(
          "hidden lg:flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out",
          "fixed top-0 left-0 h-screen z-40",
          isDesktopSidebarExpanded ? "w-64" : "w-20"
        )}
      >
        {/* Desktop Sidebar Content */}
        <div className="flex h-16 lg:h-20 items-center px-6 border-b border-slate-800">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 font-bold text-lg text-cyan-400 overflow-hidden" // Cyan theme
          >
            <div className="h-8 w-8 bg-cyan-500 rounded-lg flex-shrink-0" />{" "}
            {/* Cyan theme */}
            <span
              className={cn(
                "transition-opacity whitespace-nowrap",
                !isDesktopSidebarExpanded && "opacity-0"
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
                    ? "bg-cyan-500 text-slate-900 font-semibold" // Cyan theme
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
              onClick={() => setIsMobileSidebarOpen(false)} // Close mobile if somehow open
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "font-medium transition-opacity whitespace-nowrap",
                  !isDesktopSidebarExpanded && "opacity-0"
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
                !isDesktopSidebarExpanded && "opacity-0"
              )}
            >
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* --- Mobile Sidebar (Slide-in) --- */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out flex flex-col lg:hidden", // Show only on mobile
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full" // Slide in/out
        )}
      >
        {/* Mobile Sidebar Content */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 font-bold text-lg text-cyan-400"
          >
            {" "}
            {/* Cyan Theme */}
            <div className="h-8 w-8 bg-cyan-500 rounded-lg flex-shrink-0" />{" "}
            {/* Cyan Theme */}
            <span>CashnGo</span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-slate-400"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors duration-200",
                  isActive
                    ? "bg-cyan-500 text-slate-900 font-semibold" // Cyan Theme
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
              onClick={() => setIsMobileSidebarOpen(false)} // Close on click
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
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
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* --- Overlay for Mobile Sidebar --- */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* --- Main Content Area --- */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          // Adjust margin ONLY on large screens
          "lg:ml-20",
          isDesktopSidebarExpanded && "lg:ml-64"
        )}
      >
        {/* --- Mobile Header --- */}
        <header className="flex lg:hidden h-16 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-slate-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 font-bold text-md text-cyan-400"
          >
            {" "}
            {/* Cyan Theme */}
            <div className="h-6 w-6 bg-cyan-500 rounded-md flex-shrink-0" />{" "}
            {/* Cyan Theme */}
            <span>CashnGo</span>
          </NavLink>
          {/* Simple Avatar for Mobile Header */}
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                user?.name || "User"
              }`}
            />
            <AvatarFallback>{user?.name?.[0] || "E"}</AvatarFallback>{" "}
            {/* 'E' for Employer */}
          </Avatar>
        </header>

        {/* --- Desktop Header --- */}
        <header className="hidden lg:flex h-20 items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-6 sticky top-0 z-30">
          <h1 className="text-3xl font-bold text-slate-100">{title}</h1>

          {/* Employer-specific search bar */}
          {setSearchTerm && (
            <div className="flex-1 ml-auto max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search for applicants..." // Employer context
                  value={searchTerm ?? ""} // Ensure value is controlled even if undefined
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {/* Desktop User Profile (Employer Context) */}
          <div className="flex items-center gap-4 ml-auto">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                  user?.name || "User"
                }`}
              />
              <AvatarFallback>{user?.name?.[0] || "E"}</AvatarFallback>{" "}
              {/* 'E' for Employer */}
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {user?.name || "Employer"}
              </p>
              <p className="text-xs text-slate-400">
                {/* Assuming 'major' might hold company name for employers in your AuthContext */}
                {user?.major || "Company"}
              </p>
            </div>
          </div>
        </header>

        {/* --- Page Content --- */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
