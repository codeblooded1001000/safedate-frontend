'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const wasDismissed = window.localStorage.getItem(DISMISS_KEY) === 'true';
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (wasDismissed || isStandalone) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsOpen(true);
    };

    const onAppInstalled = () => {
      setInstallEvent(null);
      setIsOpen(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const dismissPrompt = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true');
    setIsOpen(false);
  };

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === 'accepted') {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  };

  if (!isOpen || !installEvent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(15,15,26,0.95)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        <p className="font-semibold text-white mb-1">Download SafeDate app</p>
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Install for quicker access and a native app feel. Totally optional - SafeDate works great in
          your browser too.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={dismissPrompt}
            className="flex-1 py-2.5 rounded-xl font-medium text-sm"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC837 100%)',
              color: 'white',
            }}
          >
            Install app
          </button>
        </div>
      </div>
    </div>
  );
}
