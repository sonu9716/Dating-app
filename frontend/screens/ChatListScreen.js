/**
 * Chat List Screen
 * List of all conversations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../utils/theme';
import { matchAPI } from '../utils/api';
import Header from '../components/Header';

export default function ChatListScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const response = await matchAPI.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMatch = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatDetail', { match: item })}
      style={{
        flexDirection: 'row',
        paddingHorizontal: SPACING,
        paddingVertical: SPACING,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 60,
          height: 60,
          borderRadius: RADIUS.full,
          marginRight: SPACING,
        }}
      />

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: COLORS.textSecondary,
            numberOfLines: 1,
          }}
        >
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.full,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: COLORS.bgPrimary, fontWeight: '600' }}>
            {item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.bgPrimary,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgPrimary }}>
      <Header title="Messages" />
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: SPACING,
            }}
          >
            <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>
              No conversations yet
            </Text>
          </View>
        }
      />
    </View>
  );
}
