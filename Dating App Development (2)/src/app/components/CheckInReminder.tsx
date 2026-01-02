import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CheckInReminderProps {
  isVisible: boolean;
  onAllGood: () => void;
  onNeedHelp: () => void;
}

export function CheckInReminder({ isVisible, onAllGood, onNeedHelp }: CheckInReminderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-20 left-4 right-4 z-30 max-w-md mx-auto"
        >
          <div 
            className="p-4 rounded-2xl shadow-2xl backdrop-blur-xl border"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B8A7B] to-[#2D9B6E] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm">Check in with us?</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Let us know how your date is going
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={onAllGood}
                className="flex-1 py-2.5 rounded-xl text-white text-sm shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #27AE60 0%, #1B8A7B 100%)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ✓ All Good
              </motion.button>
              <motion.button
                onClick={onNeedHelp}
                className="flex-1 py-2.5 rounded-xl text-white text-sm shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ⚠ Need Help
              </motion.button>
            </div>
          </div>

          {/* Auto-dismiss animation */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-[#1B8A7B]/30 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
