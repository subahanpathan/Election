import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Vote, BarChart, Settings, Home, Crown, LogOut, GraduationCap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./animated-background";
import { useAuth } from "@/lib/auth-context";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { studentSession, studentLogout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/candidates", label: "Candidates", icon: Users },
    { href: "/vote", label: "Vote", icon: Vote },
    { href: "/results", label: "Results", icon: BarChart },
  ];

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
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className={cn("text-sm font-medium transition-colors hover:text-primary", isActive ? "text-primary" : "text-muted-foreground")}>
                  <span className="flex items-center gap-2">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {studentSession && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{studentSession.name}</span>
                <span className="font-mono text-xs">{studentSession.studentId}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => studentLogout().then(() => { window.location.href = "/"; })}
              className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
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
  const [location] = useLocation();
  const { adminSession, adminLogout } = useAuth();

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
        
        <div className="p-4 border-t border-white/5 mt-auto space-y-2">
          {adminSession && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground truncate">{adminSession.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => adminLogout().then(() => { window.location.href = "/"; })}
              className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
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