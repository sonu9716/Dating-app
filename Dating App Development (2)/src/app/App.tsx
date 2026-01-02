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
import { SafetyCenter } from './components/SafetyCenter';
import { AddEmergencyContact } from './components/AddEmergencyContact';
import { StartDateSession } from './components/StartDateSession';
import { LiveDateBanner } from './components/LiveDateBanner';
import { ReportIssue } from './components/ReportIssue';
import { EmergencyHelp } from './components/EmergencyHelp';
import { CheckInReminder } from './components/CheckInReminder';
import { EndDateSession } from './components/EndDateSession';
import { BottomNav } from './components/BottomNav';
import { mockProfiles, mockConversations, currentUser } from './data/mockData';
import { Profile, Match, EmergencyContact, DateSession } from './types';

type Screen = 
  | 'splash' 
  | 'login' 
  | 'signup' 
  | 'discover'
  | 'zenz'
  | 'chat' 
  | 'profile' 
  | 'settings'
  | 'safetyCenter'
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

  // Safety features state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showStartDateSession, setShowStartDateSession] = useState(false);
  const [activeSession, setActiveSession] = useState<DateSession | null>(null);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);
  const [showCheckInReminder, setShowCheckInReminder] = useState(false);
  const [showEndDateSession, setShowEndDateSession] = useState(false);
  const [dateSessionProfile, setDateSessionProfile] = useState<Profile | null>(null);

  // Show splash screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check-in reminder interval
  useEffect(() => {
    if (activeSession && activeSession.isActive) {
      const interval = setInterval(() => {
        setShowCheckInReminder(true);
        setTimeout(() => setShowCheckInReminder(false), 8000);
      }, activeSession.checkInFrequency * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [activeSession]);

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
            onSafetyCenter={() => setScreen('safetyCenter')}
          />
        )}

        {screen === 'safetyCenter' && isAuthenticated && (
          <SafetyCenter
            key="safetyCenter"
            onBack={() => setScreen('settings')}
            onAddContact={() => setShowAddContact(true)}
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

      {/* Live Date Banner */}
      {activeSession && activeSession.isActive && (
        <LiveDateBanner
          session={activeSession}
          onReportIssue={() => setShowReportIssue(true)}
          onGetHelp={() => setShowEmergencyHelp(true)}
        />
      )}

      {/* Safety Modals */}
      <AddEmergencyContact
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onAdd={(contact) => setEmergencyContacts(prev => [...prev, contact])}
      />

      {dateSessionProfile && (
        <StartDateSession
          isOpen={showStartDateSession}
          onClose={() => setShowStartDateSession(false)}
          onStart={(session) => {
            setActiveSession(session);
            setShowStartDateSession(false);
          }}
          matchProfile={dateSessionProfile}
        />
      )}

      {dateSessionProfile && (
        <ReportIssue
          isOpen={showReportIssue}
          onClose={() => setShowReportIssue(false)}
          profile={dateSessionProfile}
          onBlock={() => {
            setActiveSession(null);
            setShowReportIssue(false);
          }}
        />
      )}

      <EmergencyHelp
        isOpen={showEmergencyHelp}
        onClose={() => setShowEmergencyHelp(false)}
        onConfirm={() => {
          if (activeSession) {
            setActiveSession({ ...activeSession, emergencyActivated: true });
          }
        }}
        emergencyContacts={emergencyContacts}
      />

      <CheckInReminder
        isVisible={showCheckInReminder}
        onAllGood={() => setShowCheckInReminder(false)}
        onNeedHelp={() => {
          setShowCheckInReminder(false);
          setShowEmergencyHelp(true);
        }}
      />

      {activeSession && (
        <EndDateSession
          isOpen={showEndDateSession}
          onClose={() => setShowEndDateSession(false)}
          onConfirm={() => {
            setActiveSession(null);
            setShowEndDateSession(false);
          }}
          session={activeSession}
        />
      )}
    </div>
  );
}

export default App;