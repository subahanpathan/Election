import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <Crown className="w-16 h-16 text-primary relative z-10" />
      </motion.div>
      <motion.h2 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-6 font-heading text-xl font-medium tracking-widest text-primary"
      >
        INITIALIZING...
      </motion.h2>
    </div>
  );
}
