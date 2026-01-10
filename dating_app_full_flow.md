# Complete Dating App Flow: Match → Notification → Chat → Persistence
## Tinder, Bumble, and Hinge Implementation Guide

**Last Updated:** January 2026  
**Context:** Full-stack implementation for match creation, notification dispatch, profile fetching, real-time chat, and message persistence across Tinder, Bumble, and Hinge paradigms.

---

## TABLE OF CONTENTS

1. [Core Data Models](#core-data-models)
2. [Tinder Flow (Both-Can-Message Variant)](#tinder-flow)
3. [Bumble Flow (Women-First Message Variant)](#bumble-flow)
4. [Hinge Flow (Intentional Dating Variant)](#hinge-flow)
5. [Notification System Architecture](#notification-system)
6. [Chat Persistence & History](#chat-persistence)
7. [Real-Time Chat Implementation](#real-time-chat)
8. [Complete API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)

---

## CORE DATA MODELS

### User Entity
```
User {
  id: UUID,
  name: string,
  age: number,
  gender: "male" | "female" | "non-binary",
  bio: string,
  photos: Photo[],         // URLs to S3 or similar
  preferences: {
    minAge: number,
    maxAge: number,
    genderPreference: string[],
    maxDistance: number (km),
    interests: string[],
    datingIntent: "casual" | "serious" | "not-sure"
  },
  location: {
    latitude: number,
    longitude: number,
    city: string,
    updatedAt: timestamp
  },
  status: "active" | "inactive" | "banned",
  deviceTokens: string[],      // For push notifications
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Like Entity (Tinder / Hinge style)
```
Like {
  id: UUID,
  likerId: UUID,
  likedId: UUID,
  decision: "like" | "pass",
  message?: string,            // For Hinge: optional text with like
  createdAt: timestamp,
  
  CONSTRAINT: UNIQUE(likerId, likedId)  // One like per pair
}
```

### Match Entity
```
Match {
  id: UUID,
  userAId: UUID,               // Always lower ID
  userBId: UUID,               // Always higher ID
  app_type: "tinder" | "bumble" | "hinge",
  
  // Tinder: both can message from start
  // Bumble: responder_id (userB) must message first
  initiatorId?: UUID,          // For Bumble: who liked first
  responder_accepted: boolean, // For Bumble: did woman message within 24h?
  expiration_time?: timestamp, // For Bumble: match expires in 24h if woman doesn't message
  
  // Hinge: Match only after mutual like
  is_active: boolean,
  is_unmatched: boolean,
  last_message_at?: timestamp,
  unmatched_by?: UUID,
  unmatch_reason?: string,
  
  createdAt: timestamp,
  unmatched_at?: timestamp
}
```

### Message Entity
```
Message {
  id: UUID,
  matchId: UUID,
  senderId: UUID,
  receiverId: UUID,
  text: string,
  media_urls?: string[],
  type: "text" | "image" | "voice" | "video",
  
  status: "sent" | "delivered" | "read",
  sent_at: timestamp,
  delivered_at?: timestamp,
  read_at?: timestamp,
  
  // For chat persistence
  createdAt: timestamp,
  
  CONSTRAINT: FOREIGN KEY(matchId) REFERENCES Match
  CONSTRAINT: senderId and receiverId must be the two users in Match
}
```

### Notification Entity
```
Notification {
  id: UUID,
  userId: UUID,
  type: "new_match" | "new_message" | "like_received" | "message_unread",
  relatedUserId?: UUID,        // Who this notification is about
  relatedMatchId?: UUID,
  relatedMessageId?: UUID,
  
  title: string,
  body: string,
  
  is_read: boolean,
  action_url: string,          // Deep link to profile or chat
  
  createdAt: timestamp,
  readAt?: timestamp,
  
  // Device-level push status
  push_sent: boolean,
  push_failed: boolean,
  error_message?: string
}
```

---

## TINDER FLOW

### Step 1: User Swipes Right (Like Creation)
```
POST /swipes

Request Body:
{
  "targetUserId": "user-123",
  "decision": "like"
}

Backend Logic:
1. Validate: Current user is not swiping themselves
2. Check: Swipe not already created for this pair
3. Create or update Like record with decision = "like"
4. Check mutual interest:
   - Query: SELECT * FROM Like WHERE likerId = targetUserId AND likedId = currentUserId
   - If mutual like exists:
     5a. Check if Match already exists (prevent duplicates)
     5b. Create Match record:
         - userAId = min(currentUserId, targetUserId)
         - userBId = max(currentUserId, targetUserId)
         - app_type = "tinder"
         - is_active = true
     5c. Emit "MatchCreated" event to pub/sub (Redis / RabbitMQ)
     5d. Return { matchCreated: true, matchId, message: "It's a Match!" }
   - Else:
     Return { matchCreated: false, message: "Like sent" }
```

### Step 2: Match Creation & Full-Screen Modal
```
When matchCreated event is published:

A) On currentUser's device (who just swiped):
   - Display full-screen modal with:
     - Matched user's main photo (animated expansion)
     - Text: "It's a Match!"
     - Two buttons: "Send Message" | "Keep Swiping"
   - If "Send Message": Navigate to chat screen
   - If "Keep Swiping": Close modal, return to feed

B) On targetUser's device (who already liked):
   - Queue push notification if device online/offline
   - Show modal when app is opened
```

### Step 3: Notification Dispatch
```
When Match is created:

A) Push Notification Service:
   1. Fetch both users' deviceTokens
   2. For each user, send push with:
      - title: "[User Name] liked you back!"
      - body: "It's a match! Send a message to get started."
      - deepLink: "tinder://match/{matchId}"
   3. Log notification record with status

B) Real-time Event (WebSocket):
   - Emit to user's socket room: { type: "new_match", matchId, otherUser: {...} }

C) Notification Tab:
   - Add to user's notification list (visible immediately)
   - Badge count incremented
```

---

## BUMBLE FLOW

### Key Difference: Women Must Message First Within 24 Hours

### Step 1-2: Same as Tinder (Like & Match Creation)
```
Same as Tinder swipe flow, but Match object includes:
{
  ...matchData,
  initiatorId: likerUserId,  // Who liked first (irrelevant for Bumble)
  responder_accepted: false, // Woman hasn't sent first message yet
  expiration_time: now() + 24 hours
}
```

### Step 3: Notification with Timer Warning
```
When Match created on Bumble:

A) For the WOMAN (who must message):
   - Full-screen modal same as Tinder
   - Special UI: "Say hello in the next 24 hours!"
   - Timer displayed: "23:59:00 remaining"
   - "Send Message" button highlighted

B) For the MAN:
   - Notification: "Waiting for [Woman Name] to say hello..."
   - Can see the match but CANNOT send the first message
   - Chat appears in matches list but greyed out until woman messages

