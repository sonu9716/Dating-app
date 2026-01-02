import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Upload, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';

interface SignUpScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const interests = ['Travel', 'Art', 'Sports', 'Music', 'Food', 'Gaming', 'Reading', 'Fitness', 'Photography', 'Outdoor'];

export function SignUpScreen({ onComplete, onBack }: SignUpScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: 25,
    gender: '',
    lookingFor: '',
    interests: [] as string[],
    bio: '',
    photos: [] as string[]
  });

  const progress = (step / 4) * 100;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B]/10 to-[#FF6B9D]/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          ← Back
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card rounded-xl shadow-lg p-8"
        >
          <Progress value={progress} className="mb-6" />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2>Create Your Profile</h2>
                
                <div className="space-y-4">
                  <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="border-gray-200 dark:border-input focus:border-[#4ECDC4]"
                  />
                  
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="border-gray-200 dark:border-input focus:border-[#4ECDC4]"
                  />
                  
                  <div>
                    <label className="block text-sm mb-2">Age: {formData.age}</label>
                    <Slider
                      value={[formData.age]}
                      onValueChange={(value) => setFormData({ ...formData, age: value[0] })}
                      min={18}
                      max={99}
                      step={1}
                      className="[&_[role=slider]]:bg-[#4ECDC4] [&_[role=slider]]:border-[#4ECDC4]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Gender</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Man', 'Woman', 'Other'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFormData({ ...formData, gender: option })}
                          className={`py-2 px-4 rounded-lg border transition-colors ${
                            formData.gender === option
                              ? 'bg-[#4ECDC4] text-white border-[#4ECDC4]'
                              : 'border-gray-200 dark:border-input hover:border-[#4ECDC4]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2>What are you looking for?</h2>
                
                <div className="space-y-3">
                  {['Long-term Relationship', 'Casual Dating', 'Friendship or Pen Pal'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({ ...formData, lookingFor: option })}
                      className={`w-full py-3 px-4 rounded-lg border text-left transition-colors ${
                        formData.lookingFor === option
                          ? 'bg-[#4ECDC4] text-white border-[#4ECDC4]'
                          : 'border-gray-200 dark:border-input hover:border-[#4ECDC4]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm mb-3">Select your interests</label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-[#4ECDC4] text-white'
                            : 'bg-gray-100 dark:bg-muted hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                        {formData.interests.includes(interest) && (
                          <X className="inline-block w-3 h-3 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2>Add Photos</h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-input rounded-lg p-8 text-center hover:border-[#4ECDC4] transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="mb-1">Upload 2+ photos</p>
                    <p className="text-sm text-gray-500">(at least 1 clear face)</p>
                  </div>
                  
                  <p className="text-sm text-gray-500 text-center">
                    Photos help you make real connections
                  </p>
                </div>
              </motion.div>
            )}
            
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2>Bio & Interests</h2>
                
                <div>
                  <label className="block text-sm mb-2">Write a bio (optional, 150 chars max)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    maxLength={150}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-input rounded-lg focus:border-[#4ECDC4] focus:outline-none focus:ring-1 focus:ring-[#4ECDC4] bg-white dark:bg-background resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-right">
                    {formData.bio.length}/150
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-input rounded-lg p-4">
                  <h3 className="mb-2">Profile Preview</h3>
                  <p className="mb-1">
                    {formData.firstName} {formData.lastName}, {formData.age}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {formData.bio || 'No bio yet'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-[#4ECDC4] text-white text-sm rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            onClick={handleNext}
            className="w-full mt-6 bg-gradient-to-r from-[#FF6B6B] to-[#FF6B9D] hover:opacity-90 text-white h-12 rounded-xl"
          >
            {step === 4 ? 'Complete Profile' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
