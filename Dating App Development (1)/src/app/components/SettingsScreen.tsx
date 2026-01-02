import { useState } from 'react';
import { ArrowLeft, ChevronRight, Lock } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const [ageRange, setAgeRange] = useState([22, 35]);
  const [distance, setDistance] = useState([25]);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    showDistance: true,
    showOnlineStatus: true,
    e2eEncryption: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1>Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Account Section */}
        <div className="border-b border-border">
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            Account
          </div>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>Edit Profile</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>Verification Status</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>Change Password</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Preferences Section */}
        <div className="border-b border-border">
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            Preferences
          </div>
          
          <div className="px-4 py-4">
            <div className="mb-4">
              <label className="block mb-2">
                Age Range: {ageRange[0]} - {ageRange[1]}
              </label>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                min={18}
                max={99}
                step={1}
                className="[&_[role=slider]]:bg-[#4ECDC4] [&_[role=slider]]:border-[#4ECDC4]"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">
                Distance: {distance[0]} km
              </label>
              <Slider
                value={distance}
                onValueChange={setDistance}
                min={1}
                max={50}
                step={1}
                className="[&_[role=slider]]:bg-[#4ECDC4] [&_[role=slider]]:border-[#4ECDC4]"
              />
            </div>
          </div>

          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>Gender Filter</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>Looking For</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Privacy & Safety Section */}
        <div className="border-b border-border">
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            Privacy & Safety
          </div>
          
          <div className="flex items-center justify-between px-4 py-4 bg-[#4ECDC4]/10">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#4ECDC4]" />
              <span>E2E Encryption Enabled</span>
            </div>
            <Switch
              checked={settings.e2eEncryption}
              disabled
              className="data-[state=checked]:bg-[#4ECDC4]"
            />
          </div>

          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span className="text-red-500">Report This User</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span className="text-red-500">Block User</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span className="text-[#4ECDC4]">Privacy Policy</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span className="text-[#4ECDC4]">Data Usage</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* App Settings Section */}
        <div className="border-b border-border">
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            App Settings
          </div>
          
          <div className="flex items-center justify-between px-4 py-4">
            <span>Notifications</span>
            <Switch
              checked={settings.notifications}
              onCheckedChange={() => toggleSetting('notifications')}
              className="data-[state=checked]:bg-[#4ECDC4]"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <span>Dark Mode</span>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={() => toggleSetting('darkMode')}
              className="data-[state=checked]:bg-[#4ECDC4]"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <span>Show Distance</span>
            <Switch
              checked={settings.showDistance}
              onCheckedChange={() => toggleSetting('showDistance')}
              className="data-[state=checked]:bg-[#4ECDC4]"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <span>Show Online Status</span>
            <Switch
              checked={settings.showOnlineStatus}
              onCheckedChange={() => toggleSetting('showOnlineStatus')}
              className="data-[state=checked]:bg-[#4ECDC4]"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="border-b border-border">
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
            About
          </div>
          
          <div className="px-4 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Version 1.0.0</p>
          </div>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>About Us</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted transition-colors">
            <span>Terms & Conditions</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Danger Zone */}
        <div className="p-4 space-y-3">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-12 rounded-xl"
          >
            Log Out
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 h-12 rounded-xl"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
