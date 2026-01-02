import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Phone, MapPin, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { EmergencyContact } from '../types';

interface EmergencyHelpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  emergencyContacts: EmergencyContact[];
}

export function EmergencyHelp({ isOpen, onClose, onConfirm, emergencyContacts }: EmergencyHelpProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notificationTime, setNotificationTime] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showSuccess) {
      const interval = setInterval(() => {
        setNotificationTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showSuccess]);

  const handlePressStart = () => {
    setIsHolding(true);
    setProgress(0);

    // Progress animation
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressTimerRef.current!);
        handleConfirmEmergency();
      }
    }, 50);
  };

  const handlePressEnd = () => {
    setIsHolding(false);
    setProgress(0);
    
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
  };

  const handleConfirmEmergency = () => {
    setShowSuccess(true);
    onConfirm();
  };

  const handleEndSession = () => {
    onClose();
    setShowSuccess(false);
    setNotificationTime(0);
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
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {!showSuccess ? (
              /* Confirmation Screen */
              <div className="w-full max-w-md text-center">
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                <h3 className="text-white mb-2">Need Help?</h3>
                <p className="text-white/80 mb-8">
                  Hold the button to notify your emergency contacts
                </p>

                {/* Hold Button */}
                <div className="relative flex items-center justify-center mb-8">
                  {/* Countdown Ring */}
                  <svg className="absolute w-48 h-48 -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="url(#emergencyGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                      style={{
                        transition: 'stroke-dashoffset 0.05s linear'
                      }}
                    />
                    <defs>
                      <linearGradient id="emergencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E74C3C" />
                        <stop offset="100%" stopColor="#E8A837" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Button */}
                  <motion.button
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl"
                    style={{
                      background: isHolding
                        ? 'linear-gradient(135deg, #E74C3C 0%, #E8A837 100%)'
                        : 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)'
                    }}
                    animate={{
                      scale: isHolding ? [1, 1.05, 1] : 1
                    }}
                    transition={{
                      scale: {
                        duration: 0.8,
                        repeat: isHolding ? Infinity : 0
                      }
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isHolding ? [1, 1.2, 1] : 1,
                        rotate: isHolding ? [0, 10, -10, 0] : 0
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: isHolding ? Infinity : 0
                      }}
                    >
                      <AlertCircle className="w-12 h-12 text-white mb-2" />
                    </motion.div>
                    <span className="text-white text-sm text-center px-4">
                      {isHolding ? 'HOLD...' : 'HOLD TO\nCONFIRM'}
                    </span>
                  </motion.button>

                  {/* Pulsing rings */}
                  {isHolding && (
                    <>
                      {[0, 0.3, 0.6].map((delay) => (
                        <motion.div
                          key={delay}
                          className="absolute w-36 h-36 rounded-full border-2 border-white/30"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>

                <p className="text-white/60 text-sm">
                  Release to cancel
                </p>
              </div>
            ) : (
              /* Success Screen */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-background rounded-3xl p-6 shadow-2xl"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#27AE60] to-[#1B8A7B] flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-[#27AE60] mb-2"
                >
                  Help Requested
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-gray-600 dark:text-gray-400 mb-6"
                >
                  Your emergency contacts have been notified
                </motion.p>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Help requested {notificationTime}s ago</span>
                </div>

                {/* Notified Contacts */}
                <div className="space-y-3 mb-6">
                  {emergencyContacts.slice(0, 3).map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#27AE60]/5 border border-[#27AE60]/20"
                    >
                      {contact.avatar ? (
                        <img 
                          src={contact.avatar} 
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B8A7B] to-[#2D9B6E] flex items-center justify-center text-white">
                          {contact.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-sm">{contact.name}</h4>
                        <p className="text-xs text-gray-500">
                          Notified {notificationTime}s ago
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#27AE60] flex items-center justify-center">
                        <Phone className="w-3 h-3 text-white" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Location Info */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-6 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#1B8A7B]" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Your location has been shared
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <motion.button
                    onClick={handleEndSession}
                    className="w-full py-3 rounded-xl text-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    End Date Session
                  </motion.button>
                  <button
                    onClick={handleEndSession}
                    className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    Cancel & Return to Date
                  </button>
                </div>

                {/* Breathing background effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl -z-10 blur-xl opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, #27AE60 0%, #1B8A7B 100%)'
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
