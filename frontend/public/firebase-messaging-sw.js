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

let unreadCount = 0;

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Increment unread count and set badge
  unreadCount++;
  if (self.navigator && 'setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(unreadCount).catch(console.error);
  }

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.webp', // Ensure this exists in public/
    badge: '/logo.webp' // Ensure this exists in public/
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Clear badge when a notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  unreadCount = 0;
  if (self.navigator && 'clearAppBadge' in self.navigator) {
    self.navigator.clearAppBadge().catch(console.error);
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/admin/dashboard');
      }
    })
  );
});

// A dummy fetch event handler to ensure PWA installability
self.addEventListener('fetch', (event) => {
  // Can be left empty for now, just satisfies the PWA criteria for some browsers
});
