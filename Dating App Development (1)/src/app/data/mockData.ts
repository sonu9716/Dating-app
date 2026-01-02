import { Profile, Conversation, Message } from '../types';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 28,
    distance: 2,
    bio: 'Coffee enthusiast ☕ | Dog lover 🐕 | Adventure seeker',
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee'],
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop'
    ],
    isVerified: true,
    isOnline: true,
    prompts: [
      { question: "What's your ideal first date?", answer: "Coffee walk in the park followed by visiting a local art gallery" },
      { question: "I'm looking for...", answer: "Someone who can make me laugh and enjoys spontaneous adventures" }
    ]
  },
  {
    id: '2',
    name: 'Sophie',
    age: 26,
    distance: 5,
    bio: 'Yoga instructor 🧘‍♀️ | Plant mom 🌿 | Foodie',
    interests: ['Fitness', 'Food', 'Art', 'Music'],
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop'
    ],
    isVerified: true,
    isOnline: false,
    lastActive: '2h ago',
    prompts: [
      { question: "My simple pleasures", answer: "Morning yoga with my plants, trying new recipes, and live music" }
    ]
  },
  {
    id: '3',
    name: 'Olivia',
    age: 30,
    distance: 3,
    bio: 'Artist 🎨 | Music lover 🎵 | Always exploring',
    interests: ['Art', 'Music', 'Travel', 'Reading'],
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800&h=1000&fit=crop'
    ],
    isVerified: false,
    isOnline: true,
    prompts: [
      { question: "You should message me if...", answer: "You appreciate good music and aren't afraid to dance in the rain" }
    ]
  },
  {
    id: '4',
    name: 'Isabella',
    age: 27,
    distance: 7,
    bio: 'Book lover 📚 | Runner 🏃‍♀️ | Always curious',
    interests: ['Reading', 'Fitness', 'Photography', 'Outdoor'],
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop'
    ],
    isVerified: true,
    isOnline: false,
    lastActive: '1h ago',
    prompts: [
      { question: "The key to my heart is...", answer: "Good conversation, bad jokes, and sharing book recommendations" }
    ]
  },
  {
    id: '5',
    name: 'Ava',
    age: 29,
    distance: 4,
    bio: 'Entrepreneur ✨ | Wine enthusiast 🍷 | Beach lover',
    interests: ['Travel', 'Food', 'Gaming', 'Outdoor'],
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&h=1000&fit=crop'
    ],
    isVerified: true,
    isOnline: true,
    prompts: [
      { question: "A perfect Sunday...", answer: "Brunch by the beach, afternoon wine tasting, and sunset watching" }
    ]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    profile: mockProfiles[0],
    lastMessage: "That sounds amazing! I'd love to go hiking this weekend 😊",
    timestamp: new Date(Date.now() - 5 * 60000),
    unreadCount: 2,
    isTyping: false,
    messages: [
      {
        id: 'm1',
        senderId: 'me',
        text: 'Hey! I noticed you love hiking. Have you been to Griffith Park?',
        timestamp: new Date(Date.now() - 30 * 60000),
        isRead: true
      },
      {
        id: 'm2',
        senderId: '1',
        text: 'Hi! Yes, I go there all the time! The views are incredible 😍',
        timestamp: new Date(Date.now() - 25 * 60000),
        isRead: true
      },
      {
        id: 'm3',
        senderId: 'me',
        text: 'Same! I was thinking of going this weekend. Would you like to join?',
        timestamp: new Date(Date.now() - 10 * 60000),
        isRead: true
      },
      {
        id: 'm4',
        senderId: '1',
        text: "That sounds amazing! I'd love to go hiking this weekend 😊",
        timestamp: new Date(Date.now() - 5 * 60000),
        isRead: false
      }
    ]
  },
  {
    id: '2',
    profile: mockProfiles[1],
    lastMessage: "I teach at the studio downtown. You should join a class!",
    timestamp: new Date(Date.now() - 2 * 3600000),
    unreadCount: 0,
    isTyping: false,
    messages: [
      {
        id: 'm5',
        senderId: 'me',
        text: "I've been meaning to try yoga! Where do you teach?",
        timestamp: new Date(Date.now() - 3 * 3600000),
        isRead: true
      },
      {
        id: 'm6',
        senderId: '2',
        text: "I teach at the studio downtown. You should join a class!",
        timestamp: new Date(Date.now() - 2 * 3600000),
        isRead: true
      }
    ]
  },
  {
    id: '3',
    profile: mockProfiles[2],
    lastMessage: "We definitely should! When are you free?",
    timestamp: new Date(Date.now() - 24 * 3600000),
    unreadCount: 1,
    isTyping: false,
    messages: [
      {
        id: 'm7',
        senderId: 'me',
        text: 'Your art is incredible! We should check out the new gallery opening',
        timestamp: new Date(Date.now() - 25 * 3600000),
        isRead: true
      },
      {
        id: 'm8',
        senderId: '3',
        text: "We definitely should! When are you free?",
        timestamp: new Date(Date.now() - 24 * 3600000),
        isRead: false
      }
    ]
  }
];

export const currentUser: Profile = {
  id: 'me',
  name: 'You',
  age: 28,
  distance: 0,
  bio: 'Living life to the fullest',
  interests: ['Travel', 'Photography', 'Sports', 'Music'],
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop'
  ],
  isVerified: true,
  isOnline: true
};
