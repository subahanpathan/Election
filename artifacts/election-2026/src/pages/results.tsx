
import { useGetResults, useGetResultsSummary } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/loading";
import { Confetti } from "@/components/confetti";
import { CandidateResult } from "@workspace/api-client-react/src/generated/api.schemas";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { Crown, Trophy, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function Results() {
  const { data: results, isLoading: resultsLoading } = useGetResults();
  const { data: summary, isLoading: summaryLoading } = useGetResultsSummary();

  if (resultsLoading || summaryLoading) return <LoadingScreen />;
  if (!results || !summary) return null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-10">
      <Confetti active={results.isFinalized} duration={10000} />

      <header className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2 ml-1" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary pr-2">Live Updates</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">Election Results</h1>
        {results.isFinalized ? (
          <p className="text-xl text-emerald-400 font-medium max-w-2xl mx-auto">
            The election has concluded. The final results are in!
          </p>
        ) : (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time voting statistics. Results may change until the election is finalized.
          </p>
        )}
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Votes Cast</p>
              <p className="text-4xl font-heading font-bold text-foreground">{results.totalVotes}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <VoteIcon className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Voter Turnout</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-heading font-bold text-foreground">{summary.turnoutPercentage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">({summary.totalVoted}/{summary.totalStudents})</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 bg-black/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <p className={`text-2xl font-heading font-bold ${results.isFinalized ? 'text-emerald-500' : 'text-yellow-500'}`}>
                {results.isFinalized ? 'Finalized' : 'In Progress'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${results.isFinalized ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-yellow-500/20 border-yellow-500/30'}`}>
              <BarChart3 className={`w-6 h-6 ${results.isFinalized ? 'text-emerald-500' : 'text-yellow-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winners Banner if Finalized */}
      {results.isFinalized && results.winner && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="glass-card rounded-3xl p-8 relative overflow-hidden border-yellow-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10" />
          <div className="text-center mb-8 relative z-10">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-gradient-gold">Elected Leaders</h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative z-10">
            {results.winner.headBoy && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-yellow-400 to-amber-600 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <img src={results.winner.headBoy.photoUrl || ""} alt={results.winner.headBoy.name} className="w-full h-full object-cover rounded-full border-4 border-background" />
                </div>
                <h3 className="text-2xl font-bold font-heading">{results.winner.headBoy.name}</h3>
                <p className="text-yellow-500 font-medium">Head Boy</p>
              </div>
            )}
            
            {results.winner.headBoy && results.winner.headGirl && (
              <div className="hidden md:block h-32 w-px bg-white/10" />
            )}
            
            {results.winner.headGirl && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-br from-yellow-400 to-amber-600 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                  <img src={results.winner.headGirl.photoUrl || ""} alt={results.winner.headGirl.name} className="w-full h-full object-cover rounded-full border-4 border-background" />
                </div>
                <h3 className="text-2xl font-bold font-heading">{results.winner.headGirl.name}</h3>
                <p className="text-yellow-500 font-medium">Head Girl</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Detailed Results Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ResultsSection title="Head Boy" data={results.headBoy} color="#6366f1" />
        <ResultsSection title="Head Girl" data={results.headGirl} color="#8b5cf6" />
      </div>
    </div>
  );
}

function ResultsSection({ title, data, color }: { title: string; data: CandidateResult[]; color: string }) {
  const sortedData = [...data].sort((a, b) => b.voteCount - a.voteCount);
  
  return (
    <Card className="glass-card border-white/10 bg-black/20 overflow-hidden">
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <CardHeader>
        <CardTitle className="text-2xl font-heading flex items-center gap-3">
          <span className="p-2 rounded-lg bg-white/5" style={{ color }}><Crown className="w-5 h-5" /></span>
          {title} Race
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Chart */}
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="candidate.name" type="category" width={100} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="voteCount" radius={[0, 4, 4, 0]} barSize={24}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? color : 'rgba(255,255,255,0.1)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-4">
          {sortedData.map((result, idx) => (
            <div key={result.candidate.id} className={`flex items-center gap-4 p-3 rounded-xl ${idx === 0 ? 'bg-white/5 border border-white/10' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-white/5 text-muted-foreground'}`}>
                {idx + 1}
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={result.candidate.photoUrl || ''} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-foreground">{result.candidate.name}</span>
                  <span className="font-bold" style={{ color: idx === 0 ? color : '#fff' }}>
                    {result.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={result.percentage} 
                  className="h-1.5 bg-black/40" 
                  style={idx === 0 ? { '--primary': color } as React.CSSProperties : {}}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{result.voteCount} votes</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick placeholder for Vote icon
function VoteIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 12 2 2 4-4"/>
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
      <path d="M22 19H2"/>
    </svg>
  );
}
