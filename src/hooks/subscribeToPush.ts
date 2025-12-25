export async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "<PUBLIC_VAPID_KEY>", // from backend
  });

  return subscription;
}
