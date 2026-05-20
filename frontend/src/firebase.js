import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDUefX7uT7zcvkkWqUUl6i1xeOwXlFIJpU",
  authDomain: "bss-residency.firebaseapp.com",
  projectId: "bss-residency",
  storageBucket: "bss-residency.firebasestorage.app",
  messagingSenderId: "887756035594",
  appId: "1:887756035594:web:8b608fd1477dff0cf431f3",
  measurementId: "G-DYM98KYPL3"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported in this browser');
    }

    const permission = await Notification.requestPermission();
    console.log('[FCM] Notification permission:', permission);
    if (permission !== 'granted') {
      throw new Error(`Permission ${permission}. Please allow notifications in Chrome settings.`);
    }

    // Register the FCM worker explicitly (idempotent) then wait until active.
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const swReg = await navigator.serviceWorker.ready;
    console.log('[FCM] Service worker ready:', swReg.scope);

    const currentToken = await getToken(messaging, { 
        vapidKey: "BAQycSciYxO2yk9z7I9P6OsonwsX43OsuMaJanG4ivZTGrAqEGc4xibegWwYq5UxjjxH2TA6LCx39sX626ORwpQ",
        serviceWorkerRegistration: swReg
    });
    if (currentToken) {
      console.log("[FCM] Token obtained:", currentToken);
      return currentToken;
    } else {
      throw new Error('Token was empty - service worker may not be registered');
    }
  } catch (err) {
    console.error("[FCM] Error:", err);
    throw err; // Re-throw so caller can show exact error
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
