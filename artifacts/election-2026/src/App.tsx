import React from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout, AdminLayout } from "@/components/layout";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LoadingScreen } from "@/components/loading";

// Pages
import Home from "@/pages/home";
import StudentLogin from "@/pages/student-login";
import AdminLogin from "@/pages/admin/login";
import Dashboard from "@/pages/dashboard";
import Candidates from "@/pages/candidates";
import Vote from "@/pages/vote";
import Results from "@/pages/results";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCandidates from "@/pages/admin/candidates";
import AdminStudents from "@/pages/admin/students";
import AdminSettings from "@/pages/admin/settings";
import AdminResults from "@/pages/admin/results";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function StudentGuard({ children }: { children: React.ReactNode }) {
  const { studentSession, studentLoading } = useAuth();
  const [location] = useLocation();

  if (studentLoading) return <LoadingScreen />;

  if (!studentSession) {
    return <Redirect to="/login" />;
  }

  if (location === "/login") return <Redirect to="/dashboard" />;

  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { adminSession, adminLoading } = useAuth();
  const [location] = useLocation();

  if (adminLoading) return <LoadingScreen />;

  if (!adminSession) {
    return <Redirect to="/admin/login" />;
  }

  if (location === "/admin/login") return <Redirect to="/admin/dashboard" />;

  return <>{children}</>;
}

function Router() {
  const { studentSession, adminSession } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Auth */}
      <Route path="/login">
        {studentSession ? <Redirect to="/dashboard" /> : <StudentLogin />}
      </Route>
      <Route path="/admin/login">
        {adminSession ? <Redirect to="/admin/dashboard" /> : <AdminLogin />}
      </Route>

      {/* Student Routes (protected) */}
      <Route path="/dashboard"><StudentGuard><Layout><Dashboard /></Layout></StudentGuard></Route>
      <Route path="/candidates"><StudentGuard><Layout><Candidates /></Layout></StudentGuard></Route>
      <Route path="/vote"><StudentGuard><Layout><Vote /></Layout></StudentGuard></Route>
      <Route path="/results"><StudentGuard><Layout><Results /></Layout></StudentGuard></Route>

      {/* Admin Routes (protected) */}
      <Route path="/admin/dashboard"><AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard></Route>
      <Route path="/admin/candidates"><AdminGuard><AdminLayout><AdminCandidates /></AdminLayout></AdminGuard></Route>
      <Route path="/admin/students"><AdminGuard><AdminLayout><AdminStudents /></AdminLayout></AdminGuard></Route>
      <Route path="/admin/settings"><AdminGuard><AdminLayout><AdminSettings /></AdminLayout></AdminGuard></Route>
      <Route path="/admin/results"><AdminGuard><AdminLayout><AdminResults /></AdminLayout></AdminGuard></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;