C) Timer/Expiration Handler (cron job):
   - Every minute: Check matches with expiration_time < now()
   - If responder_accepted == false: Set is_active = false, is_unmatched = true
   - Send notification to man: "Expired"
   - Show to woman: "Time's up!"
   - Both users: Match moves to "Expired" section
```

### Step 4: Woman Sends First Message
```
POST /matches/{matchId}/messages

Check:
1. Current user must be the responder (woman)
2. Match must not be expired
3. Message count == 0 (this is the first)

On success:
1. Create Message record
2. Set responder_accepted = true
3. Update last_message_at
4. Remove expiration timer
5. Send notification to man: "[Woman Name] sent you a message!"
6. Broadcast to man's WebSocket: { type: "first_message_received", ... }

Now BOTH can continue messaging freely.
```

---

## HINGE FLOW

### Key Difference: No Swiping; Like = Send Thoughtful Message

### Step 1: User Likes a Profile (with Optional Message)
```
POST /likes

Request Body:
{
  "profileId": "user-456",
  "message": "I love your answer about travel! Where's your dream destination?",  // Optional
  "likedElementId": "photo-3"  // Could be a specific photo or prompt answer
}

Backend:
1. Create Like record:
   - likerId = currentUser
   - likedId = profileId
   - message = optionalMessage
   - decision = "like"

2. Create Notification for profileUser:
   - type: "like_received"
   - body: "You received a like! Check them out."
   - Include the message if provided
```

### Step 2: Profile User Responds
```
When profileUser opens "Likes You" tab:
- See: currentUser's full profile + message they sent
- Options: 
  A) "Like Back" → Creates Match
  B) "Pass" → Delete Like, hide this profile
  C) View Full Profile → Scroll through photos/prompts, then decide

POST /likes/{likeId}/respond

Request Body:
{
  "decision": "accept"  // or "reject"
}

If Accept:
1. Create Match record with both Like records present
2. Unlock chat automatically
3. Show "It's a Match!" modal
4. Display Hinge's version: 
   - "You have a new conversation"
   - Show first message from initial liker
   - "Your turn to message" indicator

If Reject:
1. Delete/archive Like
2. Hide from both sides
```

### Step 3: Hinge Chat Organization
```
Chat Tab shows THREE sections:

A) "Your Turn" (Chats where YOU haven't responded):
   - Blue indicator: "YOUR TURN"
   - Shows last message from other person
   - Sorted by most recent
   - User sees: "I need to reply to this"

B) "Their Turn" (Chats where THEY haven't responded):
   - Shows your last message
   - Grayed out or lower priority
   - Helps users manage expectations

C) "Hidden" (Inactive 14+ days):
   - Auto-hidden after 14 days of inactivity
   - Reappears if other person messages
   - Keeps inbox clean

This structure encourages active communication and responsibility.
```

---

## NOTIFICATION SYSTEM

### Architecture Overview
```
User Action
    ↓
