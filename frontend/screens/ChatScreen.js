/**
 * Chat Screen
 * Individual conversation
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../utils/theme';
import { messageAPI } from '../utils/api';
import { useChat } from '../context/ChatContext';
import ChatBubble from '../components/ChatBubble';

export default function ChatScreen({ route, navigation }) {
  const { match } = route.params;
  const { state, sendMessage, startTyping, stopTyping } = useChat();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [match.id]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messageAPI.getMessages(match.id);
      // Update chat context with messages
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      sendMessage(match.id, message);
      setMessage('');
      stopTyping(match.id);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (text) => {
    setMessage(text);
    if (text.length > 0) {
      startTyping(match.id);
    } else {
      stopTyping(match.id);
    }
  };

  const messages = state.messages[match.id] || [];

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.bgPrimary,
          paddingHorizontal: SPACING,
          paddingVertical: SPACING,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: SPACING }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.textPrimary,
          }}
        >
          {match.name}
        </Text>
        <TouchableOpacity style={{ padding: SPACING }}>
          <Ionicons name="more-vert" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <ChatBubble message={item} isOwn={item.isOwn} />
          )}
          keyExtractor={(item) => item.id.toString()}
          inverted
          contentContainerStyle={{
            paddingHorizontal: SPACING,
            paddingVertical: SPACING,
          }}
        />
      )}

      {/* Input */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SPACING,
          paddingVertical: SPACING,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: COLORS.bgSecondary,
            borderRadius: RADIUS.full,
            paddingHorizontal: SPACING,
            paddingVertical: SPACING,
            maxHeight: 100,
            marginRight: SPACING,
          }}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textTertiary}
          value={message}
          onChangeText={handleTyping}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!message.trim() || isSending}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.full,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: !message.trim() || isSending ? 0.5 : 1,
          }}
        >
          {isSending ? (
            <ActivityIndicator
              size="small"
              color={COLORS.bgPrimary}
            />
          ) : (
            <Ionicons name="send" size={20} color={COLORS.bgPrimary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
