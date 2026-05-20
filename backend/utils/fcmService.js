const admin = require('firebase-admin');
const Admin = require('../models/Admin');

const sendPushNotificationToAdmins = async (title, body) => {
  try {
    if (!admin.apps.length) {
      console.error('[FCM] Firebase Admin not initialized. Set FIREBASE_ADMIN_CREDENTIALS on Render.');
      return;
    }

    const admins = await Admin.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } });

    let tokens = [];
    admins.forEach((a) => {
      tokens = tokens.concat(a.fcmTokens || []);
    });

    const uniqueTokens = [...new Set(tokens.filter(Boolean))];

    if (uniqueTokens.length === 0) {
      console.log('[FCM] No device tokens saved for any admin. Enable Alerts in Settings on each phone.');
      return;
    }

    const response = await admin.messaging().sendEachForMulticast({
      notification: { title, body },
      tokens: uniqueTokens,
      webpush: {
        fcmOptions: { link: 'https://www.bssresidency.com/admin/dashboard' }
      }
    });

    console.log(`[FCM] Push sent. Success: ${response.successCount}, Failed: ${response.failureCount}`);

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((r, i) => {
        if (!r.success) {
          console.error(`[FCM] Token failed: ${r.error?.code} - ${r.error?.message}`);
          failedTokens.push(uniqueTokens[i]);
        }
      });
      if (failedTokens.length) {
        await Admin.updateMany(
          {},
          { $pull: { fcmTokens: { $in: failedTokens } } }
        );
      }
    }
  } catch (error) {
    console.error('[FCM] Error sending push notification:', error);
  }
};

module.exports = {
  sendPushNotificationToAdmins
};
