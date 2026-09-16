import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/protected-route";
import { WelcomeSplash } from "@/components/welcome-splash";

// Pages
import Home from "@/pages/home";
import StudentLogin from "@/pages/student-login";
import AdminLogin from "@/pages/admin-login";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/student-login" component={StudentLogin} />
      <Route path="/admin" component={AdminLogin} />
      
      {/* Student Protected Routes */}
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/candidates"><ProtectedRoute component={Candidates} /></Route>
      <Route path="/vote"><ProtectedRoute component={Vote} /></Route>
      <Route path="/results"><ProtectedRoute component={Results} /></Route>
      
      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard"><ProtectedRoute component={AdminDashboard} adminOnly /></Route>
      <Route path="/admin/candidates"><ProtectedRoute component={AdminCandidates} adminOnly /></Route>
      <Route path="/admin/students"><ProtectedRoute component={AdminStudents} adminOnly /></Route>
      <Route path="/admin/settings"><ProtectedRoute component={AdminSettings} adminOnly /></Route>
      <Route path="/admin/results"><ProtectedRoute component={AdminResults} adminOnly /></Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <AnimatePresence>
            {showSplash && <WelcomeSplash onComplete={() => setShowSplash(false)} />}
          </AnimatePresence>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
