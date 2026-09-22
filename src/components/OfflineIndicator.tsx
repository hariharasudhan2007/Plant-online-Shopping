import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#2d6a4f] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xl border border-emerald-400/40 animate-pulse">
      <WifiOff className="w-3.5 h-3.5 text-[#95d5b2]" />
      <span>Offline Mode Active — Local cache enabled</span>
    </div>
  );
};
