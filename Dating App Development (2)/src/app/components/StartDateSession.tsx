import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, MapPin, Clock, CheckCircle, User } from 'lucide-react';
import { useState } from 'react';
import { Profile, DateSession } from '../types';

interface StartDateSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (session: DateSession) => void;
  matchProfile: Profile;
}

export function StartDateSession({ isOpen, onClose, onStart, matchProfile }: StartDateSessionProps) {
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState(120); // in minutes
  const [checkInEnabled, setCheckInEnabled] = useState(true);
  const [confirmations, setConfirmations] = useState({
    sharedLocation: false,
    sharedDetails: false
  });

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const canStart = location && confirmations.sharedLocation && confirmations.sharedDetails;

  const handleStart = () => {
    const session: DateSession = {
      id: Date.now().toString(),
      matchProfile,
      location,
      startTime,
      estimatedEndTime: endTime,
      duration,
      isActive: true,
      checkInFrequency: 30,
      lastCheckIn: startTime
    };

    onStart(session);
    onClose();
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
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
          >
            <div className="bg-background rounded-t-3xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#1B8A7B]" />
                  <h3>Start Date Mode</h3>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[70vh] p-4 space-y-6">
                {/* Match Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#1B8A7B]/10 to-[#2D9B6E]/10 border border-[#1B8A7B]/20"
                >
                  <img 
                    src={matchProfile.photos[0]} 
                    alt={matchProfile.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4>{matchProfile.name}</h4>
                      {matchProfile.isVerified && (
                        <div className="w-5 h-5 bg-[#1B8A7B] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {matchProfile.age} • {matchProfile.distance} miles away
                    </p>
                  </div>
                </motion.div>

                {/* Date Details */}
                <div className="space-y-4">
                  <h4 className="text-sm text-gray-600 dark:text-gray-400">Date Details</h4>
                  
                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-sm mb-2 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#1B8A7B]" />
                      Where are you meeting?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Central Park Cafe"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#1B8A7B] transition-all outline-none"
                    />
                  </motion.div>

                  {/* Duration */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm mb-2 block flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#1B8A7B]" />
                      How long will the date be?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[60, 120, 180, 240].map((mins) => (
                        <motion.button
                          key={mins}
                          onClick={() => setDuration(mins)}
                          className={`p-3 rounded-xl border-2 transition-all text-sm ${
                            duration === mins
                              ? 'border-[#1B8A7B] bg-[#1B8A7B]/5'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {mins / 60}h
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Estimated end: {endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </motion.div>
                </div>

                {/* Safety Confirmation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-[#E8A837]/5 border border-[#E8A837]/20"
                >
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#E8A837]" />
                    Safety Checklist
                  </h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <motion.div
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          confirmations.sharedLocation
                            ? 'bg-[#1B8A7B] border-[#1B8A7B]'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <input
                          type="checkbox"
                          checked={confirmations.sharedLocation}
                          onChange={(e) => setConfirmations(prev => ({ ...prev, sharedLocation: e.target.checked }))}
                          className="sr-only"
                        />
                        <AnimatePresence>
                          {confirmations.sharedLocation && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-3 h-3 text-white"
                              viewBox="0 0 12 12"
                            >
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M2 6l3 3 5-6"
                              />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <span className="text-sm flex-1 group-hover:text-[#1B8A7B] transition-colors">
                        I've shared my location with my emergency contacts
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <motion.div
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          confirmations.sharedDetails
                            ? 'bg-[#1B8A7B] border-[#1B8A7B]'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        <input
                          type="checkbox"
                          checked={confirmations.sharedDetails}
                          onChange={(e) => setConfirmations(prev => ({ ...prev, sharedDetails: e.target.checked }))}
                          className="sr-only"
                        />
                        <AnimatePresence>
                          {confirmations.sharedDetails && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-3 h-3 text-white"
                              viewBox="0 0 12 12"
                            >
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                d="M2 6l3 3 5-6"
                              />
                            </motion.svg>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      <span className="text-sm flex-1 group-hover:text-[#1B8A7B] transition-colors">
                        I've shared the date details with someone I trust
                      </span>
                    </label>
                  </div>
                </motion.div>

                {/* Check-in Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex-1">
                    <h4 className="text-sm mb-1">Enable check-in reminders</h4>
                    <p className="text-xs text-gray-500">We'll check on you every 30 minutes</p>
                  </div>
                  <motion.button
                    onClick={() => setCheckInEnabled(!checkInEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      checkInEnabled ? 'bg-[#1B8A7B]' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-lg"
                      animate={{ x: checkInEnabled ? 26 : 2, y: 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <motion.button
                  onClick={handleStart}
                  disabled={!canStart}
                  className="w-full py-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{
                    background: canStart
                      ? 'linear-gradient(135deg, #1B8A7B 0%, #2D9B6E 100%)'
                      : '#ccc'
                  }}
                  whileHover={canStart ? { scale: 1.02 } : {}}
                  whileTap={canStart ? { scale: 0.98 } : {}}
                >
                  <motion.div
                    animate={canStart ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🛡️ Start Safety Mode
                  </motion.div>
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
