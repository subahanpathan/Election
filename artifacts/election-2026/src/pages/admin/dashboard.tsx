import { useGetResultsSummary, useGetElectionSettings } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Vote, Percent, Clock, Settings, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetResultsSummary();
  const { data: settings, isLoading: settingsLoading } = useGetElectionSettings();

  if (summaryLoading || settingsLoading) return <LoadingScreen />;
  if (!summary || !settings) return null;

  const quickActions = [
    { label: "Manage Candidates", href: "/admin/candidates", icon: Users, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { label: "Manage Students", href: "/admin/students", icon: Users, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { label: "Election Settings", href: "/admin/settings", icon: Settings, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { label: "View Full Results", href: "/admin/results", icon: Activity, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  ];

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-heading font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground mt-2">Manage the election, monitor turnout, and view results.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Students</span>
            </div>
            <p className="text-3xl font-heading font-bold">{summary.totalStudents}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Vote className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Votes Cast</span>
            </div>
            <p className="text-3xl font-heading font-bold">{summary.totalVoted}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                <Percent className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Turnout</span>
            </div>
            <p className="text-3xl font-heading font-bold">{summary.turnoutPercentage.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${settings.isVotingOpen ? 'bg-blue-500/20 border-blue-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                <Clock className={`w-5 h-5 ${settings.isVotingOpen ? 'text-blue-500' : 'text-red-500'}`} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Status</span>
            </div>
            <p className={`text-xl font-heading font-bold ${settings.isVotingOpen ? 'text-blue-500' : 'text-red-500'}`}>
              {settings.isVotingOpen ? "Polls Open" : "Polls Closed"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
        <div>
          <h2 className="text-xl font-heading font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Button key={i} asChild variant="outline" className="h-24 justify-start p-4 glass-card hover:bg-white/5 border-white/10 group">
                  <Link href={action.href}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 border ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-base group-hover:text-primary transition-colors">{action.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-heading font-bold mb-4">Election Details</h2>
          <Card className="glass-card border-white/10 bg-black/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between pb-4 border-b border-white/5">
                <span className="text-muted-foreground">School Name</span>
                <span className="font-medium">{settings.schoolName || "N/A"}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-white/5">
                <span className="text-muted-foreground">Election Name</span>
                <span className="font-medium">{settings.electionName}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-white/5">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">{settings.electionEndDate ? new Date(settings.electionEndDate).toLocaleString() : "Not set"}</span>
              </div>
              <div className="pt-2">
                <Button asChild variant="link" className="px-0 text-primary">
                  <Link href="/admin/settings">Edit Settings →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
