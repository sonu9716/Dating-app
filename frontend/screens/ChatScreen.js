import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { messageAPI } from '../utils/api';
import { useChat } from '../context/ChatContext';
import { useSafety } from '../context/SafetyContext';
import SafetyBanner from '../components/SafetyBanner';
import EmergencyConfirmButton from '../components/EmergencyConfirmButton';

const ChatBubble = ({ message, isOwn }) => (
  <Animated.View
    entering={FadeInDown.springify()}
    style={[
      styles.bubbleContainer,
      isOwn ? styles.bubbleOwn : styles.bubbleMatch
    ]}
  >
    <LinearGradient
      colors={isOwn ? GRADIENTS.primary : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.08)']}
      style={[
        styles.bubble,
        isOwn ? styles.bubbleOwnShape : styles.bubbleMatchShape,
        message.messageType === 'image' && styles.bubbleImage
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {message.messageType === 'image' ? (
        <View>
          <Image
            source={{ uri: message.mediaUrl ? `https://dating-app-8da6.onrender.com${message.mediaUrl}` : 'https://via.placeholder.com/300' }}
            style={styles.sentImage}
            resizeMode="cover"
          />
          {message.text ? (
            <Text style={[styles.bubbleText, styles.imageCaption, isOwn ? styles.textWhite : styles.textSecondary]}>
              {message.text}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text style={[styles.bubbleText, isOwn ? styles.textWhite : styles.textSecondary]}>
          {message.text}
        </Text>
      )}
    </LinearGradient>
    <Text style={styles.bubbleTime}>
      {message.time || '12:45 PM'}
    </Text>
  </Animated.View>
);

export default function ChatScreen({ route, navigation }) {
  const { match } = route.params;
  const { state, sendMessage, startTyping, stopTyping } = useChat();
  const { liveSession, startLiveSession, endLiveSession, triggerEmergency } = useSafety();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    loadMessages();
  }, [match.matchId]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      await messageAPI.getMessages(match.matchId);
    } catch (err) {
      console.error('Load messages error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      sendMessage(match.matchId, message);
      setMessage('');
      stopTyping(match.matchId);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (text) => {
    setMessage(text);
    if (text.length > 0) {
      startTyping(match.matchId);
    } else {
      stopTyping(match.matchId);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        const selectedImage = result.assets[0];

        // Prepare upload
        const formData = new FormData();
        const filename = selectedImage.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('media', {
          uri: selectedImage.uri,
          name: filename,
          type: type,
        });

        setIsSending(true);
        // Step 1: Upload media
        const uploadRes = await messageAPI.uploadMedia(route.params.match.matchId, formData);

        if (uploadRes.data.success) {
          // Step 2: Send message with media URL
          // In a real E2E system, we would encrypt the URL/metadata here
          sendMessage(route.params.match.matchId, '', 'image', uploadRes.data.data.url);
        }
      }
    } catch (err) {
      console.error('Pick image error:', err);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const messages = state.messages[match.matchId] || [];
  const isOnline = state.onlineUsers[match.id];
  const isTyping = state.typingUsers[match.matchId];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <BlurView tint="light" intensity={20} style={styles.headerBlur}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
              <Ionicons name="chevron-back" size={24} color={COLORS.textWhite} />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Image
                source={{ uri: match.avatar || 'https://via.placeholder.com/150' }}
                style={styles.headerAvatar}
              />
              <View>
                <Text style={styles.headerName}>{match.name}</Text>
                <Text style={styles.headerStatus}>
                  {isTyping ? 'typing...' : (isOnline ? 'Online' : 'Offline')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => {
                if (liveSession) {
                  Alert.alert('End Date Session', 'Are you sure you want to end this live date session?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'End Session', style: 'destructive', onPress: endLiveSession }
                  ]);
                } else {
                  Alert.alert('Start Date Session', 'This will activate safety tracking and notify your emergency contacts if needed.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Start Session', onPress: () => startLiveSession(match, 60) }
                  ]);
                }
              }}
            >
              <Ionicons
                name={liveSession ? "shield-checkmark" : "shield-outline"}
                size={22}
                color={liveSession ? COLORS.modernTeal : COLORS.textWhite}
              />
            </TouchableOpacity>
          </BlurView>
        </View>

        {/* Safety Banner */}
        <SafetyBanner
          onGetHelpPress={() => setShowEmergencyConfirm(true)}
          onReportPress={() => Alert.alert('Report Issue', 'Choose the issue type...', [
            { text: 'Scam/Spam', onPress: () => { } },
            { text: 'Harassment', onPress: () => { } },
            { text: 'Cancel', style: 'cancel' }
          ])}
        />

        {/* Messages */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.neonPink} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <ChatBubble message={item} isOwn={item.isOwn} />
            )}
            keyExtractor={(item, index) => index.toString()}
            inverted
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input Area */}
        <BlurView tint="dark" intensity={50} style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.mediaButton}
              disabled={isSending}
            >
              <Ionicons name="add-circle-outline" size={26} color={COLORS.neonPink} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={message}
              onChangeText={handleTyping}
              multiline
              maxHeight={100}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!message.trim() || isSending}
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                style={styles.sendGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Ionicons name="send" size={18} color="#FFF" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>

      <EmergencyConfirmButton
        visible={showEmergencyConfirm}
        onConfirm={async () => {
          try {
            await triggerEmergency();
            setShowEmergencyConfirm(false);
            Alert.alert('Emergency Alert Sent', 'Your emergency contacts have been notified and shared your location.');
          } catch (err) {
            Alert.alert('Error', 'Failed to send alert.');
          }
        }}
        onCancel={() => setShowEmergencyConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    zIndex: 10,
  },
  headerBlur: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: SPACING[2],
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING[3],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.modernTeal,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[6],
  },
  bubbleContainer: {
    marginBottom: SPACING[4],
    maxWidth: '80%',
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
  },
  bubbleMatch: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
    borderRadius: RADIUS.lg,
  },
  bubbleOwnShape: {
    borderBottomRightRadius: 2,
  },
  bubbleMatchShape: {
    borderBottomLeftRadius: 2,
  },
  bubbleImage: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  sentImage: {
    width: 240,
    height: 300,
    borderRadius: RADIUS.lg,
  },
  imageCaption: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  textWhite: {
    color: '#FFF',
  },
  textSecondary: {
    color: COLORS.textSecondary,
  },
  bubbleTime: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING[4],
    paddingTop: SPACING[4],
    paddingHorizontal: SPACING[4],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.full,
    paddingLeft: SPACING[2],
    paddingRight: 4,
    paddingVertical: 4,
  },
  mediaButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: COLORS.textWhite,
    fontSize: 15,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