Event Published to Message Queue (Redis Pub/Sub or RabbitMQ)
    ↓
Notification Service (subscribes to events)
    ├─ Fetch user preferences
    ├─ Fetch device tokens
    ├─ Build notification payload
    ├─ Send via FCM (Firebase Cloud Messaging) / APNs (iOS)
    └─ Log notification record in DB
    ↓
Device receives push notification
    ↓
User taps notification → Deep link opens profile/chat
```

### Event Types & Notification Triggers
```
1. NEW_MATCH_CREATED
   - Triggered: When Match record inserted
   - Payload:
     {
       "type": "new_match",
       "title": "[User Name] likes you!",
       "body": "You have a new match.",
       "deepLink": "app://match/{matchId}",
       "imageUrl": "otherUser.profilePhoto"
     }
   - Send to: Both matched users

2. NEW_MESSAGE_RECEIVED
   - Triggered: When Message inserted AND receiver is offline
   - Payload:
     {
       "type": "new_message",
       "title": "[User Name]",
       "body": messageText.substring(0, 100),  // Preview
       "deepLink": "app://chat/{matchId}",
       "badge": unreadCount
     }
   - Send to: Receiver only
   - Skip if: Receiver has read receipts disabled OR is in app

3. LIKE_RECEIVED (Hinge/Bumble):
   - Triggered: When Like created
   - Payload:
     {
       "type": "like_received",
       "title": "[User Name] sent you a like",
       "body": likeMessage || "Check them out!",
       "deepLink": "app://likes-you/{likeId}"
     }

4. MATCH_EXPIRING_SOON (Bumble):
   - Triggered: 2 hours before expiration OR 30 min before expiration
   - Payload:
     {
       "type": "match_expiring",
       "title": "Say hello!",
       "body": "Your match expires in {timeRemaining}",
       "deepLink": "app://match/{matchId}"
     }

5. ACTIVITY_REMINDER:
   - Triggered: User hasn't opened app in 7 days
   - Payload:
     {
       "type": "activity_reminder",
       "title": "You have new activity",
       "body": "Check out your matches and likes!",
       "deepLink": "app://home"
     }
```

### Deep Linking Flow
```
User receives notification
    ↓
User taps notification
    ↓
Deep link URI parsed: app://match/match-uuid-123

iOS/Android handles deep link
    ↓
Navigate to MatchDetailsScreen/ChatScreen
    ↓
Fetch match data via API
    ↓
Fetch other user's profile (if coming from match notification)
    ↓
Fetch chat history (if coming from message notification)
    ↓
Display content on screen
```

### Notification Delivery Guarantees
```
At-least-once delivery:
1. Notification persisted in DB before sending
2. Attempt to send via FCM/APNs
3. If device unreachable, keep in queue for retry
4. Retry with exponential backoff: 1min, 5min, 30min, 2h, 24h
5. After 72h, mark as failed

User Preferences:
- Global toggle: "Allow notifications"
- Per-match: "Enable notifications for this chat"
- Per-category: "New messages", "Likes", "Matches", "Reminders"
- Quiet hours: 22:00 - 08:00 (no notifications)

Database record:
{
  notificationId,
  userId,
  type,
  relatedMatchId,
  isPushed: boolean,
  pushed_at: timestamp,
  push_failed: boolean,
  delivery_error: string,
  is_read: boolean,
  read_at: timestamp
}
```

---

## CHAT PERSISTENCE

### Message Storage Strategy
```
Database: All messages stored in Message table (append-only)

Schema:
{
  id: UUID (PK),
  matchId: UUID (FK),
  senderId: UUID,
  receiverId: UUID,
  text: string,
  type: enum("text", "image", "voice"),
  media_urls: string[],
  
  status: enum("sent", "delivered", "read"),
  sent_at: timestamp,
  delivered_at: timestamp,
  read_at: timestamp,
  
  createdAt: timestamp (indexed),
  updatedAt: timestamp
}

Indexes:
- matchId + createdAt (for message history pagination)
- senderId + createdAt (for analytics)
- status (for unread message counts)
```

### Message History Retrieval
```
GET /matches/{matchId}/messages?limit=50&cursor=message-id

Pagination strategy (cursor-based):
1. Query messages for this match, ordered by createdAt DESC
2. If cursor provided: Start after cursor
3. Return latest 50 messages
4. Return next_cursor for pagination

Response:
{
  messages: [
    {
      id, senderId, text, type, status, sent_at, read_at, createdAt
    },
    ...
  ],
  next_cursor: "msg-uuid-999",
  has_more: true
}

Client behavior:
- Fetch initial 50 messages on chat open
- Display newest messages at bottom
- User scrolls up to load older messages
- Use cursor to fetch next batch (50 more)
```

### Read Receipts & Status Updates
```
When user opens a chat:
1. Fetch all unread messages in that match
2. Update status to "delivered"
3. Emit event to sender's WebSocket: { type: "message_delivered", messageId }

