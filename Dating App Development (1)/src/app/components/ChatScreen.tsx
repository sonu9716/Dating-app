import { useState } from 'react';
import { ArrowLeft, MoreVertical, Send, Smile, Camera, Check, CheckCheck } from 'lucide-react';
import { Conversation, Message } from '../types';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface ChatScreenProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ChatScreen({ conversation, onBack }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(conversation.messages);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: message,
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((msg) => {
      const date = msg.timestamp.toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={conversation.profile.photos[0]}
                alt={conversation.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            {conversation.profile.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-background rounded-full" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span>{conversation.profile.name}</span>
              {conversation.profile.isVerified && (
                <Badge className="bg-[#4ECDC4] text-white border-0 h-5 px-2 text-xs">
                  ✓
                </Badge>
              )}
            </div>
            {conversation.isTyping ? (
              <p className="text-sm text-[#FBBF24]">typing...</p>
            ) : conversation.profile.isOnline ? (
              <p className="text-sm text-[#22C55E]">Online</p>
            ) : (
              <p className="text-sm text-gray-500">
                {conversation.profile.lastActive}
              </p>
            )}
          </div>
        </div>

        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center my-4">
              <span className="text-xs text-gray-500 bg-muted px-3 py-1 rounded-full">
                {date === new Date().toLocaleDateString() ? 'Today' : date}
              </span>
            </div>

            {msgs.map((msg, index) => {
              const isMe = msg.senderId === 'me';
              const showTime = index === 0 || 
                msgs[index - 1].timestamp.getTime() - msg.timestamp.getTime() > 300000;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {showTime && (
                      <span className="text-xs text-gray-500 mb-1 px-3">
                        {formatTime(msg.timestamp)}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isMe
                          ? 'bg-[#FF6B6B] text-white rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    {isMe && (
                      <div className="flex items-center gap-1 mt-1 px-1">
                        {msg.isRead ? (
                          <CheckCheck className="w-3 h-3 text-[#4ECDC4]" />
                        ) : (
                          <Check className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-gray-500" />
          </button>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-muted border-0 rounded-full px-4 focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4]"
          />

          {message.trim() ? (
            <button
              onClick={handleSend}
              className="w-10 h-10 bg-[#4ECDC4] rounded-full flex items-center justify-center hover:bg-[#4ECDC4]/90 transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Camera className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
