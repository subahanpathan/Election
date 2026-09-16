import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background">
      {/* Deep space base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background via-background to-black opacity-80" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -70, 70, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]"
      />
      
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [0.8, 1, 1.2, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-yellow-500/5 blur-[80px]"
      />
      
      <motion.div
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 60, -60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] right-[30%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[90px]"
      />
    </div>
  );
}
