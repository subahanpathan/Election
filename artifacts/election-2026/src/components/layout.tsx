import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Vote, BarChart, Settings, Home, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./animated-background";

export function Layout({ children }: { children: React.ReactNode }) {
  const { student, isAdmin, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
            <span className="font-heading font-bold text-lg tracking-tight">Election <span className="text-primary">2026</span></span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {student && (
              <>
                <Link href="/dashboard" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/dashboard" ? "text-primary" : "text-muted-foreground")}>Dashboard</Link>
                <Link href="/candidates" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/candidates" ? "text-primary" : "text-muted-foreground")}>Candidates</Link>
                <Link href="/vote" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/vote" ? "text-primary" : "text-muted-foreground")}>Vote</Link>
                <Link href="/results" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/results" ? "text-primary" : "text-muted-foreground")}>Results</Link>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {student.name}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            
            {isAdmin && !student && (
              <>
                <Link href="/admin/dashboard" className={cn("text-sm font-medium transition-colors hover:text-primary", location.startsWith("/admin") ? "text-primary" : "text-muted-foreground")}>Admin Panel</Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {!student && !isAdmin && location !== "/student-login" && location !== "/admin" && (
              <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                <Link href="/student-login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, logout } = useAuth();
  const [location, setLocation] = useLocation();

  if (!isAdmin) {
    setLocation("/admin");
    return null;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/candidates", label: "Candidates", icon: Users },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/results", label: "Results", icon: BarChart },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      <AnimatedBackground />
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-r border-white/5 bg-background/60 backdrop-blur-xl z-20 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-lg">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                )}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5 mt-auto">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => { logout(); setLocation("/"); }}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="container max-w-6xl mx-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
