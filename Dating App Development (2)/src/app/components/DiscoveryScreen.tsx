import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { Settings, SlidersHorizontal, X, Heart, Star, MapPin } from 'lucide-react';
import { Profile } from '../types';
import { Badge } from './ui/badge';

interface DiscoveryScreenProps {
  profiles: Profile[];
  onLike: (profile: Profile) => void;
  onPass: (profile: Profile) => void;
  onSuperLike: (profile: Profile) => void;
  onSettings: () => void;
}

export function DiscoveryScreen({ profiles, onLike, onPass, onSuperLike, onSettings }: DiscoveryScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-2">You've reviewed everyone nearby!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Come back later or expand your search
          </p>
          <button
            onClick={onSettings}
            className="px-6 py-3 border-2 border-[#4ECDC4] text-[#4ECDC4] rounded-xl hover:bg-[#4ECDC4] hover:text-white transition-colors"
          >
            Update Preferences
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.3, 1, 1, 1, 0.3]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleLike();
    } else if (info.offset.x < -100) {
      handlePass();
    }
  };

  const handleLike = () => {
    onLike(currentProfile);
    nextProfile();
  };

  const handlePass = () => {
    onPass(currentProfile);
    nextProfile();
  };

  const handleSuperLike = () => {
    onSuperLike(currentProfile);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentIndex(currentIndex + 1);
    setCurrentPhotoIndex(0);
  };

  const handleCardClick = () => {
    setCurrentPhotoIndex((prev) => 
      prev < currentProfile.photos.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <button onClick={onSettings} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <span>Discover</span>
        </div>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#4ECDC4] rounded-full" />
        </button>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="relative w-full max-w-md aspect-[3/4] cursor-pointer"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onClick={handleCardClick}
        >
          <div className="absolute inset-0 bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden">
            {/* Photo Indicators */}
            <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
              {currentProfile.photos.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all ${
                      index === currentPhotoIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Photo Count Badge */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-sm z-10">
              {currentPhotoIndex + 1}/{currentProfile.photos.length}
            </div>

            {/* Profile Photo */}
            <div className="absolute inset-0">
              <img
                src={currentProfile.photos[currentPhotoIndex]}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl">{currentProfile.name}, {currentProfile.age}</h2>
                {currentProfile.isVerified && (
                  <Badge className="bg-[#4ECDC4] text-white border-0">
                    ✓
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm mb-3 opacity-90">
                <MapPin className="w-4 h-4" />
                {currentProfile.distance} km away
              </div>
              
              <p className="text-sm mb-3 line-clamp-2 opacity-90">
                {currentProfile.bio}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-[#4ECDC4] text-white text-sm rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 p-6 pb-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePass}
          className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-input flex items-center justify-center hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <X className="w-8 h-8 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSuperLike}
          className="w-20 h-20 rounded-full bg-[#4ECDC4] flex items-center justify-center hover:bg-[#4ECDC4]/90 transition-colors shadow-lg"
        >
          <Star className="w-10 h-10 text-white fill-white" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className="w-16 h-16 rounded-full bg-[#FF6B6B] flex items-center justify-center hover:bg-[#FF6B6B]/90 transition-colors shadow-lg"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </motion.button>
      </div>
    </div>
  );
}
