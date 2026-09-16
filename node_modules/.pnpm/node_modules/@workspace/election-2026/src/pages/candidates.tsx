import { useState } from "react";
import { useGetCandidates, useGetResults } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/loading";
import { CandidateCard } from "@/components/candidate-card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Target, Heart } from "lucide-react";
import { Candidate } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Candidates() {
  const { data: candidates, isLoading } = useGetCandidates();
  const { data: results } = useGetResults();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filter, setFilter] = useState<'all' | 'head_boy' | 'head_girl'>('all');

  if (isLoading) return <LoadingScreen />;

  const filteredCandidates = candidates?.filter(c => filter === 'all' || c.role === filter) || [];

  const getCandidatePercentage = (candidateId: number) => {
    if (!results) return 0;
    const allResults = [...results.headBoy, ...results.headGirl];
    const match = allResults.find(r => r.candidate.id === candidateId);
    return match ? match.percentage : 0;
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Candidate Profiles</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Learn more about the individuals running for student leadership. Read their biographies and campaign promises before making your decision.
          </p>
        </div>
        
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/10">
          <Button 
            variant={filter === 'all' ? 'default' : 'ghost'} 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-white/10' : 'hover:bg-white/5'}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={filter === 'head_boy' ? 'default' : 'ghost'} 
            onClick={() => setFilter('head_boy')}
            className={filter === 'head_boy' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'hover:bg-white/5'}
            size="sm"
          >
            Head Boy
          </Button>
          <Button 
            variant={filter === 'head_girl' ? 'default' : 'ghost'} 
            onClick={() => setFilter('head_girl')}
            className={filter === 'head_girl' ? 'bg-accent/20 text-accent hover:bg-accent/30' : 'hover:bg-white/5'}
            size="sm"
          >
            Head Girl
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCandidates.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <CandidateCard 
                candidate={candidate} 
                showMeter={!!results}
                percentage={getCandidatePercentage(candidate.id)}
                onClick={() => setSelectedCandidate(candidate)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent className="glass-card sm:max-w-2xl border-white/10 p-0 overflow-hidden">
          {selectedCandidate && (
            <>
              <div className={`h-32 w-full bg-gradient-to-r relative ${selectedCandidate.role === 'head_boy' ? 'from-primary/30 to-blue-600/30' : 'from-accent/30 to-fuchsia-600/30'}`}>
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              <div className="px-6 pb-8 pt-0 relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background absolute -top-12 left-6 bg-muted flex items-center justify-center text-2xl font-heading shadow-xl">
                  {selectedCandidate.photoUrl ? (
                    <img src={selectedCandidate.photoUrl} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedCandidate.name.substring(0, 2)}</span>
                  )}
                </div>
                
                <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <DialogTitle className="text-3xl font-heading font-bold text-foreground">
                      {selectedCandidate.name}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">
                      Class {selectedCandidate.className}
                    </DialogDescription>
                  </div>
                  <Badge className={`text-sm px-3 py-1 ${selectedCandidate.role === 'head_boy' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-accent/20 text-accent border-accent/30'}`}>
                    {selectedCandidate.role === 'head_boy' ? 'Head Boy Candidate' : 'Head Girl Candidate'}
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
                      <User className="w-4 h-4" /> Biography
                    </h4>
                    <p className="text-foreground/90 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                      {selectedCandidate.bio || "No biography provided."}
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4" /> Campaign Promises
                    </h4>
                    <ul className="space-y-3">
                      {selectedCandidate.promises && selectedCandidate.promises.length > 0 ? (
                        selectedCandidate.promises.map((promise, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${selectedCandidate.role === 'head_boy' ? 'text-primary' : 'text-accent'}`} />
                            <span className="text-foreground/90">{promise}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground italic px-3">No specific promises listed.</li>
                      )}
                    </ul>
                  </section>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <DialogClose asChild>
                    <Button variant="outline" className="bg-white/5 hover:bg-white/10 border-white/10">
                      Close Profile
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Quick component for the bio icon since it wasn't imported from lucide
function User(props: any) {
  return <Heart {...props} />; // Placeholder
}
