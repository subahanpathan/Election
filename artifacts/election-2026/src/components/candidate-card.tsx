import { Candidate } from "@workspace/api-client-react/src/generated/api.schemas";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, CheckCircle2 } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  showMeter?: boolean;
  percentage?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CandidateCard({ 
  candidate, 
  showMeter = false, 
  percentage = 0,
  isSelected = false,
  onClick
}: CandidateCardProps) {
  const isHeadBoy = candidate.role === 'head_boy';
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl glass-card transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-white/5'
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-20 bg-primary rounded-full p-1">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="h-24 w-full bg-gradient-to-r from-primary/20 to-accent/20 relative">
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="px-6 pb-6 relative pt-12">
        <Avatar className="w-24 h-24 border-4 border-background absolute -top-12 left-6 shadow-xl">
          <AvatarImage src={candidate.photoUrl || ''} alt={candidate.name} className="object-cover" />
          <AvatarFallback className="bg-muted text-xl font-heading">
            {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex justify-between items-start mt-2 mb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-foreground">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.className}</p>
          </div>
          <Badge variant={isHeadBoy ? "default" : "secondary"} className={isHeadBoy ? "bg-primary/20 text-primary border-primary/30" : "bg-accent/20 text-accent border-accent/30"}>
            {isHeadBoy ? "Head Boy" : "Head Girl"}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {candidate.bio || "No biography provided."}
          </p>
          
          {showMeter && (
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Popularity</span>
                <span className="text-primary font-medium">{percentage.toFixed(1)}%</span>
              </div>
              <Progress value={percentage} className="h-1.5 bg-black/40" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
