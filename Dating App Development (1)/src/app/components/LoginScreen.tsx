import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Apple, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AnimatedBackground } from './AnimatedBackground';

interface LoginScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground variant="gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism Card */}
        <div 
          className="rounded-3xl shadow-2xl p-8 backdrop-blur-xl border relative overflow-hidden"
          style={{
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            boxShadow: 'var(--glass-shadow)'
          }}
        >
          {/* Animated gradient orb */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl"
            style={{ background: 'linear-gradient(135deg, #FF2E97 0%, #8B5CF6 100%)' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-[#FF2E97]" />
              <h2 className="text-center bg-gradient-to-r from-[#FF6B6B] via-[#C44569] to-[#764ba2] bg-clip-text text-transparent">
                Welcome Back
              </h2>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
              Your next connection awaits ✨
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                animate={focusedField === 'email' ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-[#FF2E97] transition-all duration-300 h-12 rounded-xl backdrop-blur-sm"
                />
              </motion.div>
              
              <motion.div 
                className="relative"
                animate={focusedField === 'password' ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-[#8B5CF6] transition-all duration-300 h-12 rounded-xl pr-10 backdrop-blur-sm"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
              
              <button
                type="button"
                className="text-sm bg-gradient-to-r from-[#FF2E97] to-[#8B5CF6] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Forgot password?
              </button>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-white border-0 shadow-lg relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #C44569 50%, #764ba2 100%)' }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #764ba2 0%, #FF6B6B 100%)' }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Login</span>
                </Button>
              </motion.div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-full text-gray-600 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <motion.button 
                  className="flex-1 flex items-center justify-center gap-2 h-12 backdrop-blur-sm bg-white/50 dark:bg-black/20 rounded-xl hover:bg-white/70 dark:hover:bg-black/30 transition-all border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Apple className="w-5 h-5" />
                  Apple
                </motion.button>
                <motion.button 
                  className="flex-1 flex items-center justify-center gap-2 h-12 backdrop-blur-sm bg-white/50 dark:bg-black/20 rounded-xl hover:bg-white/70 dark:hover:bg-black/30 transition-all border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </motion.button>
              </div>
            </div>
            
            <p className="text-center mt-6">
              <span className="text-gray-600 dark:text-gray-400">New here? </span>
              <motion.button
                onClick={onSignUp}
                className="bg-gradient-to-r from-[#FF2E97] to-[#8B5CF6] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                whileHover={{ scale: 1.05 }}
              >
                Create Account
              </motion.button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}