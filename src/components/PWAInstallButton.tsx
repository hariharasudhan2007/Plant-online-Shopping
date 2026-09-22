import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // If already running as an installed PWA on the home screen, hide
  if (isInstalled) {
    return null;
  }

  // Handle banner variant
  if (variant === 'banner') {
    if (dismissedBanner) return null;
    return (
      <>
        <div className={`bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white p-3.5 rounded-2xl shadow-lg border border-emerald-600/30 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="w-5 h-5 text-[#95d5b2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">Install Verdant Mobile App</h4>
              <p className="text-xs text-[#b7e4c7] mt-0.5">
                Enjoy offline access, full-screen sanctuary view & faster care updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isInstallable ? (
              <button
                onClick={install}
                className="px-3.5 py-1.5 bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            ) : isIOS ? (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-3.5 py-1.5 bg-[#52b788] hover:bg-[#74c69d] text-[#081c15] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Share className="w-3.5 h-3.5" />
                <span>Add to Home</span>
              </button>
            ) : (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white font-medium text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>App Info</span>
              </button>
            )}
            <button
              onClick={() => setDismissedBanner(true)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iOS / General Install Guide Sheet */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-gray-900">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1b4332] flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-[#74c69d]" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1b4332]">Install on Your Device</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-gray-600">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-[#e8f5e9] text-[#2d6a4f] flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <p className="leading-relaxed">
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> in Safari or your browser toolbar.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-[#e8f5e9] text-[#2d6a4f] flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <p className="leading-relaxed">
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-gray-800" />.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-[#e8f5e9] text-[#2d6a4f] flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <p className="leading-relaxed">
                    Tap <strong>Add</strong> in the top-right corner. Launch Verdant like a native app directly from your home screen!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 bg-[#1b4332] text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-[#2d6a4f] transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Compact variant for Navbars / Headers
  return (
    <>
      {isInstallable ? (
        <button
          onClick={install}
          id="pwa-install-app-btn"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer ${className}`}
          title="Install Verdant on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : isIOS ? (
        <button
          onClick={() => setShowIOSGuide(true)}
          id="pwa-install-ios-btn"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#d8e3dc] bg-white text-[#1b4332] hover:bg-[#f0f7f2] transition-all cursor-pointer ${className}`}
          title="Add Verdant to your iOS Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>Get App</span>
        </button>
      ) : (
        <button
          onClick={() => setShowIOSGuide(true)}
          id="pwa-install-generic-btn"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#d8e3dc] bg-[#f8faf8] text-[#335c49] hover:bg-[#eaf3ed] transition-all cursor-pointer ${className}`}
          title="Install as Mobile Web App"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span className="hidden sm:inline">Mobile App</span>
        </button>
      )}

      {/* Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-gray-900">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1b4332] flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-[#74c69d]" />
                </div>
                <h3 className="font-bold text-sm text-[#1b4332]">Install Verdant Mobile App</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-gray-600">
              <p className="leading-relaxed">
                Verdant runs as a standalone progressive mobile app on iOS and Android without taking up storage space:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <Share className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>1. Tap <strong>Share</strong> or your browser menu.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <PlusSquare className="w-4 h-4 text-gray-800 shrink-0 mt-0.5" />
                  <span>2. Tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>3. Enjoy full-screen offline-ready botanical care!</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 bg-[#1b4332] text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-[#2d6a4f] transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
