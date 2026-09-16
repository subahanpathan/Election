import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, GraduationCap, Users, Award, Vote, Sparkles } from 'lucide-react';

const SCENE_DURATIONS = [2500, 3000, 2500, 2500, 2500, 2500];

export function WelcomeSplash({ onComplete }: { onComplete: () => void }) {
  const [scene, setScene] = useState(0);
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState<number | null>(3);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (scene < SCENE_DURATIONS.length) {
      const timer = setTimeout(() => setScene((s) => s + 1), SCENE_DURATIONS[scene]);
      return () => clearTimeout(timer);
    }
    if (scene === 6) {
      setCount(3);
      const to2 = setTimeout(() => setCount(2), 1000);
      const to1 = setTimeout(() => setCount(1), 2000);
      const flash = setTimeout(() => setCount(null), 3000);
      const hide = setTimeout(() => {
        setVisible(false);
        onCompleteRef.current();
      }, 3500);
      return () => {
        clearTimeout(to2);
        clearTimeout(to1);
        clearTimeout(flash);
        clearTimeout(hide);
      };
    }
  }, [scene]);

  if (!visible) return null;

  const pillars = [
    { icon: Crown, label: 'Leadership', color: 'text-yellow-400', bg: 'bg-yellow-400/10', shadow: 'shadow-yellow-400/30' },
    { icon: GraduationCap, label: 'Education', color: 'text-blue-400', bg: 'bg-blue-400/10', shadow: 'shadow-blue-400/30' },
    { icon: Users, label: 'Teamwork', color: 'text-violet-400', bg: 'bg-violet-400/10', shadow: 'shadow-violet-400/30' },
    { icon: Award, label: 'Excellence', color: 'text-amber-400', bg: 'bg-amber-400/10', shadow: 'shadow-amber-400/30' },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#000010] flex items-center justify-center pointer-events-none"
    >
      {/* Radial white glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none mix-blend-screen" />

      <AnimatePresence mode="wait">
        {scene === 0 && (
          <motion.div
            key="scene1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(245,158,11,0.3))',
                  'drop-shadow(0 0 30px rgba(245,158,11,0.8))',
                  'drop-shadow(0 0 10px rgba(245,158,11,0.3))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Crown className="w-20 h-20 text-amber-500" />
            </motion.div>
            <div className="flex space-x-2">
              {'WELCOME TO'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="font-heading tracking-[0.3em] text-white/60 text-sm font-medium"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {scene === 1 && (
          <motion.div
            key="scene2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex flex-col items-center justify-center text-center"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight],
                  opacity: [0, 0.8, 0],
                  scale: [0, Math.random() * 2 + 1, 0],
                }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              />
            ))}
            <div className="flex flex-col items-center justify-center space-y-2 z-10">
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-8xl font-heading font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent"
              >
                IDEAL
              </motion.h1>
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-7xl font-heading font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent"
              >
                ENGLISH
              </motion.h1>
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-5xl md:text-8xl font-heading font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent"
              >
                SCHOOL
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 italic text-white/70 tracking-widest text-sm md:text-base font-light"
              >
                Empowering Future Leaders
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col items-center mt-4"
              >
                <div className="w-24 h-px bg-white/20 mx-auto my-2" />
                <h2 className="font-heading font-black text-2xl md:text-4xl text-primary" style={{ textShadow: '0 0 20px rgba(99,102,241,0.8)' }}>
                  VoteSphere
                </h2>
                <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-1">Student Election Management System</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {scene === 2 && (
          <motion.div
            key="scene3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          >
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-br from-[#000010] via-indigo-950/20 to-[#000010] bg-[length:200%_200%]"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-8xl md:text-[10rem] font-black text-primary pointer-events-none select-none">2026</span>
            </motion.div>
            <div className="z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'circOut' }}
                className="h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6"
              />
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-5xl font-heading text-white font-bold tracking-tight mb-4"
              >
                STUDENT COUNCIL ELECTION
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/60 italic font-light tracking-wide"
              >
                Shaping Tomorrow's Leaders Today
              </motion.p>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'circOut', delay: 0.2 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-6"
              />
            </div>
          </motion.div>
        )}

        {scene === 3 && (
          <motion.div
            key="scene4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          `0 0 0px ${pillar.shadow}`,
                          `0 0 30px ${pillar.shadow}`,
                          `0 0 0px ${pillar.shadow}`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${pillar.bg} flex items-center justify-center mb-6`}
                    >
                      <Icon className={`w-10 h-10 md:w-12 md:h-12 ${pillar.color}`} />
                    </motion.div>
                    <span className="text-white/80 font-heading tracking-widest text-sm uppercase">{pillar.label}</span>
                  </motion.div>
                );
              })}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/40 tracking-[0.2em] text-xs uppercase"
            >
              The Pillars of Our Community
            </motion.p>
          </motion.div>
        )}

        {scene === 4 && (
          <motion.div
            key="scene5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full text-center"
          >
            <div className="relative mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(250,204,21,0.3)_360deg)] rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-6 relative z-10"
              >
                <Crown className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                <Vote className="w-12 h-12 text-violet-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
              </motion.div>
            </div>
            <div className="space-y-4">
              {[
                { text: 'YOUR VOTE.', color: 'text-yellow-400' },
                { text: 'YOUR VOICE.', color: 'text-indigo-400' },
                { text: 'YOUR FUTURE.', color: 'text-violet-400' },
              ].map((phrase, i) => (
                <motion.div
                  key={phrase.text}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`text-3xl md:text-6xl font-heading font-black ${phrase.color} tracking-tight`}
                >
                  {phrase.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {scene === 5 && (
          <motion.div
            key="scene6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
          >
            <motion.div
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_200%]"
            />
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl md:text-7xl font-heading font-black text-white mb-2"
              >
                Your Voice. Your Leadership.
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-7xl font-heading font-black bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent relative inline-block"
              >
                Your Future.
                <motion.div
                  animate={{ rotate: 180, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-10 text-yellow-400"
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {scene === 6 && (
          <motion.div
            key="scene7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center bg-black relative"
          >
            <AnimatePresence mode="wait">
              {count === 3 && (
                <motion.div
                  key="count3"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-[12rem] md:text-[18rem] font-black text-white leading-none select-none"
                >
                  3
                </motion.div>
              )}
              {count === 2 && (
                <motion.div
                  key="count2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-[12rem] md:text-[18rem] font-black text-primary leading-none select-none"
                >
                  2
                </motion.div>
              )}
              {count === 1 && (
                <motion.div
                  key="count1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-[12rem] md:text-[18rem] font-black text-amber-500 leading-none select-none"
                >
                  1
                </motion.div>
              )}
              {count === null && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}