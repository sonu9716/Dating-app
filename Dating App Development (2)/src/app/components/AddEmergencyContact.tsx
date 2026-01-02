import { motion, AnimatePresence } from 'motion/react';
import { X, Search, CheckCircle, UserPlus, Phone as PhoneIcon } from 'lucide-react';
import { useState } from 'react';
import { EmergencyContact } from '../types';

interface AddEmergencyContactProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: EmergencyContact) => void;
}

export function AddEmergencyContact({ isOpen, onClose, onAdd }: AddEmergencyContactProps) {
  const [activeTab, setActiveTab] = useState<'phone' | 'app'>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [relationship, setRelationship] = useState<'friend' | 'family' | 'partner' | 'other'>('friend');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock phone contacts
  const phoneContacts = [
    { id: '1', name: 'Emily Davis', phone: '+1 (555) 234-5678' },
    { id: '2', name: 'Michael Chen', phone: '+1 (555) 345-6789' },
    { id: '3', name: 'Jessica Wilson', phone: '+1 (555) 456-7890' }
  ].filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Mock app users
  const appUsers = [
    { 
      id: '1', 
      name: 'Alex Rivera', 
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isVerified: true
    },
    { 
      id: '2', 
      name: 'Jordan Taylor', 
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      isVerified: false
    }
  ].filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleConfirm = () => {
    if (!selectedContact) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: selectedContact.name,
      phone: selectedContact.phone,
      relationship,
      type: activeTab === 'phone' ? 'phone' : 'app-user',
      avatar: selectedContact.avatar,
      isVerified: selectedContact.isVerified
    };

    onAdd(newContact);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setSelectedContact(null);
      setSearchQuery('');
      setRelationship('friend');
    }, 1500);
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
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B8A7B] to-[#2D9B6E] flex items-center justify-center mb-4">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-[#1B8A7B]"
                    >
                      Contact Added Successfully! ✓
                    </motion.h3>
                    {/* Confetti particles */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: ['#1B8A7B', '#2D9B6E', '#E8A837'][i % 3],
                          left: '50%',
                          top: '40%'
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i / 12) * Math.PI * 2) * 100,
                          y: Math.sin((i / 12) * Math.PI * 2) * 100,
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3>Add Emergency Contact</h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('phone')}
                  className="flex-1 p-4 relative"
                >
                  <div className={`flex items-center justify-center gap-2 ${
                    activeTab === 'phone' ? 'text-[#1B8A7B]' : 'text-gray-500'
                  }`}>
                    <PhoneIcon className="w-5 h-5" />
                    <span>Phone Contact</span>
                  </div>
                  {activeTab === 'phone' && (
                    <motion.div
                      layoutId="activeContactTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B8A7B]"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('app')}
                  className="flex-1 p-4 relative"
                >
                  <div className={`flex items-center justify-center gap-2 ${
                    activeTab === 'app' ? 'text-[#1B8A7B]' : 'text-gray-500'
                  }`}>
                    <UserPlus className="w-5 h-5" />
                    <span>In-App User</span>
                  </div>
                  {activeTab === 'app' && (
                    <motion.div
                      layoutId="activeContactTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B8A7B]"
                    />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh] p-4">
                {/* Search Bar */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileFocus={{ scale: 1.02 }}
                  className="relative mb-4"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={activeTab === 'phone' ? 'Search contacts...' : 'Search by name or phone...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#1B8A7B] transition-all outline-none"
                  />
                </motion.div>

                {/* Contact List */}
                <div className="space-y-2 mb-6">
                  {activeTab === 'phone' ? (
                    phoneContacts.map((contact) => (
                      <motion.button
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedContact?.id === contact.id
                            ? 'border-[#1B8A7B] bg-[#1B8A7B]/5'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B8A7B] to-[#2D9B6E] flex items-center justify-center text-white">
                            {contact.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm">{contact.name}</h4>
                            <p className="text-xs text-gray-500">{contact.phone}</p>
                          </div>
                          {selectedContact?.id === contact.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <CheckCircle className="w-6 h-6 text-[#1B8A7B]" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    appUsers.map((user) => (
                      <motion.button
                        key={user.id}
                        onClick={() => setSelectedContact(user)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedContact?.id === user.id
                            ? 'border-[#1B8A7B] bg-[#1B8A7B]/5'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {user.isVerified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1B8A7B] rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm flex items-center gap-1">
                              {user.name}
                              {user.isVerified && <span className="text-xs text-[#1B8A7B]">✓</span>}
                            </h4>
                            <p className="text-xs text-gray-500">{user.phone}</p>
                          </div>
                          {selectedContact?.id === user.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <CheckCircle className="w-6 h-6 text-[#1B8A7B]" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Relationship Selector */}
                {selectedContact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Relationship
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'friend' as const, label: '👥 Friend' },
                        { value: 'family' as const, label: '👨‍👩‍👧 Family' },
                        { value: 'partner' as const, label: '💑 Partner' },
                        { value: 'other' as const, label: '👤 Other' }
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setRelationship(option.value)}
                          className={`p-3 rounded-xl border-2 transition-all text-sm ${
                            relationship === option.value
                              ? 'border-[#1B8A7B] bg-[#1B8A7B]/5'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  onClick={handleConfirm}
                  disabled={!selectedContact}
                  className="w-full py-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: selectedContact 
                      ? 'linear-gradient(135deg, #1B8A7B 0%, #2D9B6E 100%)'
                      : '#ccc'
                  }}
                  whileHover={selectedContact ? { scale: 1.02 } : {}}
                  whileTap={selectedContact ? { scale: 0.98 } : {}}
                >
                  Add Contact
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
