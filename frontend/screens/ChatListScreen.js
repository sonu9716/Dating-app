import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, GRADIENTS } from '../utils/theme';
import { matchAPI } from '../utils/api';
import { useChat } from '../context/ChatContext';

export default function ChatListScreen({ navigation }) {
  const { state: chatState } = useChat();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const response = await matchAPI.getMatches();
      setMatches(response.data.data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMatch = ({ item, index }) => {
    const isOnline = chatState.onlineUsers[item.id];
    const isTyping = chatState.typingUsers[item.matchId];

    return (
      <Animated.View entering={FadeInDown.delay(index * 50)}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatDetail', { match: item })}
          style={styles.chatItem}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: item.avatar || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            {isOnline && <View style={styles.onlineBadge} />}
          </View>

          <View style={styles.chatInfo}>
            <View style={styles.chatHeaderRow}>
              <Text style={styles.matchName}>
                {item.name}
              </Text>
              <Text style={styles.timeText}>
                {item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:45 PM'}
              </Text>
            </View>

            <View style={styles.chatFooterRow}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {isTyping ? (
                  <Text style={{ color: COLORS.modernTeal }}>typing...</Text>
                ) : (
                  item.lastMessage || 'Start a conversation!'
                )}
              </Text>
              {item.unreadCount > 0 && (
                <LinearGradient
                  colors={GRADIENTS.primary}
                  style={styles.unreadBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                </LinearGradient>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.bgDark, COLORS.bgDarkSecondary]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <BlurView tint="light" intensity={20} style={styles.headerBlur}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color={COLORS.textWhite} />
          </TouchableOpacity>
        </BlurView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.neonPink} />
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => (item.matchId || item.id).toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="chatbubbles-outline" size={60} color="rgba(255,255,255,0.1)" />
              </View>
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>Like some profiles to start matching!</Text>
            </Animated.View>
          }
        />
      )}
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  searchButton: {
    position: 'absolute',
    right: SPACING[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: 40,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING[4],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: COLORS.bgDark,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  chatFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: SPACING[2],
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    marginBottom: SPACING[4],
  },
  emptyText: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtext: {
    color: COLORS.textTertiary,
    fontSize: 14,
    marginTop: 8,
  }
});
