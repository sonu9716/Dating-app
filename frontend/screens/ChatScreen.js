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
  Modal,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { messageAPI, matchAPI } from '../utils/api';
import { useChat } from '../context/ChatContext';
import { useSafety } from '../context/SafetyContext';
import SafetyBanner from '../components/SafetyBanner';
import EmergencyConfirmButton from '../components/EmergencyConfirmButton';

const ChatBubble = ({ message, isOwn, onImagePress, onLongPress }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  async function playSound() {
    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      return;
    }

    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: `https://dating-app-8da6.onrender.com${message.mediaUrl}` },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  }

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[
        styles.bubbleContainer,
        isOwn ? styles.bubbleOwn : styles.bubbleMatch
      ]}
    >
      <TouchableOpacity
        onLongPress={() => onLongPress(message)}
        activeOpacity={0.9}
        delayLongPress={500}
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
            <TouchableOpacity onPress={() => onImagePress(message.mediaUrl)}>
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
            </TouchableOpacity>
          ) : message.messageType === 'voice' ? (
            <View style={styles.voiceContainer}>
              <TouchableOpacity style={styles.playButton} onPress={playSound}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={isOwn ? "#FFF" : COLORS.modernTeal} />
              </TouchableOpacity>
              <View style={styles.voiceWaveform}>
                <View style={[styles.voiceProgress, { width: isPlaying ? '50%' : '0%' }]} />
              </View>
              <Text style={[styles.voiceDuration, isOwn ? styles.textWhite : styles.textSecondary]}>0:12</Text>
            </View>
          ) : (
            <Text style={[styles.bubbleText, isOwn ? styles.textWhite : styles.textSecondary]}>
              {message.text}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.bubbleTime}>
        {message.time || '12:45 PM'}
      </Text>
    </Animated.View>
  );
};

export default function ChatScreen({ route, navigation }) {
  const { match: initialMatch } = route.params;
  const [match, setMatch] = useState(initialMatch);
  const { state, getMessages, sendMessage, startTyping, stopTyping } = useChat();
  const { liveSession, startLiveSession, endLiveSession, triggerEmergency } = useSafety();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    loadData();
  }, [initialMatch.matchId]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // If match object is minimal (only has matchId from deep link), fetch full profile
      if (!match.name || !match.avatar) {
        const response = await matchAPI.getMatch(initialMatch.matchId);
        if (response.data.success) {
          setMatch(response.data.data);
        }
      }

      await getMessages(initialMatch.matchId);
    } catch (err) {
      console.error('Load chat data error:', err);
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

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      } else {
        Alert.alert('Permission Denied', 'Please enable microphone access in settings.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);

      // Upload recording
      const formData = new FormData();
      formData.append('media', {
        uri: uri,
        name: 'voice_note.m4a',
        type: 'audio/m4a',
      });

      setIsSending(true);
      const uploadRes = await messageAPI.uploadMedia(match.matchId, formData);
      if (uploadRes.data.success) {
        sendMessage(match.matchId, '', 'voice', uploadRes.data.data.url);
      }
    } catch (err) {
      console.error('Upload voice note error:', err);
      Alert.alert('Error', 'Failed to send voice note.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        const selectedImage = result.assets[0];

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
        const uploadRes = await messageAPI.uploadMedia(route.params.match.matchId, formData);

        if (uploadRes.data.success) {
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

  const messages = state.messages[String(match.matchId)] || [];
  const isOnline = state.onlineUsers[match.id];
  const isTyping = state.typingUsers[String(match.matchId)];

  const handleDeleteMessage = (msg) => {
    if (!msg.isOwn) return;

    Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // In a real app, call API/socket to delete
          // For now, we'll just trigger the local dispatch via ChatContext if feasible
          // Actually, ChatContext has a dispatch but we should ideally have a deleteMessage helper
          // For now, let's just log and assume the socket will handle it once implemented.
          console.log('Delete message:', msg.id);
        }
      }
    ]);
  };

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

            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfile', { userId: match.id, matchId: match.matchId })}
              style={styles.headerTitleContainer}
            >
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
            </TouchableOpacity>

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
              <ChatBubble
                message={item}
                isOwn={item.isOwn}
                onImagePress={(url) => setPreviewImage(url)}
                onLongPress={handleDeleteMessage}
              />
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
              onPress={isRecording ? stopRecording : handlePickImage}
              style={styles.mediaButton}
              disabled={isSending}
            >
              <Ionicons name={isRecording ? "stop-circle" : "add-circle-outline"} size={26} color={COLORS.neonPink} />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder={isRecording ? "Recording..." : "Type a message..."}
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={message}
              onChangeText={handleTyping}
              multiline
              maxHeight={100}
              editable={!isRecording}
            />
            {message.trim().length === 0 && !isRecording ? (
              <TouchableOpacity
                onPress={startRecording}
                style={styles.voiceButton}
                disabled={isSending}
              >
                <Ionicons name="mic-outline" size={24} color={COLORS.textWhite} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={(!message.trim() && !isRecording) || isSending}
                style={[styles.sendButton, !message.trim() && !isRecording && styles.sendButtonDisabled]}
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
            )}
          </View>
        </BlurView>
      </KeyboardAvoidingView>

      {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setPreviewImage(null)}
          >
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
          <Image
            source={{ uri: previewImage ? `https://dating-app-8da6.onrender.com${previewImage}` : null }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

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
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING[2],
  },
  voiceWaveform: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  voiceProgress: {
    height: '100%',
    backgroundColor: COLORS.modernTeal,
  },
  voiceButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceDuration: {
    fontSize: 11,
    marginLeft: SPACING[2],
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  previewImage: {
    width: width,
    height: width * 1.5,
  }
});
