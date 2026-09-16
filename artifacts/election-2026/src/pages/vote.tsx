import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCandidates, useCastVote, useGetElectionSettings } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/candidate-card";
import { LoadingScreen } from "@/components/loading";
import { Confetti } from "@/components/confetti";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Vote as VoteIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Vote() {
  const { student, hasVoted, setHasVoted } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: candidates, isLoading: candidatesLoading } = useGetCandidates();
  const { data: settings, isLoading: settingsLoading } = useGetElectionSettings();
  const castVoteMutation = useCastVote();

  const [step, setStep] = useState(1);
  const [selectedBoy, setSelectedBoy] = useState<number | null>(null);
  const [selectedGirl, setSelectedGirl] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  if (candidatesLoading || settingsLoading) return <LoadingScreen />;

  if (!settings?.isVotingOpen) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full p-8 rounded-3xl text-center border-destructive/30">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">Voting is Closed</h2>
          <p className="text-muted-foreground mb-6">The election polls are currently not accepting votes.</p>
          <Button asChild className="w-full"><Link href="/dashboard">Return to Dashboard</Link></Button>
        </motion.div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg w-full p-8 rounded-3xl text-center border-emerald-500/30">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">You've Already Voted</h2>
          <p className="text-muted-foreground mb-6">Thank you for participating! You cannot vote more than once.</p>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1"><Link href="/dashboard">Dashboard</Link></Button>
            <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"><Link href="/results">View Results</Link></Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const headBoys = candidates?.filter(c => c.role === 'head_boy') || [];
  const headGirls = candidates?.filter(c => c.role === 'head_girl') || [];

  const handleConfirmVote = () => {
    if (!student || !selectedBoy || !selectedGirl) return;

    castVoteMutation.mutate(
      { 
        data: { 
          studentId: student.id,
          headBoyCandidateId: selectedBoy,
          headGirlCandidateId: selectedGirl
        } 
      },
      {
        onSuccess: () => {
          setVerificationId("VS-" + student.id + "-" + String(Date.now()).slice(-6));
          setShowConfirm(false);
          setShowSuccess(true);
          setHasVoted(true);
        },
        onError: (err: any) => {
          setShowConfirm(false);
          toast({
            title: "Voting Failed",
            description: err.message || "An error occurred while casting your vote.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const boyCandidate = candidates?.find(c => c.id === selectedBoy);
  const girlCandidate = candidates?.find(c => c.id === selectedGirl);

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Confetti active={true} duration={5000} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ type: "spring", bounce: 0.5 }}
          className="glass-card max-w-xl w-full p-8 md:p-12 rounded-3xl border-primary/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <ShieldCheck className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-heading font-bold mb-2 text-gradient">VOTE CONFIRMED</h2>
            <p className="text-muted-foreground">
              Thank you for participating in the democratic process.
            </p>
          </div>

          <div className="bg-black/40 rounded-2xl p-6 border border-white/10 font-mono text-sm space-y-3 mb-8 relative z-10">
            <div className="text-center text-white/40 text-xs mb-4">━━━ DIGITAL VOTE RECEIPT ━━━</div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/50">Election:</span>
              <span className="text-white text-right font-medium">{settings?.electionName || "Student Council Election 2026"}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/50">School:</span>
              <span className="text-white text-right font-medium">{settings?.schoolName || "Academy"}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/50">Voter:</span>
              <span className="text-white text-right font-medium">{student?.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/50">Student ID:</span>
              <span className="text-white text-right font-medium">{student?.studentId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-white/50">Date &amp; Time:</span>
              <span className="text-white text-right font-medium">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-white/50">Verification ID:</span>
              <span className="text-primary font-bold">{verificationId}</span>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-white/40 text-xs text-center leading-relaxed">
              This receipt confirms your participation. Your vote is anonymous and secure.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-xl bg-white/5 border-white/10">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild size="lg" className="flex-1 bg-primary hover:bg-primary/90 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Link href="/results">View Live Results</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Cast Your Vote</h1>
          <div className="text-sm font-medium text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
            Step {step} of 2
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: "50%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Alert className="bg-primary/10 border-primary/20">
              <VoteIcon className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary font-medium">Select Head Boy</AlertTitle>
              <AlertDescription className="text-primary/80">Choose exactly one candidate for the position of Head Boy.</AlertDescription>
            </Alert>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {headBoys.map(candidate => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  isSelected={selectedBoy === candidate.id}
                  onClick={() => setSelectedBoy(candidate.id)}
                />
              ))}
            </div>
            
            <div className="flex justify-end pt-6">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!selectedBoy}
                size="lg"
                className="rounded-xl px-8"
              >
                Next: Head Girl <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <Alert className="bg-accent/10 border-accent/20">
              <VoteIcon className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent font-medium">Select Head Girl</AlertTitle>
              <AlertDescription className="text-accent/80">Choose exactly one candidate for the position of Head Girl.</AlertDescription>
            </Alert>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {headGirls.map(candidate => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  isSelected={selectedGirl === candidate.id}
                  onClick={() => setSelectedGirl(candidate.id)}
                />
              ))}
            </div>
            
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline"
                onClick={() => setStep(1)} 
                size="lg"
                className="rounded-xl px-8 border-white/10 bg-white/5"
              >
                Back
              </Button>
              <Button 
                onClick={() => setShowConfirm(true)} 
                disabled={!selectedGirl}
                size="lg"
                className="rounded-xl px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                Review & Submit <CheckCircle2 className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-bold flex items-center gap-2">
              <AlertCircle className="text-primary w-6 h-6" /> Confirm Your Vote
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-2">
              Please review your choices. Once submitted, your vote cannot be changed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                <span className="text-lg font-bold text-primary">HB</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Head Boy</p>
                <p className="font-bold text-lg text-foreground">{boyCandidate?.name}</p>
              </div>
            </div>
            
            <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shrink-0">
                <span className="text-lg font-bold text-accent">HG</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Head Girl</p>
                <p className="font-bold text-lg text-foreground">{girlCandidate?.name}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="rounded-xl bg-white/5 border-white/10">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmVote} 
              disabled={castVoteMutation.isPending}
              className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {castVoteMutation.isPending ? "Submitting..." : "Confirm & Cast Vote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
