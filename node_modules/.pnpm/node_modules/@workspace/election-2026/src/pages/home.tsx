import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetElectionSettings, useGetResultsSummary, useGetCandidates } from "@workspace/api-client-react";
import { AnimatedBackground } from "@/components/animated-background";
import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/loading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Crown,
  Vote,
  ShieldAlert,
  Users,
  Gauge,
  ChevronDown,
  ShieldCheck,
  Eye,
  Clock,
  Trophy,
  Star,
} from "lucide-react";

export default function Home() {
  const { data: settings, isLoading } = useGetElectionSettings();
  const { data: resultsSummary, isLoading: summaryLoading } = useGetResultsSummary();
  const { data: candidates, isLoading: candidatesLoading } = useGetCandidates();

  if (isLoading || summaryLoading || candidatesLoading) return <LoadingScreen />;

  const turnout = resultsSummary?.turnoutPercentage || 0;
  const schoolName = settings?.schoolName || "Academy";

  return (
    <div className="scroll-smooth relative overflow-hidden bg-background">
      <AnimatedBackground />
      
      <section id="hero" className="min-h-[100dvh] flex flex-col items-center justify-center relative">
        <main className="text-center max-w-5xl mx-auto px-4 py-20 relative z-10 w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl glass-card backdrop-blur-xl mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)] mx-auto">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  filter: [
                    'drop-shadow(0 0 6px rgba(99,102,241,0.3))',
                    'drop-shadow(0 0 16px rgba(99,102,241,0.6))',
                    'drop-shadow(0 0 6px rgba(99,102,241,0.3))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crown className="w-5 h-5 text-primary mr-3" />
              </motion.div>
              <span className="text-sm font-medium tracking-widest text-primary/80 uppercase">
                {schoolName} · VoteSphere
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-heading font-black text-gradient-gold mb-2">
              {schoolName}
            </h2>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground tracking-tight leading-tight mb-4">
              {settings?.electionName || "Student Leader Election 2026"}
            </h1>
            
            <p className="italic text-muted-foreground mb-8">
              {settings?.welcomeMessage || "Building Leaders For Tomorrow"}
            </p>

            <div className="py-4 mb-10 w-full max-w-lg">
              <Countdown targetDate={settings?.electionEndDate || null} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                <Link href="/student-login">
                  <Vote className="w-5 h-5 mr-2" />
                  Cast Your Vote
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-foreground backdrop-blur-md">
                <Link href="/admin">
                  <ShieldAlert className="w-5 h-5 mr-2" />
                  Admin Portal
                </Link>
              </Button>
            </div>

            {/* Live Election Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-xl">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Registered Students</h3>
                <p className="text-2xl font-bold">{resultsSummary?.totalStudents || 0}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-xl">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Candidates</h3>
                <p className="text-2xl font-bold">{candidates?.length || 0}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-xl">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                  <Vote className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Election Status</h3>
                <div className="mt-1">
                  {resultsSummary?.isVotingOpen ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30">OPEN</span>
                  ) : (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs font-semibold border border-rose-500/30">CLOSED</span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center shadow-xl">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                  <Gauge className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Voting Progress</h3>
                <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${turnout}%` }}
                    transition={{ duration: 1 }}
                    className="bg-amber-400 h-full rounded-full"
                  />
                </div>
                <p className="text-xs font-medium text-white/80">{Math.round(turnout)}% Turnout</p>
              </div>
            </div>
          </motion.div>
        </main>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 text-white/50 relative z-10"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="glass-card p-12 rounded-3xl flex items-center justify-center relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute inset-0 bg-primary/5" />
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 10px rgba(99,102,241,0.3))",
                  "drop-shadow(0 0 30px rgba(99,102,241,0.6))",
                  "drop-shadow(0 0 10px rgba(99,102,241,0.3))",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-24 h-24 text-primary relative z-10" />
            </motion.div>
          </div>

          <div className="space-y-6">
            <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full">
              About
            </span>
            <h2 className="text-3xl font-heading font-bold text-foreground">What is VoteSphere?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              VoteSphere is the official student election management system of {schoolName}. It is a secure, transparent, and modern platform where every eligible student can exercise their democratic right to choose their school leaders.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Tamper-proof voting</h4>
                  <p className="text-sm text-muted-foreground">End-to-end encryption ensures every vote counts exactly as cast.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Transparent process</h4>
                  <p className="text-sm text-muted-foreground">Clear visibility into candidates, timelines, and election status.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Real-time results</h4>
                  <p className="text-sm text-muted-foreground">Instant tallying and live result dashboards upon election close.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY VOTE */}
      <section id="why-vote" className="py-24 bg-white/[0.02] border-y border-white/5 text-center relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm bg-amber-500/10 px-3 py-1 rounded-full mb-6 inline-block">
            Why Vote
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">
            Your Vote Shapes Our School
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors glass-card flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Shape the Future</h3>
              <p className="text-muted-foreground">
                Elect leaders who share your vision. Your vote directly impacts the initiatives that will define the upcoming academic year.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors glass-card flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Build Community</h3>
              <p className="text-muted-foreground">
                Strong leaders foster an inclusive environment. Participate to ensure representation that brings students together.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors glass-card flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Set Standards</h3>
              <p className="text-muted-foreground">
                Demonstrate responsibility and civic duty. Establish the standard of engagement expected of {schoolName} students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE CANDIDATES */}
      <section id="candidates" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
              Meet The Candidates
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Your Candidates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {candidates?.map((candidate, i) => {
              const isHeadBoy = candidate.role === "head_boy";
              const initials = candidate.name
                .split(" ")
                .map(p => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden"
                >
                  <Avatar className="w-20 h-20 mb-4 border-2 border-background/50 shadow-lg">
                    <AvatarImage src={candidate.photoUrl || ""} />
                    <AvatarFallback style={{ backgroundColor: candidate.color || "var(--color-primary)" }} className="text-white font-bold text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{candidate.name}</h3>
                  <div className="mb-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isHeadBoy ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                      {isHeadBoy ? "Head Boy" : "Head Girl"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{candidate.className}</p>
                  {candidate.promises && candidate.promises.length > 0 && (
                    <p className="text-xs italic text-white/70 mb-6 flex-1">"{candidate.promises[0]}"</p>
                  )}
                  <div className="mt-auto w-full pt-4">
                    <Button asChild variant="outline" size="sm" className="w-full border-white/10 hover:bg-white/5">
                      <Link href="/candidates">View Profile</Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="py-24 px-4 bg-white/[0.01] border-y border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-violet-400 font-bold tracking-wider uppercase text-sm bg-violet-400/10 px-3 py-1 rounded-full mb-6 inline-block">
            Timeline
          </span>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-16">
            Election Schedule
          </h2>

          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-auto before:mr-auto before:h-full before:w-0.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:bg-white/10 before:z-0 py-4">
            <div className="relative z-10 flex items-center justify-center">
              <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 border-4 border-background">
                <Crown className="w-5 h-5" />
              </div>
              <div className="absolute w-full flex justify-center mt-20">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 w-64">
                  <h3 className="font-bold text-emerald-400">Nomination Period</h3>
                  <p className="text-xs text-muted-foreground mt-1">Candidates submit their applications</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center pt-24">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 border-4 border-background relative">
                <span className="absolute w-full h-full rounded-full bg-primary/40 animate-ping" />
                <Users className="w-5 h-5 relative z-10" />
              </div>
              <div className="absolute w-full flex justify-center mt-44">
                <div className="bg-black/60 backdrop-blur-md border border-primary/30 rounded-xl p-4 w-64 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                  <h3 className="font-bold text-primary">Campaign Period</h3>
                  <p className="text-xs text-muted-foreground mt-1">Students present their platforms</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center pt-24">
              <div className="bg-muted text-muted-foreground w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-background">
                <Vote className="w-5 h-5" />
              </div>
              <div className="absolute w-full flex justify-center mt-44">
                <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-xl p-4 w-64 text-opacity-50">
                  <h3 className="font-bold text-white/50">Voting Day</h3>
                  <p className="text-xs text-white/40 mt-1">
                    {settings?.electionEndDate ? new Date(settings.electionEndDate).toLocaleDateString() : "Date TBD"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pb-20" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm bg-emerald-400/10 px-3 py-1 rounded-full mb-4 inline-block">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="glass-card px-6 rounded-xl border-white/10 bg-black/20">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                Who is eligible to vote?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                All registered students of {schoolName} with a valid Student ID are eligible to vote.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="glass-card px-6 rounded-xl border-white/10 bg-black/20">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                Can I change my vote after submitting?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No. Once submitted, your vote is final and cannot be changed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="glass-card px-6 rounded-xl border-white/10 bg-black/20">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                How is vote secrecy maintained?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Your vote is completely anonymous. The system records that you voted but never links your identity to a specific candidate.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="glass-card px-6 rounded-xl border-white/10 bg-black/20">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                What is the digital vote receipt?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                After voting, you receive a unique verification code confirming your participation without revealing who you voted for.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="glass-card px-6 rounded-xl border-white/10 bg-black/20">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary">
                When will results be announced?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Results will be available once the voting period closes and the administrator finalizes the count.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-black/40 border-t border-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-xl">VoteSphere</span>
            </div>
            <p className="text-muted-foreground text-sm">by {schoolName}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/results" className="hover:text-primary transition-colors">Results</Link>
              <Link href="/candidates" className="hover:text-primary transition-colors">Candidates</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Election Info</h4>
            <p className="text-sm text-muted-foreground mb-3">{settings?.electionName}</p>
            <div className="inline-block">
              {resultsSummary?.isVotingOpen ? (
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium border border-emerald-500/20">
                  Voting is Open
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium border border-red-500/20">
                  Voting is Closed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {schoolName} · VoteSphere Election Management System · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}