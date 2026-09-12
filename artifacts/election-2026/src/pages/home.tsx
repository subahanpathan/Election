import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetElectionSettings } from "@workspace/api-client-react";
import { AnimatedBackground } from "@/components/animated-background";
import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/loading";
import { Crown, Vote, ShieldAlert } from "lucide-react";

export default function Home() {
  const { data: settings, isLoading } = useGetElectionSettings();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      <AnimatedBackground />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <Crown className="w-8 h-8 text-primary mr-3" />
            <span className="text-sm font-medium tracking-widest text-primary/80 uppercase">
              {settings?.schoolName || "Academy"}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground tracking-tight leading-tight">
            {settings?.electionName || "Student Leader Election 2026"}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {settings?.welcomeMessage || "Cast your vote for the next generation of student leadership. Every vote counts in shaping our future."}
          </p>

          <div className="py-8">
            <Countdown targetDate={settings?.electionEndDate || null} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
              <Link href="/login">
                <Vote className="w-5 h-5 mr-2" />
                Cast Your Vote
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-foreground backdrop-blur-md">
              <Link href="/admin/login">
                <ShieldAlert className="w-5 h-5 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 py-6 text-center text-sm text-muted-foreground border-t border-white/5 bg-background/40 backdrop-blur-md">
        <p>Secure Voting Platform &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
