import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      setUserToken(token);
    } catch (err) {
      console.error('Failed to restore token', err);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootNavigator userToken={userToken} />
    </NavigationContainer>
  );
}
