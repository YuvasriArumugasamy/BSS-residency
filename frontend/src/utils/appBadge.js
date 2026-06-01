/** App icon badge (Android installed PWA / Chrome) */
export async function setAppBadgeCount(count) {
  try {
    if (!('setAppBadge' in navigator)) return;
    if (count > 0) {
      await navigator.setAppBadge(Math.min(count, 99));
    } else if ('clearAppBadge' in navigator) {
      await navigator.clearAppBadge();
    }
  } catch (e) {
    console.warn('[Badge] setAppBadge failed:', e);
  }
}

export async function clearAppBadge() {
  return setAppBadgeCount(0);
}
