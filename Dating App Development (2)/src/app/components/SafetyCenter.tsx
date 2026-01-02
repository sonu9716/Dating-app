import { motion } from 'motion/react';
import { Shield, Plus, Phone, X, Info, Flag, HelpCircle, CheckCircle, Bell, MessageSquare, MapPin } from 'lucide-react';
import { useState } from 'react';
import { EmergencyContact, SafetyPreferences } from '../types';

interface SafetyCenterProps {
  onBack: () => void;
  onAddContact: () => void;
}

export function SafetyCenter({ onBack, onAddContact }: SafetyCenterProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      relationship: 'friend',
      type: 'app-user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isVerified: true
    }
  ]);

  const [preferences, setPreferences] = useState<SafetyPreferences>({
    allowLocationSharing: true,
    receiveCheckInReminders: true,
    notifyViaSMS: true,
    notifyViaPush: true,
    checkInFrequency: 30
  });

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const relationshipLabels = {
    friend: '👥 Friend',
    family: '👨‍👩‍👧 Family',
    partner: '💑 Partner',
    other: '👤 Other'
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{
          background: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)'
        }}
      >
        <div className="flex items-center gap-4 p-4">
          <button onClick={onBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#1B8A7B]" />
            <h2>Safety Center</h2>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1B8A7B 0%, #2D9B6E 100%)'
          }}
        >
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
            style={{ background: '#fff' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative z-10">
            <h3 className="text-white mb-2">Your Safety, Our Priority</h3>
            <p className="text-white/90 text-sm">
              Date with confidence knowing your safety network is always with you 💚
            </p>
          </div>
        </motion.div>

        {/* Emergency Contacts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#1B8A7B]" />
                Emergency Contacts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These people will be notified if you need help
              </p>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="space-y-3 mb-4">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl backdrop-blur-md border relative group"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {contact.avatar ? (
                      <img 
                        src={contact.avatar} 
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B8A7B] to-[#2D9B6E] flex items-center justify-center text-white">
                        {contact.name.charAt(0)}
                      </div>
                    )}
                    {contact.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1B8A7B] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm">{contact.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{contact.phone}</p>
                    <p className="text-xs text-[#1B8A7B] mt-1">{relationshipLabels[contact.relationship]}</p>
                  </div>

                  <motion.button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-2 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Contact Button */}
          {contacts.length < 3 && (
            <motion.button
              onClick={onAddContact}
              className="w-full p-4 rounded-xl border-2 border-dashed border-[#1B8A7B]/30 text-[#1B8A7B] flex items-center justify-center gap-2 hover:bg-[#1B8A7B]/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Add Emergency Contact
            </motion.button>
          )}
          {contacts.length >= 3 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Maximum of 3 emergency contacts allowed
            </p>
          )}
        </motion.div>

        {/* Safety Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)'
          }}
        >
          <h3 className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#1B8A7B]" />
            Safety Preferences
          </h3>

          <div className="space-y-4">
            {/* Location Sharing Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Allow location sharing during dates</span>
              </div>
              <motion.button
                onClick={() => setPreferences(p => ({ ...p, allowLocationSharing: !p.allowLocationSharing }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.allowLocationSharing ? 'bg-[#1B8A7B]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: preferences.allowLocationSharing ? 26 : 2, y: 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Check-in Reminders Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Receive check-in reminders</span>
              </div>
              <motion.button
                onClick={() => setPreferences(p => ({ ...p, receiveCheckInReminders: !p.receiveCheckInReminders }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.receiveCheckInReminders ? 'bg-[#1B8A7B]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: preferences.receiveCheckInReminders ? 26 : 2, y: 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* SMS Notification Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Notify emergency contacts via SMS</span>
              </div>
              <motion.button
                onClick={() => setPreferences(p => ({ ...p, notifyViaSMS: !p.notifyViaSMS }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.notifyViaSMS ? 'bg-[#1B8A7B]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: preferences.notifyViaSMS ? 26 : 2, y: 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Push Notification Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Notify emergency contacts via app push</span>
              </div>
              <motion.button
                onClick={() => setPreferences(p => ({ ...p, notifyViaPush: !p.notifyViaPush }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.notifyViaPush ? 'bg-[#1B8A7B]' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: preferences.notifyViaPush ? 26 : 2, y: 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Check-in Frequency Dropdown */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Check-in frequency
              </label>
              <select
                value={preferences.checkInFrequency}
                onChange={(e) => setPreferences(p => ({ ...p, checkInFrequency: Number(e.target.value) as 15 | 30 | 60 }))}
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 text-sm"
              >
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every 60 minutes</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Help & Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4">Help & Resources</h3>
          
          <div className="space-y-3">
            {[
              { icon: Info, label: 'Dating safety tips', color: '#1B8A7B' },
              { icon: Flag, label: 'Report a concern', color: '#E8A837' },
              { icon: HelpCircle, label: 'How emergency help works', color: '#2D9B6E' }
            ].map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="w-full p-4 rounded-xl backdrop-blur-md border flex items-center justify-between group hover:border-[#1B8A7B]/50 transition-all"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)'
                }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: `${item.color}20` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
