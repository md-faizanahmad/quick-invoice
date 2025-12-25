export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";

  const result = await Notification.requestPermission();
  return result; // "granted" | "denied" | "default"
}
