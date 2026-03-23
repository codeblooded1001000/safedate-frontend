'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MatchCelebrationProps {
  venue: any;
  onContinue: () => void;
}

export function MatchCelebration({ venue, onContinue }: MatchCelebrationProps) {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#FF6B6B', '#FF8E53', '#FFC837', '#764ba2', '#11998e', '#38ef7d'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const imageUrl =
    venue?.photoUrl || `https://picsum.photos/seed/${encodeURIComponent(venue?.id || 'venue')}/400/300`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(20px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="max-w-sm w-full text-center"
      >
        {/* Animated hearts */}
        <div className="relative h-32 mb-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="text-7xl">💜</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="absolute left-1/4 top-0 text-3xl"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute right-1/4 top-4 text-2xl"
          >
            🎉
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute right-1/3 bottom-4 text-2xl"
          >
            💫
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-white mb-3"
        >
          It&apos;s a date!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl mb-8"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          You both picked{' '}
          <span className="font-semibold" style={{ color: '#FF6B6B' }}>{venue?.name}</span>
        </motion.p>

        {/* Venue preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl overflow-hidden mb-8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="h-32 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={venue?.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 text-left">
            <p className="text-white font-semibold">{venue?.name}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{venue?.area || venue?.address}</p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="w-full py-5 rounded-2xl bg-gradient-primary text-white font-bold text-lg"
          style={{ boxShadow: '0 8px 32px rgba(255,107,107,0.3)' }}
        >
          Plan the details 📅
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
