import { ArrowLeft, MapPin, X, Heart } from 'lucide-react';
import { Profile } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ProfileViewProps {
  profile: Profile;
  onBack: () => void;
  onLike?: () => void;
  onPass?: () => void;
}

export function ProfileView({ profile, onBack, onLike, onPass }: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span>Profile</span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="pb-24">
        {/* Cover Photo */}
        <div className="relative h-[400px] bg-gray-200 dark:bg-muted">
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-4 -mt-16 relative z-10">
          <div className="flex items-end gap-4 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden shadow-xl">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h2>{profile.name}, {profile.age}</h2>
                {profile.isVerified && (
                  <Badge className="bg-[#4ECDC4] text-white border-0">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{profile.distance} km away</span>
              </div>
              {profile.lastActive && !profile.isOnline && (
                <p className="text-sm text-gray-500">Last active: {profile.lastActive}</p>
              )}
              {profile.isOnline && (
                <p className="text-sm text-[#22C55E]">● Online now</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="mb-2">About</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Interests */}
          {profile.interests.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-4 py-2 bg-[#4ECDC4] text-white rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {profile.photos.length > 1 && (
            <div className="mb-6">
              <h3 className="mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {profile.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-muted"
                  >
                    <img
                      src={photo}
                      alt={`${profile.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompts */}
          {profile.prompts && profile.prompts.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3>Getting to know {profile.name}</h3>
              {profile.prompts.map((prompt, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 bg-card"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {prompt.question}
                  </p>
                  <p className="italic">{prompt.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {(onLike || onPass) && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
          <div className="flex gap-3 max-w-md mx-auto">
            {onPass && (
              <Button
                onClick={onPass}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 hover:border-red-500 hover:text-red-500"
              >
                <X className="w-5 h-5 mr-2" />
                Pass
              </Button>
            )}
            {onLike && (
              <Button
                onClick={onLike}
                className="flex-1 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white h-12 rounded-xl"
              >
                <Heart className="w-5 h-5 mr-2" />
                Like
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
