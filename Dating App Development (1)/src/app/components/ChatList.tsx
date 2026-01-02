import { Search, MoreVertical } from 'lucide-react';
import { Conversation } from '../types';
import { Badge } from './ui/badge';

interface ChatListProps {
  conversations: Conversation[];
  onSelectChat: (conversationId: string) => void;
}

export function ChatList({ conversations, onSelectChat }: ChatListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1>Conversations</h1>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg">
            All
          </button>
          <button className="px-4 py-2 hover:bg-muted rounded-lg transition-colors">
            Unread
          </button>
          <button className="px-4 py-2 hover:bg-muted rounded-lg transition-colors">
            Recent
          </button>
        </div>
      </div>

      {/* Conversations List */}
      {conversations.length > 0 ? (
        <div>
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectChat(conversation.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b border-border"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img
                    src={conversation.profile.photos[0]}
                    alt={conversation.profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {conversation.profile.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#22C55E] border-2 border-background rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{conversation.profile.name}</span>
                    {conversation.profile.isVerified && (
                      <Badge className="bg-[#4ECDC4] text-white border-0 h-5 px-2 text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {conversation.isTyping ? (
                      <span className="text-[#FBBF24]">typing...</span>
                    ) : (
                      conversation.lastMessage
                    )}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-[#4ECDC4] text-white border-0 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="mb-2">No conversations yet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Like a profile to start chatting
          </p>
        </div>
      )}
    </div>
  );
}