When user scrolls into view of message:
1. Mark message as "read"
2. Update read_at timestamp
3. Emit event to sender: { type: "message_read", messageId, readAt }

Sender sees:
- ✓ (sent)
- ✓✓ (delivered)
- ✓✓ (blue, if read)

Note: Hinge hides read receipts to reduce pressure. Instead:
- Show "Your turn" label to remind conversation responsibility
- No explicit "read at {time}" shown
```

### Message Retention Policy
```
Tinder:
- Chats visible while match is active
- Unmatch → messages disappear from both sides
- No archive option
- Data retention (backend): 2 years for disputes

Bumble:
- Same as Tinder
- Expired matches (24h, woman didn't message) → chat hidden
- Can be re-matched later

Hinge:
- Messages persist while match is active
- After unmatch: Messages visible for user for 30 days ("Hidden" section)
- Click "We Met" → Moves to separate "Dates" section (for sentiment analysis)
- Full data export: User can request all their messages (2-year history)
- Delete account → All messages deleted within 3 months (except legal holds)

Implementation:
- Soft-delete: Mark is_unmatched = true, don't delete messages
- Query: Only show messages where Match.is_active = true OR (is_unmatched AND within_retention_period)
- Cron job: Every day, hard-delete messages older than retention period
```

### Handling Message Failures
```
Client attempts to send message
    ↓
Optimistic UI: Show message immediately (gray/pending)
    ↓
Send to server: POST /matches/{matchId}/messages
    ↓
Server: Validate, persist, return messageId + sent_at

If server error (timeout, network, 5xx):
- Retry with exponential backoff (1s, 3s, 10s, 30s)
- Show UI: "Retrying..." badge on message
- Max 5 retries over 1 minute

If persistent failure:
- Show UI: "Failed to send" red badge
- User can tap to retry
- Auto-delete from DB if not delivered within 24h

If server success:
- Update message status to "sent" + sent_at
- Broadcast to receiver via WebSocket (delivered immediately if online)
```

---

## REAL-TIME CHAT IMPLEMENTATION

### WebSocket Architecture
```
Technology: Socket.IO (Node.js) or similar

Connection Flow:
1. User opens chat screen
2. WebSocket connects with JWT auth token
3. User joins room: "match:{matchId}"
4. Emit: { type: "user_joined", userId, matchId }

Rooms:
- Global: "notifications"  (for new match alerts)
- Per-match: "match:{matchId}"  (for messages in that chat)
- Per-user: "user:{userId}"  (for direct notifications)

Events:
A) Client → Server:
   - "send_message": { text, type, mediaUrls }
   - "typing": { isTyping: true/false }
   - "mark_read": { messageId }
   - "user_left_chat": {}

B) Server → Client:
   - "message_received": { id, senderId, text, sent_at }
   - "message_delivered": { messageId, deliveredAt }
   - "message_read": { messageId, readAt }
   - "user_typing": { userId, isTyping }
   - "user_joined": { userId }
```

### Send Message Flow (Real-Time)
```
User types message in chat UI and taps "Send"
    ↓
Client emits: socket.emit("send_message", { text: "Hi!" })
    ↓
Server receives event in "match:{matchId}" room
    ↓
Server validates:
  - User is authenticated
  - User is part of this match
  - Match is active (not unmatched)
  - Message not empty
  - No spam/rate limiting violations
    ↓
Server persists to DB: INSERT INTO Message(...)
    ↓
Server broadcasts back to room:
  socket.to("match:{matchId}").emit("message_received", {
    messageId,
    senderId,
    text,
    type: "text",
    status: "sent",
    sent_at: now
  })
    ↓
Receiver's client:
  - Receives event
  - Displays message in chat
  - Auto-scrolls to latest message
  - Updates unread count
    ↓
Receiver's client marks as delivered:
  - Emits: socket.emit("mark_read", { messageId })
    ↓
Server updates Message.status = "delivered" + delivered_at
  - Broadcasts: socket.emit("message_delivered", { messageId, deliveredAt })
    ↓
Sender's client receives broadcast
  - Updates message status UI (show double checkmark)
```

### Typing Indicators
```
User is typing in message input field
    ↓
Client emits: socket.emit("typing", { isTyping: true })
    ↓
Server broadcasts to other user in room:
  socket.to("match:{matchId}").emit("user_typing", { userId, isTyping: true })
    ↓
Receiver sees: "[User Name] is typing..."
    ↓
After 3 seconds of no typing:
  Client auto-emits: socket.emit("typing", { isTyping: false })
    ↓
Receiver sees typing indicator disappear
```

### Offline Message Handling
```
Receiver is offline when message sent

A) Message Queuing:
   1. Server receives message
   2. Check: Is receiver connected via WebSocket?
   3. If NO:
      - Persist message to DB (done anyway)
      - DO NOT broadcast (receiver not online)
      - Add to receiver's unread queue

