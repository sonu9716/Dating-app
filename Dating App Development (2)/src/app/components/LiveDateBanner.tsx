import { motion } from 'motion/react';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';
import { DateSession } from '../types';
import { useState, useEffect } from 'react';

interface LiveDateBannerProps {
  session: DateSession;
  onReportIssue: () => void;
  onGetHelp: () => void;
}

export function LiveDateBanner({ session, onReportIssue, onGetHelp }: LiveDateBannerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - session.startTime.getTime();
      setElapsed(Math.floor(diff / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}` : `${mins}min`;
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed top-0 left-0 right-0 z-40 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #1B8A7B 0%, #2D9B6E 100%)',
        backgroundSize: '200% 200%'
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1B8A7B 0%, #2D9B6E 50%, #1B8A7B 100%)',
          backgroundSize: '200% 200%'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="relative z-10 flex items-center justify-between p-4 max-w-2xl mx-auto">
        {/* Left: Status */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="text-white">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Date in progress</span>
              <span className="text-white/80">•</span>
              <span className="text-white/90">You're protected</span>
            </div>
            <div className="text-xs text-white/70 flex items-center gap-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-white/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {formatTime(elapsed)} elapsed
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Issue Button */}
          <motion.button
            onClick={onReportIssue}
            className="px-3 py-2 rounded-lg border-2 border-white/30 text-white text-sm flex items-center gap-1.5 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ 
              scale: 0.95,
              backgroundColor: 'rgba(232, 168, 55, 0.3)'
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Issue</span>
          </motion.button>

          {/* Get Help Button */}
          <motion.button
            onClick={onGetHelp}
            className="px-4 py-2 rounded-lg text-[#1B8A7B] text-sm flex items-center gap-1.5 shadow-lg"
            style={{
              background: 'white'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
            whileTap={{ 
              scale: 0.95
            }}
            animate={{
              boxShadow: [
                '0 4px 12px rgba(0,0,0,0.1)',
                '0 6px 16px rgba(232,168,55,0.3)',
                '0 4px 12px rgba(0,0,0,0.1)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Get Help</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom progress line */}
      <motion.div
        className="h-0.5 bg-white/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: session.duration * 60,
          ease: 'linear'
        }}
        style={{
          transformOrigin: 'left'
        }}
      />
    </motion.div>
  );
}
