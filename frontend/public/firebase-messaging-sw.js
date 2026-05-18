// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
const firebaseConfig = {
  apiKey: "AIzaSyDUeFX7vT7ZcvkKWqUU16Iixm0xV1PIjpU",
  authDomain: "bss-residency.firebaseapp.com",
  projectId: "bss-residency",
  storageBucket: "bss-residency.firebasestorage.app",
  messagingSenderId: "887756035594",
  appId: "1:887756035594:web:8b600fd1477dff0cf431f2"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.webp', // Ensure this exists in public/
    badge: '/logo.webp' // Ensure this exists in public/
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// A dummy fetch event handler to ensure PWA installability
self.addEventListener('fetch', (event) => {
  // Can be left empty for now, just satisfies the PWA criteria for some browsers
});