B) Receiver Comes Online:
   1. User opens app, WebSocket reconnects
   2. Server: SELECT unread messages for this user
   3. Send to client in batches: { unread_messages: [...] }
   4. Client displays all unread messages at once
   5. Client marks all as delivered

C) Push Notification:
   1. When message sent AND receiver offline
   2. Async: Fetch receiver's deviceTokens
   3. Send FCM/APNs push with message preview
   4. User taps notification → Opens app → Loads chat
```

---

## API ENDPOINTS

### Authentication
```
POST /auth/register
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
```

### Feed & Discovery
```
GET /feed?limit=10&offset=0
  Query latest profiles for swiping
  Excludes: Already swiped, unmatched, blocked
  Respects: User preferences, location, age, distance

GET /feed/profile/{userId}
  Get full details of a profile (for viewing before swiping)

GET /suggestions
  Get "suggested" profiles based on algorithm

POST /profile/me
  Update current user's profile

PUT /profile/me/photos
  Upload/reorder photos

GET /profile/{userId}
  Get another user's public profile
```

### Swipe Interactions
```
POST /swipes
  Body: { targetUserId, decision: "like" | "pass" }
  Response: { matchCreated, matchId?, message }

GET /swipes/history?limit=50
  Get history of swipes made (if available in app)

POST /swipes/{userId}/undo
  (Tinder Plus feature) Undo last swipe
```

### Matches
```
GET /matches?limit=20&offset=0
  Get all active matches
  Sort by: last_message_at DESC
  Include: Other user's mini-profile, last message preview

GET /matches/{matchId}
  Get details of specific match
  Response: { matchId, userA, userB, createdAt, lastMessageAt, is_active }

POST /matches/{matchId}/unmatch
  Unmatch (both users)
  Body: { reason?: "not interested" | "had bad experience" | "already dating" }

GET /matches?status=expired
  (Bumble only) Get expired matches

POST /matches/{matchId}/report
  Report a user
  Body: { reason, details }
```

### Likes (Hinge/Bumble)
```
GET /likes
  Get all likes received

GET /likes/{likeId}
  Get details of a specific like

POST /likes
  Send a like
  Body: { profileId, message?: "...", likedElementId?: "photo-3" }

POST /likes/{likeId}/accept
  Accept a like (creates match)

POST /likes/{likeId}/reject
  Reject a like (hides user)
```

### Chat & Messages
```
GET /matches/{matchId}/messages?limit=50&cursor=message-id-xxx
  Get paginated chat history
  Cursor-based pagination for timeline

POST /matches/{matchId}/messages
  Send a message
  Body: { text, type: "text" | "image" | "voice", mediaUrls?: [...] }
  Response: { messageId, status: "sent", sent_at, read_at: null }

PUT /messages/{messageId}/read
  Mark message as read
  Body: { read_at: timestamp }

DELETE /matches/{matchId}/messages/{messageId}
  Delete a message (soft-delete, may hide but not purge)

GET /messages/unread-count
  Get total unread message count across all matches
```

### Notifications
```
GET /notifications?limit=50&offset=0
  Get notification history

GET /notifications/unread-count
  Get count of unread notifications

PUT /notifications/{notificationId}/read
  Mark notification as read

DELETE /notifications/{notificationId}
  Dismiss a notification

PUT /settings/notifications
  Update notification preferences
  Body: {
    "enabled": true,
    "types": ["match", "message", "like"],
    "quiet_hours": { "start": "22:00", "end": "08:00" },
    "per_match": { "matchId": { "enabled": false } }
  }

POST /settings/device-token
  Register device for push notifications
  Body: { token, platform: "ios" | "android" }
```

### Deep Linking
```
Universal Links (iOS) / App Links (Android):
  myapp://match/{matchId}
  myapp://user/{userId}
  myapp://likes-you/{likeId}
  myapp://notifications

Routing:
  - Parse deep link URI in app
  - Navigate to appropriate screen
  - Fetch data asynchronously
  - Show loading state while fetching
```

---

## DATABASE SCHEMA

### Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  age INT,
  gender VARCHAR(50),
  bio TEXT,
  
  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city VARCHAR(255),
  
  -- Preferences
  min_age_preference INT,
  max_age_preference INT,
  gender_preference JSONB,  -- ["male", "female"]
  max_distance_km INT,
  interests JSONB,          -- ["travel", "music", ...]
  dating_intent VARCHAR(50), -- "casual", "serious"
  
  status VARCHAR(50),       -- "active", "inactive", "banned"
  device_tokens JSONB,      -- [{ token, platform, created_at }]
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_email(email),
  INDEX idx_location(latitude, longitude),
  INDEX idx_created_at(created_at)
);
```

