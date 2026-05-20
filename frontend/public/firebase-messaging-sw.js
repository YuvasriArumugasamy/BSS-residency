// Must match the firebase npm version used in the app (see frontend/package.json).
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDUefX7uT7zcvkkWqUUl6i1xeOwXlFIJpU",
  authDomain: "bss-residency.firebaseapp.com",
  projectId: "bss-residency",
  storageBucket: "bss-residency.firebasestorage.app",
  messagingSenderId: "887756035594",
  appId: "1:887756035594:web:8b608fd1477dff0cf431f3"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const BADGE_CACHE = 'bss-badge-v1';

async function getBadgeCount() {
  try {
    const cache = await caches.open(BADGE_CACHE);
    const res = await cache.match('count');
    if (!res) return 0;
    return parseInt(await res.text(), 10) || 0;
  } catch {
    return 0;
  }
}

async function setBadgeCount(count) {
  try {
    const cache = await caches.open(BADGE_CACHE);
    await cache.put('count', new Response(String(Math.max(0, count))));
    if (self.navigator && 'setAppBadge' in self.navigator) {
      if (count > 0) await self.navigator.setAppBadge(Math.min(count, 99));
      else if ('clearAppBadge' in self.navigator) await self.navigator.clearAppBadge();
    }
  } catch (e) {
    console.error('[SW] badge error', e);
  }
}

function showPushNotification(title, body) {
  const notificationTitle = title || 'BSS Residency';
  const notificationOptions = {
    body: body || 'New booking received',
    icon: '/logo.webp',
    badge: '/logo.webp',
    tag: 'bss-new-booking',
    renotify: true,
    requireInteraction: true,
    data: { url: '/admin/dashboard' },
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
}

async function handleIncomingPush(title, body) {
  const count = (await getBadgeCount()) + 1;
  await setBadgeCount(count);
  await showPushNotification(title, body);
}

messaging.onBackgroundMessage(async (payload) => {
  console.log('[firebase-messaging-sw.js] background message', payload);
  const title = payload.notification?.title || payload.data?.title;
  const body = payload.notification?.body || payload.data?.body;
  await handleIncomingPush(title, body);
});

// Fallback: some Android builds deliver FCM via push event (not onBackgroundMessage)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  event.waitUntil(
    (async () => {
      try {
        const payload = event.data.json();
        const title = payload.notification?.title || payload.data?.title;
        const body = payload.notification?.body || payload.data?.body;
        if (title || body) await handleIncomingPush(title, body);
      } catch (e) {
        console.error('[SW] push handler', e);
      }
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  setBadgeCount(0);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
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

self.addEventListener('fetch', () => {});
