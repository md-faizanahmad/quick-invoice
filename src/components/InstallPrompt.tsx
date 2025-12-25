// src/components/InstallPrompt.tsx
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log("PWA was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsVisible(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    console.log(`User response: ${outcome}`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-blue-600 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg md:hidden">
      {/* Message */}
      <div className="text-sm font-medium">
        <p>Add this app to your home screen for faster, offline use.</p>
        <p className="text-xs opacity-90 mt-1">No data collected!</p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsVisible(false)}
          className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          Not now
        </button>
        <button
          onClick={handleInstallClick}
          className="px-5 py-2 text-sm font-semibold bg-white text-blue-600 rounded-lg hover:bg-gray-100 active:scale-95 transition-all shadow-md"
        >
          Install
        </button>
      </div>
    </div>
  );
}
