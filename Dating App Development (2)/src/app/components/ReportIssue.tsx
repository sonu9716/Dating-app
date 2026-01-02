import { motion, AnimatePresence } from 'motion/react';
import { X, DollarSign, Search, AlertTriangle, MoreHorizontal, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Profile } from '../types';

interface ReportIssueProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onBlock: () => void;
}

type IssueType = 'money' | 'fake' | 'harassment' | 'other' | null;

export function ReportIssue({ isOpen, onClose, profile, onBlock }: ReportIssueProps) {
  const [selectedIssue, setSelectedIssue] = useState<IssueType>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [attachEvidence, setAttachEvidence] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const issues = [
    {
      type: 'money' as const,
      icon: DollarSign,
      label: "They're asking for money",
      color: '#E74C3C'
    },
    {
      type: 'fake' as const,
      icon: Search,
      label: "This person isn't who they said",
      color: '#E8A837'
    },
    {
      type: 'harassment' as const,
      icon: AlertTriangle,
      label: 'Inappropriate behavior / harassment',
      color: '#E74C3C'
    },
    {
      type: 'other' as const,
      icon: MoreHorizontal,
      label: 'Something else',
      color: '#6B7280'
    }
  ];

  const handleBlockAndReport = () => {
    setShowSuccess(true);
    onBlock();

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setSelectedIssue(null);
      setAdditionalContext('');
      setAttachEvidence(false);
    }, 2000);
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
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden"
          >
            <div className="bg-background rounded-t-3xl shadow-2xl">
              {/* Success Overlay */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#27AE60] to-[#2D9B6E] flex items-center justify-center mb-4 shadow-2xl">
                        <CheckCircle className="w-14 h-14 text-white" />
                      </div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-[#27AE60] mb-2"
                    >
                      {profile.name} has been blocked
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      We've reviewed your report and the user has been flagged
                    </motion.p>

                    {/* Confetti */}
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: ['#27AE60', '#1B8A7B', '#E8A837'][i % 3],
                          left: '50%',
                          top: '30%'
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0.5],
                          x: Math.cos((i / 16) * Math.PI * 2) * 120,
                          y: Math.sin((i / 16) * Math.PI * 2) * 120,
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-[#E74C3C]">Report an Issue</h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[65vh] p-4">
                <h4 className="mb-4">What happened with {profile.name}?</h4>

                {/* Issue Options */}
                <div className="space-y-3 mb-6">
                  {issues.map((issue, index) => {
                    const Icon = issue.icon;
                    const isSelected = selectedIssue === issue.type;

                    return (
                      <motion.button
                        key={issue.type}
                        onClick={() => setSelectedIssue(issue.type)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-[#E74C3C] bg-[#E74C3C]/5'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ background: `${issue.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: issue.color }} />
                          </div>
                          <span className="flex-1">{issue.label}</span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <CheckCircle className="w-5 h-5 text-[#E74C3C]" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Additional Context (shows when issue selected) */}
                <AnimatePresence>
                  {selectedIssue && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* Text Area */}
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                          Additional details (optional)
                        </label>
                        <textarea
                          value={additionalContext}
                          onChange={(e) => setAdditionalContext(e.target.value)}
                          placeholder="Tell us more about what happened..."
                          rows={4}
                          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#E74C3C] transition-all outline-none resize-none"
                        />
                      </div>

                      {/* Attach Evidence Toggle */}
                      <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer">
                        <span className="text-sm">Attach chat evidence</span>
                        <motion.button
                          type="button"
                          onClick={() => setAttachEvidence(!attachEvidence)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            attachEvidence ? 'bg-[#E74C3C]' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                            animate={{ x: attachEvidence ? 26 : 2, y: 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </motion.button>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <motion.button
                  onClick={handleBlockAndReport}
                  disabled={!selectedIssue}
                  className="w-full py-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{
                    background: selectedIssue
                      ? 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)'
                      : '#ccc'
                  }}
                  whileHover={selectedIssue ? { scale: 1.02 } : {}}
                  whileTap={selectedIssue ? { scale: 0.98 } : {}}
                >
                  Block & Report
                </motion.button>
                <button
                  onClick={() => {
                    handleBlockAndReport();
                  }}
                  disabled={!selectedIssue}
                  className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Just block for now
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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