#### likes
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY,
  liker_id UUID NOT NULL REFERENCES users(id),
  liked_id UUID NOT NULL REFERENCES users(id),
  decision VARCHAR(50),     -- "like", "pass"
  message TEXT,             -- For Hinge: message sent with like
  liked_element_id VARCHAR(255), -- "photo-3", "prompt-answer-5"
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(liker_id, liked_id),
  INDEX idx_liked_id(liked_id),
  INDEX idx_decision(decision)
);
```

#### matches
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  user_a_id UUID NOT NULL REFERENCES users(id),
  user_b_id UUID NOT NULL REFERENCES users(id),
  
  app_type VARCHAR(50),     -- "tinder", "bumble", "hinge"
  
  -- Bumble specific
  initiator_id UUID,
  responder_accepted BOOLEAN DEFAULT FALSE,
  expiration_time TIMESTAMP, -- 24h after match for Bumble
  
  -- General state
  is_active BOOLEAN DEFAULT TRUE,
  is_unmatched BOOLEAN DEFAULT FALSE,
  unmatched_by UUID,
  unmatched_at TIMESTAMP,
  unmatch_reason VARCHAR(255),
  
  last_message_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_a_id, user_b_id),
  INDEX idx_user_a(user_a_id, is_active),
  INDEX idx_user_b(user_b_id, is_active),
  INDEX idx_last_message(last_message_at DESC),
  INDEX idx_expiration(expiration_time)
);
```

#### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  
  text TEXT,
  type VARCHAR(50),         -- "text", "image", "voice"
  media_urls JSONB,
  
  status VARCHAR(50),       -- "sent", "delivered", "read"
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_match_created(match_id, created_at),
  INDEX idx_receiver_unread(receiver_id, status),
  INDEX idx_sender(sender_id, created_at)
);
```

#### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50),         -- "new_match", "new_message", "like_received"
  
  related_user_id UUID REFERENCES users(id),
  related_match_id UUID REFERENCES matches(id),
  related_message_id UUID REFERENCES messages(id),
  
  title VARCHAR(255),
  body TEXT,
  action_url VARCHAR(255),
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Push delivery tracking
  push_sent BOOLEAN DEFAULT FALSE,
  push_failed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_unread(user_id, is_read),
  INDEX idx_user_created(user_id, created_at)
);
```

#### user_blocks
```sql
CREATE TABLE user_blocks (
  id UUID PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES users(id),
  blocked_id UUID NOT NULL REFERENCES users(id),
  reason VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(blocker_id, blocked_id),
  INDEX idx_blocked_id(blocked_id)
);
```

#### user_reports
```sql
CREATE TABLE user_reports (
  id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_id UUID NOT NULL REFERENCES users(id),
  reason VARCHAR(255),
  details TEXT,
  status VARCHAR(50),       -- "open", "investigating", "closed"
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_status(status)
);
```

#### notification_preferences
```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  
  enabled BOOLEAN DEFAULT TRUE,
  types JSONB,              -- { "match": true, "message": true, "like": false }
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes Summary
```
- users: email, location, created_at
- likes: liker+liked (unique), liked_id, decision
- matches: user_a+user_b (unique), user_a+active, user_b+active, last_message_at, expiration_time
- messages: match_id+created_at (for pagination), receiver_id+status (unread), sender_id+created_at
- notifications: user_id+is_read (for unread count), user_id+created_at
- user_blocks: blocker_id+blocked_id (unique), blocked_id
- user_reports: status
```

---

## IMPLEMENTATION FLOW DIAGRAMS

### Complete Match → Notification → Chat Flow

```
┌─────────────────────────────────────────────────────────────┐
│ USER A SWIPES RIGHT ON USER B                              │
│ POST /swipes { targetUserId: B, decision: "like" }         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ Store Like(A→B, "like")        │
        │ Check: Does Like(B→A) exist?   │
        └────────────────────────────────┘
                         │
         ┌───────────────┴────────────────┐
         │                                │
    NO MUTUAL                      MUTUAL LIKE
         │                                │
         ▼                                ▼
    Return:                    ┌──────────────────────┐
    {matchCreated:             │ Create Match(A, B)   │
     false}                    │ app_type = "tinder"  │
                               │ is_active = true     │
                               └──────────┬───────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         │                                 │
                         ▼                                 ▼
                 ┌─────────────────┐          ┌──────────────────────┐
                 │ EVENT: Publish  │          │ Socket.IO Broadcast  │
                 │ MatchCreated    │          │ to user:A, user:B    │
                 │ to Pub/Sub       │          │ event: "new_match"   │
                 └────────┬────────┘          └──────────┬───────────┘
                          │                              │
            ┌─────────────┴──────────────┐               │
            │                            │               │
            ▼                            ▼               ▼
      ┌──────────────┐         ┌──────────────┐    ┌────────────┐
      │ Push Service │         │Notification  │    │ In-App UI  │
      │              │         │ Dispatcher   │    │ "It's a    │
      │ Fetch device │         │              │    │ Match!"    │
      │ tokens       │         │ Create       │    │ Modal      │
      │              │         │ Notification │    │            │
      │ Send FCM/APNs│         │ Records      │    └────────────┘
      │ push to both │         │              │
      │ users        │         │ Notify       │
      └──────────────┘         │ service      │
                               └──────────────┘
                                      │
                                      ▼
                         User sees: "[User Name] likes you back!"
                         Taps: Open chat OR Keep swiping
                                      │
                    ┌───────────────┬─┴──────────────┬──────────────┐
                    │               │                │              │
                    ▼               ▼                ▼              ▼
            "Send Message"   "Keep Swiping"   (Notification    (WebSocket
            Button tapped     Button tapped     inbox)          already
                    │               │                │         delivered)
                    │               │                │
         Navigate to chat    Return to feed    User taps        Appears
              screen         Keep swiping      notification    immediately
                    │               │              │           in app
                    └───────┬───────┘              │
                            │                      ▼
                            └────────────┬────► Chat Screen
                                        │
                                        ▼
                            Fetch match details
                            Fetch message history
                            Connect WebSocket to
                            "match:{matchId}" room
