'use client';

import { useEffect, useState } from 'react';
import { Download, HardHat, Share, X } from 'lucide-react';

type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isAppleMobileBrowser() {
  const { navigator } = window;
  const appleNavigator = navigator as Navigator & { standalone?: boolean };
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !appleNavigator.standalone;
}

export function MobileInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<DeferredInstallPrompt | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(display-mode: standalone)').matches) return;
    if (window.sessionStorage.getItem('nirmaan-install-prompt-dismissed')) return;

    if (isAppleMobileBrowser()) {
      setIsIos(true);
      setIsVisible(true);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as DeferredInstallPrompt);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  const dismiss = () => {
    window.sessionStorage.setItem('nirmaan-install-prompt-dismissed', 'true');
    setIsVisible(false);
  };

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') dismiss();
    setInstallPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Install Nirmaan Setu" className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md rounded-2xl border border-[#0e223f]/15 bg-white p-4 text-[#101b2d] shadow-[0_18px_45px_rgba(16,27,45,.22)] md:hidden">
      <button type="button" onClick={dismiss} className="absolute right-2 top-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[#536071] hover:bg-[#f2f5f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1775e8]">
        <span className="sr-only">Dismiss install prompt</span><X className="h-5 w-5" />
      </button>
      <div className="flex gap-3 pr-9"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0e223f] text-[#ffcf4f]"><HardHat className="h-5 w-5" /></span><div><p className="text-sm font-semibold">Keep Nirmaan Setu on this phone</p><p className="mt-1 text-xs leading-5 text-[#536071]">{isIos ? 'Tap Share, then Add to Home Screen for quick field access.' : 'Install the field logger for quicker access when you are on site.'}</p></div></div>
      {isIos ? <div className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1775e8]"><Share className="h-4 w-4" /> Share, then Add to Home Screen</div> : <button type="button" onClick={install} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0e223f] px-4 text-sm font-semibold text-white hover:bg-[#17375f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1775e8]"><Download className="h-4 w-4" /> Install app</button>}
    </aside>
  );
}
