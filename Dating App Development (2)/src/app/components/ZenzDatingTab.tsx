import { motion } from 'motion/react';
import { 
  UserX, 
  Eye, 
  Users, 
  UsersRound, 
  Zap, 
  Target, 
  Crown, 
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

interface DatingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  badge?: string;
  popular?: boolean;
}

const categories: DatingCategory[] = [
  {
    id: 'anonymous',
    title: 'Anonymous Dating',
    description: 'Connect without revealing your identity first',
    icon: <UserX className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    badge: 'New'
  },
  {
    id: 'blind',
    title: 'Blind Date',
    description: 'Surprise matches based on personality',
    icon: <Eye className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C44569 100%)',
    popular: true
  },
  {
    id: 'double',
    title: 'Double Date',
    description: 'Bring a friend for double the fun',
    icon: <Users className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
  },
  {
    id: 'group',
    title: 'Group Date',
    description: 'Meet multiple people at once',
    icon: <UsersRound className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  },
  {
    id: 'speed',
    title: 'Speed Dating',
    description: '5-minute video dates, multiple matches',
    icon: <Zap className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #FFD26F 0%, #FFA931 100%)',
    badge: 'Hot'
  },
  {
    id: 'events',
    title: 'Matchmaking Events',
    description: 'Join curated in-person events',
    icon: <Target className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #A8EDEA 0%, #6DD5ED 100%)'
  },
  {
    id: 'exclusive',
    title: 'Exclusive',
    description: 'Premium verified members only',
    icon: <Crown className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #FDC830 0%, #F37335 100%)',
    badge: 'VIP'
  },
  {
    id: 'distance',
    title: 'Long Distance',
    description: 'Connect across cities and countries',
    icon: <Globe className="w-8 h-8" />,
    gradient: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)'
  }
];

export function ZenzDatingTab() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#FF2E97]" />
          <h1 className="bg-gradient-to-r from-[#FF6B6B] via-[#C44569] to-[#764ba2] bg-clip-text text-transparent">
            Zenz Dating
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your perfect dating experience
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setHoveredId(category.id)}
            onHoverEnd={() => setHoveredId(null)}
            className="relative group"
          >
            {/* Glassmorphism Card */}
            <motion.div
              className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-md border cursor-pointer"
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                boxShadow: 'var(--glass-shadow)'
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Gradient Background */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: category.gradient }}
              />

              {/* Badge */}
              {(category.badge || category.popular) && (
                <div className="absolute top-4 right-4">
                  {category.popular ? (
                    <motion.div
                      className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-[#FF2E97] to-[#FF6B6B] text-white shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔥 Popular
                    </motion.div>
                  ) : (
                    <div
                      className="px-3 py-1 rounded-full text-xs text-white shadow-lg"
                      style={{ background: category.gradient }}
                    >
                      {category.badge}
                    </div>
                  )}
                </div>
              )}

              {/* Icon */}
              <motion.div
                className="mb-4 p-4 rounded-2xl inline-block"
                style={{ background: category.gradient }}
                animate={hoveredId === category.id ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="text-white">
                  {category.icon}
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>

              {/* CTA Button */}
              <motion.button
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all"
                style={{
                  background: hoveredId === category.id ? category.gradient : 'transparent',
                  color: hoveredId === category.id ? 'white' : 'inherit',
                  border: `2px solid ${hoveredId === category.id ? 'transparent' : 'var(--border)'}`
                }}
                whileHover={{ x: 5 }}
              >
                Explore
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: category.gradient,
                  opacity: 0
                }}
                animate={hoveredId === category.id ? { opacity: 0.1 } : { opacity: 0 }}
              />
            </motion.div>

            {/* Glow Effect */}
            {hoveredId === category.id && (
              <motion.div
                className="absolute inset-0 rounded-2xl -z-10 blur-xl"
                style={{ background: category.gradient }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center max-w-2xl mx-auto"
      >
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            boxShadow: 'var(--glass-shadow)'
          }}
        >
          <h3 className="mb-2">Not sure which to choose?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Take our 2-minute quiz to find your perfect dating style
          </p>
          <motion.button
            className="px-6 py-3 rounded-xl text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #764ba2 100%)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Take Quiz ✨
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
