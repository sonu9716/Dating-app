import { motion } from 'motion/react';
import { Profile } from '../types';
import { Button } from './ui/button';

interface MatchNotificationProps {
  profile: Profile;
  currentUser: Profile;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export function MatchNotification({ profile, currentUser, onSendMessage, onKeepSwiping }: MatchNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-[#FF6B6B] to-[#FF6B9D] z-50 flex items-center justify-center px-4"
    >
      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#FFE66D', '#4ECDC4', '#FF6B6B'][i % 3],
            left: `${Math.random() * 100}%`,
            top: '-10%'
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut'
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.h1
          className="text-white text-4xl mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          IT'S A MATCH! 🎉
        </motion.h1>

        <div className="flex items-center justify-center gap-8 mb-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#FFE66D] rounded-full flex items-center justify-center text-2xl">
              ✨
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="text-4xl"
          >
            💕
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-[#FFE66D] rounded-full flex items-center justify-center text-2xl">
              ✨
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white text-xl mb-8"
        >
          You and {profile.name} like each other!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3 max-w-sm mx-auto"
        >
          <Button
            onClick={onSendMessage}
            className="w-full bg-white text-[#FF6B6B] hover:bg-white/90 h-12 rounded-xl"
          >
            Send Message
          </Button>
          <Button
            onClick={onKeepSwiping}
            variant="outline"
            className="w-full border-2 border-white text-white hover:bg-white/10 h-12 rounded-xl"
          >
            Keep Swiping
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
