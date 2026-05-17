const admin = require('firebase-admin');
const Admin = require('../models/Admin');

const sendPushNotificationToAdmins = async (title, body) => {
  try {
    // Find all admins with fcmTokens
    const admins = await Admin.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } });
    
    let tokens = [];
    admins.forEach(admin => {
      tokens = tokens.concat(admin.fcmTokens);
    });

    if (tokens.length === 0) {
      console.log('No FCM tokens found for any admin. Skipping push notification.');
      return;
    }

    const message = {
      notification: {
        title,
        body
      },
      tokens: [...new Set(tokens)] // Remove duplicate tokens just in case
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`Push notification sent successfully. Success count: ${response.successCount}, Failure count: ${response.failureCount}`);
    
    // Optionally: Handle failed tokens and remove them from DB to keep it clean
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

module.exports = {
  sendPushNotificationToAdmins
};