```

### Message Send Flow (Real-Time)

```
User types message & taps Send
            │
            ▼
    Emit: socket.emit("send_message", { text })
            │
            ▼
    Server receives event in "match:{matchId}" room
            │
    ┌───────┴─────────┐
    │ Validate:       │
    │ - Auth token    │
    │ - User in match │
    │ - Match active  │
    │ - No spam       │
    └────────┬────────┘
             │
             ▼
    INSERT Message record (DB)
             │
             ▼
    Broadcast to room:
    socket.to("match:{matchId}").emit("message_received", {...})
             │
             ├─────────────────────────────────────────────────┐
             │                                                 │
             ▼                                                 ▼
    Receiver client                              Sender client
    receives broadcast                           receives echo
             │                                         │
             ▼                                         ▼
    Display message                           Update message
    in chat UI                                 status: "sent"
             │                                         │
             ▼                                         ▼
    Auto-scroll to                            Show single ✓
    latest message                            checkmark
             │
             ▼
    Mark as delivered
    socket.emit("mark_read")
             │
             ▼
    Server: UPDATE Message status="delivered"
             │
             ▼
    Broadcast back:
    emit("message_delivered", { messageId, deliveredAt })
             │
             ▼
    Sender sees ✓✓ (double checkmark)
```

### Notification Flow (Deep Link)

```
Message sent to offline user
            │
            ▼
    Push Notification queued
            │
            ▼
    Device receives push
    Notification shown on lock screen
            │
            ▼
    User taps notification
            │
            ▼
    Deep link parsed: app://match/match-uuid-123
            │
            ▼
    App launched (or brought to foreground)
            │
            ▼
    Parse URI, extract matchId
            │
            ▼
    API: GET /matches/match-uuid-123
         GET /matches/match-uuid-123/messages?limit=50
             │
             ▼
    Load match data + chat history
             │
             ▼
    Display ChatScreen
             │
             ▼
    WebSocket reconnects to "match:{matchId}"
             │
             ▼
    Mark all unread messages as "delivered"
             │
             ▼
    User sees full conversation
    Chat is ready for typing
