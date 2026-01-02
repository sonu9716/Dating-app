import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';

export function SplashScreen() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground variant="both" />
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          type: 'spring',
          stiffness: 100
        }}
        className="text-center relative z-10"
      >
        {/* Logo with Sparkles */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative mb-8"
        >
          <div className="absolute -top-4 -right-4">
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-8 h-8 text-[#FFD26F]" />
            </motion.div>
          </div>
          
          <div className="relative">
            <motion.div
              className="absolute inset-0 blur-2xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-24 h-24 text-[#FF2E97] fill-[#FF2E97] mx-auto" />
            </motion.div>
            
            <Heart className="w-24 h-24 text-white fill-white mx-auto relative z-10" />
          </div>
          
          <div className="absolute -bottom-4 -left-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -180, -360]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="bg-gradient-to-r from-white via-[#FFD26F] to-white bg-clip-text text-transparent">
            Spark
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-white/90 text-xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Where Real Connections Begin ✨
        </motion.p>
        
        <motion.div
          className="flex gap-2 justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 text-center z-10"
      >
        <div className="px-6 py-3 rounded-full backdrop-blur-md border border-white/20 bg-white/10">
          <p className="text-white/90 text-sm">
            🔒 E2E Encrypted • 🚫 Zero Data Selling
          </p>
        </div>
      </motion.div>
    </div>
  );
}