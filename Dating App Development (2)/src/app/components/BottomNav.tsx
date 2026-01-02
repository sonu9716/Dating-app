import { Heart, MessageCircle, User, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: 'discover' | 'zenz' | 'matches' | 'chat' | 'profile';
  onTabChange: (tab: 'discover' | 'zenz' | 'matches' | 'chat' | 'profile') => void;
  unreadCount?: number;
}

export function BottomNav({ activeTab, onTabChange, unreadCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'discover' as const, icon: Sparkles, label: 'Discover' },
    { id: 'zenz' as const, icon: Zap, label: 'Zenz', highlight: true },
    { id: 'matches' as const, icon: Heart, label: 'Matches' },
    { id: 'chat' as const, icon: MessageCircle, label: 'Chat', badge: unreadCount },
    { id: 'profile' as const, icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-40"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        boxShadow: '0 -4px 16px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                {tab.highlight && !isActive ? (
                  <motion.div
                    className="absolute inset-0 rounded-full blur-lg -z-10"
                    style={{ background: 'linear-gradient(135deg, #FF2E97 0%, #8B5CF6 100%)' }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                ) : null}
                
                {isActive && tab.highlight ? (
                  <motion.div
                    className="p-2 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, #FF2E97 0%, #8B5CF6 100%)' }}
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive 
                        ? tab.highlight 
                          ? 'text-[#FF2E97]' 
                          : 'text-[#FF6B6B]'
                        : 'text-gray-500'
                    }`}
                  />
                )}
                
                {tab.badge && tab.badge > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-[#FF2E97] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <span className="text-white text-xs px-1">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  </motion.div>
                )}
              </div>
              <span
                className={`text-xs transition-colors ${
                  isActive 
                    ? tab.highlight
                      ? 'bg-gradient-to-r from-[#FF2E97] to-[#8B5CF6] bg-clip-text text-transparent'
                      : 'text-[#FF6B6B]'
                    : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && !tab.highlight && (
                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #C44569 100%)' }}
                  layoutId="indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}