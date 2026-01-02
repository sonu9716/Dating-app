import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { DateSession } from '../types';

interface EndDateSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback?: { rating: string; wouldDateAgain: string }) => void;
  session: DateSession;
}

export function EndDateSession({ isOpen, onClose, onConfirm, session }: EndDateSessionProps) {
  const [rating, setRating] = useState<string | null>(null);
  const [wouldDateAgain, setWouldDateAgain] = useState<string | null>(null);

  const duration = Math.floor((Date.now() - session.startTime.getTime()) / 60000);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  const handleConfirm = () => {
    onConfirm(rating && wouldDateAgain ? { rating, wouldDateAgain } : undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-hidden"
          >
            <div className="bg-background rounded-t-3xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3>End Date Session?</h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh] p-4 space-y-6">
                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-[#27AE60]/10 to-[#1B8A7B]/10 border border-[#27AE60]/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={session.matchProfile.photos[0]} 
                      alt={session.matchProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4>{session.matchProfile.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {session.location}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#27AE60] flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      Duration: {hours > 0 ? `${hours}h ` : ''}{minutes}min
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-[#27AE60]">
                    <CheckCircle className="w-4 h-4" />
                    <span>You're safe ✓</span>
                  </div>
                </motion.div>

                {/* Optional Feedback */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-sm mb-3">How was your date? (Optional)</h4>
                  <div className="flex gap-3 justify-center mb-4">
                    {[
                      { emoji: '🔥', label: 'Amazing' },
                      { emoji: '😊', label: 'Good' },
                      { emoji: '😕', label: 'Meh' }
                    ].map((option) => (
                      <motion.button
                        key={option.label}
                        onClick={() => setRating(option.label)}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                          rating === option.label
                            ? 'border-[#1B8A7B] bg-[#1B8A7B]/5'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-3xl mb-1">{option.emoji}</div>
                        <div className="text-xs">{option.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-sm mb-3">Would you date them again?</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['Yes', 'No', 'Undecided'].map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => setWouldDateAgain(option)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          wouldDateAgain === option
                            ? 'border-[#1B8A7B] bg-[#1B8A7B]/5'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <motion.button
                  onClick={handleConfirm}
                  className="w-full py-3 rounded-xl text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  End & Leave
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  Keep Safety Mode On
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}