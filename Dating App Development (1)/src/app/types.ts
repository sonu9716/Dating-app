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
