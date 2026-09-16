import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: string | null;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setIsOver(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) {
    return <div className="text-muted-foreground text-sm">No end date set</div>;
  }

  if (isOver) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-heading font-bold text-accent animate-pulse">Election Closed</h3>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl font-bold text-primary/50 mb-6">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-2xl font-bold text-primary/50 mb-6">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl font-bold text-primary/50 mb-6">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-16 h-16 md:w-20 md:h-20 glass-card rounded-xl flex items-center justify-center border-t border-t-white/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
      >
        <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}
