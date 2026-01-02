export interface Profile {
  id: string;
  name: string;
  age: number;
  distance: number;
  bio: string;
  interests: string[];
  photos: string[];
  isVerified: boolean;
  isOnline?: boolean;
  lastActive?: string;
  prompts?: {
    question: string;
    answer: string;
  }[];
}

export interface Match {
  id: string;
  profile: Profile;
  matchedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  profile: Profile;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isTyping?: boolean;
  messages: Message[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: 'friend' | 'family' | 'partner' | 'other';
  type: 'phone' | 'app-user';
  profileId?: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface DateSession {
  id: string;
  matchProfile: Profile;
  location: string;
  startTime: Date;
  estimatedEndTime: Date;
  duration: number; // in minutes
  isActive: boolean;
  checkInFrequency: number; // in minutes
  lastCheckIn?: Date;
  emergencyActivated?: boolean;
}

export interface SafetyPreferences {
  allowLocationSharing: boolean;
  receiveCheckInReminders: boolean;
  notifyViaSMS: boolean;
  notifyViaPush: boolean;
  checkInFrequency: 15 | 30 | 60;
}