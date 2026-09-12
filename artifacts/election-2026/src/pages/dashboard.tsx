import { useGetCandidates, useGetElectionSettings } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/loading";
import { Countdown } from "@/components/countdown";
import { CandidateCard } from "@/components/candidate-card";
import { Vote, Users } from "lucide-react";

export default function Dashboard() {
  const { data: candidates, isLoading: candidatesLoading } = useGetCandidates();
  const { data: settings, isLoading: settingsLoading } = useGetElectionSettings();

  if (candidatesLoading || settingsLoading) return <LoadingScreen />;

  const headBoys = candidates?.filter(c => c.role === 'head_boy') || [];
  const headGirls = candidates?.filter(c => c.role === 'head_girl') || [];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Student <span className="text-primary">Election</span> Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Review the candidates and cast your vote</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel px-6 py-4 rounded-2xl"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Time Remaining</p>
          <Countdown targetDate={settings?.electionEndDate || null} />
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[60px]" />
        
        <Vote className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="text-2xl font-heading font-bold mb-2">Ready to make your voice heard?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Review the candidates' profiles and campaign promises before casting your final vote for Head Boy and Head Girl.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Link href="/vote">Cast Your Vote Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl bg-white/5 border-white/10 hover:bg-white/10">
            <Link href="/candidates">
              <Users className="w-5 h-5 mr-2" />
              Review Candidates
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            Head Boy Candidates
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {headBoys.map((candidate, i) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CandidateCard candidate={candidate} />
              </motion.div>
            ))}
            {headBoys.length === 0 && (
              <p className="text-muted-foreground italic col-span-2">No candidates available.</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-accent rounded-full" />
            Head Girl Candidates
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {headGirls.map((candidate, i) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CandidateCard candidate={candidate} />
              </motion.div>
            ))}
            {headGirls.length === 0 && (
              <p className="text-muted-foreground italic col-span-2">No candidates available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}