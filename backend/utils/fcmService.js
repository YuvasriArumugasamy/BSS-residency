const admin = require('firebase-admin');
const Admin = require('../models/Admin');

const sendPushNotificationToAdmins = async (title, body) => {
  const result = await sendPushToAdminsInternal(title, body);
  if (result.tokenCount === 0) {
    console.log('[FCM] No device tokens saved for any admin. Enable Alerts in Settings on each phone.');
  } else {
    console.log(`[FCM] Push sent to ${result.tokenCount} device(s). Success: ${result.successCount}, Failed: ${result.failureCount}`);
    result.errors?.forEach((e) => console.error(`[FCM] ${e}`));
  }
  return result;
};

const sendPushToAdminsInternal = async (title, body) => {
  const empty = { successCount: 0, failureCount: 0, tokenCount: 0, errors: [] };

  try {
    if (!admin.apps.length) {
      return { ...empty, errors: ['Firebase Admin not initialized. Set FIREBASE_ADMIN_CREDENTIALS on Render.'] };
    }

    const admins = await Admin.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } });

    let tokens = [];
    admins.forEach((a) => {
      tokens = tokens.concat(a.fcmTokens || []);
    });

    const uniqueTokens = [...new Set(tokens.filter(Boolean))];

    if (uniqueTokens.length === 0) {
      return empty;
    }

    const siteUrl = (process.env.FRONTEND_URL || 'https://www.bssresidency.com').replace(/\/$/, '');
    const iconUrl = `${siteUrl}/logo.webp`;
    const link = `${siteUrl}/admin/dashboard`;

    const messages = uniqueTokens.map((token) => ({
      token,
      webpush: {
        notification: {
          title,
          body,
          icon: iconUrl,
          badge: iconUrl,
        },
        fcmOptions: { link },
      },
    }));

    const response = await admin.messaging().sendEach(messages);

    const failedTokens = [];
    const errors = [];
    response.responses.forEach((r, i) => {
      if (!r.success) {
        errors.push(`${r.error?.code}: ${r.error?.message}`);
        failedTokens.push(uniqueTokens[i]);
      }
    });

    if (failedTokens.length) {
      await Admin.updateMany({}, { $pull: { fcmTokens: { $in: failedTokens } } });
    }

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      tokenCount: uniqueTokens.length,
      errors,
    };
  } catch (error) {
    console.error('[FCM] Error sending push notification:', error);
    return { ...empty, errors: [error.message] };
  }
};

module.exports = {
  sendPushNotificationToAdmins,
  sendPushToAdminsInternal,
};
