const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

/**
 * Send a push notification to specific tokens
 * @param {string[]} pushTokens - Array of Expo push tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Additional data for the notification
 */
const sendPushNotification = async (pushTokens, title, body, data = {}) => {
    let messages = [];
    for (let pushToken of pushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: data,
        });
    }

    // Batch messages to reduce network requests
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log('Push notification tickets:', ticketChunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending push notification chunk:', error);
        }
    }

    return tickets;
};

module.exports = {
    sendPushNotification,
};
