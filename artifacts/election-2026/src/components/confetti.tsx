import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const colors = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"];

export function Confetti({ active = false, duration = 3000 }: { active?: boolean; duration?: number }) {
  const [pieces, setPieces] = useState<{ id: number; x: number; y: number; color: string; rotation: number }[]>([]);

  useEffect(() => {
    if (!active) return;
    
    // Generate confetti pieces
    const newPieces = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -10 - Math.random() * 20, // start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));
    
    setPieces(newPieces);
    
    const timer = setTimeout(() => {
      setPieces([]);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            x: `${piece.x}vw`, 
            y: `${piece.y}vh`,
            rotate: piece.rotation,
            opacity: 1
          }}
          animate={{ 
            y: "110vh",
            rotate: piece.rotation + (Math.random() * 360 * 2), // Spin on the way down
            opacity: [1, 1, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