```

---

## ENGINEERING CHECKLIST

When coding, ensure:

### Data Layer
- [ ] All tables created with proper indexes
- [ ] Foreign key constraints enforce referential integrity
- [ ] Unique constraints prevent duplicates (match, like)
- [ ] Timestamps (created_at, updated_at) on all tables
- [ ] Soft-delete pattern for matches/messages (is_unmatched, is_active)

### Business Logic (Match Creation)
- [ ] Prevent self-swiping
- [ ] Idempotent like updates (one like per pair)
- [ ] Double-opt-in validation before match creation
- [ ] Match uniqueness (UNIQUE constraint)
- [ ] App-type agnostic logic (Tinder vs Bumble vs Hinge)
- [ ] Expiration timer for Bumble (24h window)
- [ ] Event publication to message queue

### WebSocket / Real-Time
- [ ] Authenticated connections (JWT verification)
- [ ] Room-based broadcasting (match-specific)
- [ ] Typing indicators with auto-cleanup (3s timeout)
- [ ] Presence tracking (user online/offline)
- [ ] Graceful reconnection handling
- [ ] Message ordering (by created_at, not arrival time)

### Notifications
- [ ] Deep link URL generation and validation
- [ ] Device token management (add, remove, rotate)
- [ ] Push failure retry with exponential backoff
- [ ] Notification preferences respected
- [ ] Quiet hours honored
- [ ] Per-match notification toggles
- [ ] Unread notification count accurate

### Chat Features
- [ ] Message pagination (cursor-based, not offset)
- [ ] Unread count tracking per match
- [ ] Message status lifecycle (sent → delivered → read)
- [ ] Read receipt broadcast to sender
- [ ] Chat history persistence (2-year retention default)
- [ ] Soft-delete for unmatch (messages hidden, not purged)
- [ ] Rate limiting on message sends

### Security
- [ ] JWT validation on every endpoint
- [ ] User isolation (can't access other users' chats)
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (use parameterized queries)
- [ ] Rate limiting: 1 swipe/sec, 100 msgs/min per match
- [ ] End-to-end encryption for messages (optional)
- [ ] Blocked user filtering (Hide in suggestions, prevent messaging)

### Error Handling
- [ ] User not found: 404
- [ ] Unauthorized: 401
- [ ] Forbidden (accessing other's chat): 403
- [ ] Invalid match state (unmatch): 410 Gone
- [ ] Rate limited: 429
- [ ] Server errors: 500 with error code

### Testing
- [ ] Unit tests for match creation logic
- [ ] Integration tests for swipe → match → notification flow
- [ ] WebSocket tests for message send/receive
- [ ] Push notification mocking
- [ ] Pagination cursor testing
- [ ] Expiration job testing (Bumble)

---

## SUMMARY: Three App Models

| Feature | Tinder | Bumble | Hinge |
|---------|--------|--------|-------|
| **Swipe Mechanic** | Right/Left swipe | Right/Left swipe | Like with message |
| **Match Creation** | Both can like | Both can like | Both must like |
| **First Message** | Both can message | Woman must message first | Either can message |
| **Time Limit** | None | 24 hours (woman only) | None |
| **Chat Organization** | Flat list | Flat list | "Your Turn" / "Their Turn" / "Hidden" |
| **Read Receipts** | Yes | Yes | No (shows "Your turn" instead) |
| **Profile Style** | Quick swipe cards | Quick swipe cards | Detailed cards, prompts |
| **Match Notification** | Full-screen modal | Full-screen modal | "You have a new conversation" |
| **Deep Link Action** | Match profile | Match profile | Chat directly |

---

## FINAL PROMPT FOR AI ASSISTANT (Copy & Use)

```
You are a senior full-stack engineer building a dating app matching Tinder, Bumble, and Hinge.

I am providing you with the COMPLETE technical specification:

1. **Data Models**: User, Like, Match, Message, Notification, UserBlock, UserReport, NotificationPreferences

2. **App-Specific Flows**:
   - Tinder: Both users can message immediately after mutual like
   - Bumble: Woman must send first message within 24 hours or match expires
   - Hinge: Thoughtful likes with optional messages; chat organized by "Your Turn" / "Their Turn" / "Hidden"

3. **Core Features**:
   - Swipe/Like → Like creation → Mutual validation → Match creation
   - Match → Notification (push) → Deep link → Profile/Chat fetch
   - Chat → WebSocket real-time messaging → Message persistence
   - Message status lifecycle: sent → delivered → read
   - Unread count, typing indicators, typing state
   - Soft-delete unmatch (messages hide, don't purge)
   - Message history pagination (cursor-based)

4. **Notification System**:
   - Event-driven (Pub/Sub: Redis/RabbitMQ)
   - FCM/APNs push for offline users
   - Retry with exponential backoff (1m, 5m, 30m, 2h, 24h)
   - Deep links (app://match/{matchId}, app://user/{userId}, app://likes-you/{likeId})
   - User preferences (global, per-category, per-match, quiet hours)

5. **Database Schema**: Full SQL CREATE TABLE statements with indexes for optimal query performance

6. **API Endpoints**: Complete RESTful contract for:
   - Feed discovery
   - Swipe/Like interactions
   - Match management
   - Message send/fetch
   - Notification preferences
   - Deep linking

7. **Real-Time Implementation**:
   - WebSocket rooms per match
   - Typing indicators (3s auto-cleanup)
   - Offline message queuing
   - Presence tracking
   - Graceful reconnection

8. **Tech Stack**: 
   - Backend: Node.js/TypeScript, Express/NestJS
   - Database: PostgreSQL
   - Real-Time: Socket.IO
   - Notifications: Firebase Cloud Messaging (FCM)
   - Cache: Redis for sessions/ephemeral data

Your task:
- [ ] Build complete backend code (models, routes, controllers, services)
- [ ] Implement match creation logic with double-opt-in validation
- [ ] Build WebSocket chat service with message persistence
- [ ] Implement push notification dispatcher with retry logic
- [ ] Write SQL migrations for all tables and indexes
- [ ] Create example API request/response bodies
- [ ] Implement app-specific logic (Bumble 24h timer, Hinge chat sections)
- [ ] Add error handling and validation
- [ ] Include unit test examples

Focus on production-ready code with:
- Proper error handling
- Input validation
- Transaction safety
- Idempotency where needed
- Rate limiting
- Security best practices
- Database performance (indexes, query optimization)
```

---

## END OF SPECIFICATION

This document covers the **complete end-to-end flow** from swipe to persistent chat for Tinder, Bumble, and Hinge paradigms. Use it to brief AI coding assistants or as a reference for your own implementation.
