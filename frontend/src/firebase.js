import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDUeFX7vT7ZcvkKWqUU16Iixm0xV1PIjpU",
  authDomain: "bss-residency.firebaseapp.com",
  projectId: "bss-residency",
  storageBucket: "bss-residency.firebasestorage.app",
  messagingSenderId: "887756035594",
  appId: "1:887756035594:web:8b600fd1477dff0cf431f2",
  measurementId: "G-G9M98KYPL5"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { 
        vapidKey: "BAQycSciYxO2yk9z7I9P6OsonwsX43OsuMaJanG4ivZTGrAqEGc4xibegWwYq5UxjjxH2TA6LCx39sX626ORwpQ"
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
