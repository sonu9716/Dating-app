import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { DiscoveryScreen } from './components/DiscoveryScreen';
import { ZenzDatingTab } from './components/ZenzDatingTab';
import { MatchNotification } from './components/MatchNotification';
import { ChatList } from './components/ChatList';
import { ChatScreen } from './components/ChatScreen';
import { ProfileView } from './components/ProfileView';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { mockProfiles, mockConversations, currentUser } from './data/mockData';
import { Profile, Match } from './types';

type Screen = 
  | 'splash' 
  | 'login' 
  | 'signup' 
  | 'discover'
  | 'zenz'
  | 'chat' 
  | 'profile' 
  | 'settings'
  | 'chatDetail'
  | 'profileView';

function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<'discover' | 'zenz' | 'matches' | 'chat' | 'profile'>('discover');
  const [profiles, setProfiles] = useState(mockProfiles);
  const [matches, setMatches] = useState<Match[]>([]);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [newMatch, setNewMatch] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Show splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setScreen('discover');
  };

  const handleSignUpComplete = () => {
    setIsAuthenticated(true);
    setScreen('discover');
  };

  const handleLike = (profile: Profile) => {
    // Simulate match (50% chance)
    if (Math.random() > 0.5) {
      const match: Match = {
        id: `match-${Date.now()}`,
        profile,
        matchedAt: new Date()
      };
      setMatches(prev => [...prev, match]);
      setNewMatch(profile);
      setShowMatchNotification(true);
    }
  };

  const handlePass = (profile: Profile) => {
    console.log('Passed:', profile.name);
  };

  const handleSuperLike = (profile: Profile) => {
    // Super likes always match
    const match: Match = {
      id: `match-${Date.now()}`,
      profile,
      matchedAt: new Date()
    };
    setMatches(prev => [...prev, match]);
    setNewMatch(profile);
    setShowMatchNotification(true);
  };

  const handleSendMessage = () => {
    setShowMatchNotification(false);
    setScreen('chat');
    setActiveTab('chat');
  };

  const handleKeepSwiping = () => {
    setShowMatchNotification(false);
  };

  const handleTabChange = (tab: 'discover' | 'zenz' | 'matches' | 'chat' | 'profile') => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'discover':
        setScreen('discover');
        break;
      case 'zenz':
        setScreen('zenz');
        break;
      case 'chat':
        setScreen('chat');
        break;
      case 'profile':
        setSelectedProfile(currentUser);
        setScreen('profileView');
        break;
      case 'matches':
        // Show matches view (could be a separate screen)
        setScreen('discover');
        break;
    }
  };

  const handleSelectChat = (conversationId: string) => {
    setSelectedChat(conversationId);
    setScreen('chatDetail');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setScreen('login');
    setProfiles(mockProfiles);
    setMatches([]);
    setConversations(mockConversations);
  };

  const unreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <SplashScreen key="splash" />
        )}

        {screen === 'login' && (
          <LoginScreen
            key="login"
            onLogin={handleLogin}
            onSignUp={() => setScreen('signup')}
          />
        )}

        {screen === 'signup' && (
          <SignUpScreen
            key="signup"
            onComplete={handleSignUpComplete}
            onBack={() => setScreen('login')}
          />
        )}

        {screen === 'discover' && isAuthenticated && (
          <div key="discover" className="pb-20">
            <DiscoveryScreen
              profiles={profiles}
              onLike={handleLike}
              onPass={handlePass}
              onSuperLike={handleSuperLike}
              onSettings={() => setScreen('settings')}
            />
          </div>
        )}

        {screen === 'zenz' && isAuthenticated && (
          <div key="zenz" className="pb-20">
            <ZenzDatingTab />
          </div>
        )}

        {screen === 'chat' && isAuthenticated && (
          <div key="chat" className="pb-20">
            <ChatList
              conversations={conversations}
              onSelectChat={handleSelectChat}
            />
          </div>
        )}

        {screen === 'chatDetail' && selectedChat && isAuthenticated && (
          <ChatScreen
            key="chatDetail"
            conversation={conversations.find(c => c.id === selectedChat)!}
            onBack={() => setScreen('chat')}
          />
        )}

        {screen === 'profileView' && selectedProfile && isAuthenticated && (
          <div key="profileView" className="pb-20">
            <ProfileView
              profile={selectedProfile}
              onBack={() => {
                setScreen(activeTab === 'profile' ? 'discover' : activeTab);
                setActiveTab(activeTab === 'profile' ? 'discover' : activeTab);
              }}
            />
          </div>
        )}

        {screen === 'settings' && isAuthenticated && (
          <SettingsScreen
            key="settings"
            onBack={() => setScreen('discover')}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Match Notification Overlay */}
      <AnimatePresence>
        {showMatchNotification && newMatch && (
          <MatchNotification
            key="match"
            profile={newMatch}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onKeepSwiping={handleKeepSwiping}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {isAuthenticated && screen !== 'settings' && screen !== 'chatDetail' && screen !== 'signup' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadCount={unreadCount}
        />
      )}
    </div>
  );
}

export default App;