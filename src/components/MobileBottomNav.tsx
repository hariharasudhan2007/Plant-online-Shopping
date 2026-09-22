import React from 'react';
import { 
  Sprout, 
  FolderKanban, 
  CheckSquare, 
  BookOpen, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { AppView } from '../types';

interface MobileBottomNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenCart: () => void;
  onOpenAi: () => void;
  cartCount: number;
  urgentTaskCount: number;
  projectCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onViewChange,
  onOpenCart,
  onOpenAi,
  cartCount,
  urgentTaskCount,
  projectCount,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d8e3dc] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+6px)]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* 1. Catalog / Shop */}
        <button
          onClick={() => onViewChange('shop')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'shop'
              ? 'text-[#1b4332] font-bold'
              : 'text-gray-500 hover:text-[#1b4332]'
          }`}
        >
          <div className="relative">
            <Sprout className={`w-5 h-5 transition-transform ${currentView === 'shop' ? 'scale-110 text-[#2d6a4f]' : ''}`} />
            {currentView === 'shop' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2d6a4f]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Shop</span>
        </button>

        {/* 2. Projects / Sanctuaries */}
        <button
          onClick={() => onViewChange('projects')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'projects'
              ? 'text-[#1b4332] font-bold'
              : 'text-gray-500 hover:text-[#1b4332]'
          }`}
        >
          <div className="relative">
            <FolderKanban className={`w-5 h-5 transition-transform ${currentView === 'projects' ? 'scale-110 text-[#2d6a4f]' : ''}`} />
            {projectCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-[#e8f5e9] text-[#1b4332] px-1 rounded-full border border-[#b7e4c7]">
                {projectCount}
              </span>
            )}
            {currentView === 'projects' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2d6a4f]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Projects</span>
        </button>

        {/* 3. AI Assistant (Center Accent) */}
        <button
          onClick={onOpenAi}
          className="flex flex-col items-center justify-center py-1 px-1 -mt-4 cursor-pointer group"
          title="Verdant Horticultural AI Assistant"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1b4332] to-[#40916c] text-white flex items-center justify-center shadow-md shadow-[#1b4332]/30 border-2 border-white group-active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5 text-[#95d5b2]" />
          </div>
          <span className="text-[10px] font-bold text-[#1b4332] mt-0.5">Flora AI</span>
        </button>

        {/* 4. Tasks & Care Schedule */}
        <button
          onClick={() => onViewChange('tasks')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'tasks'
              ? 'text-[#1b4332] font-bold'
              : 'text-gray-500 hover:text-[#1b4332]'
          }`}
        >
          <div className="relative">
            <CheckSquare className={`w-5 h-5 transition-transform ${currentView === 'tasks' ? 'scale-110 text-[#2d6a4f]' : ''}`} />
            {urgentTaskCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                {urgentTaskCount}
              </span>
            )}
            {currentView === 'tasks' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2d6a4f]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Care</span>
        </button>

        {/* 5. Dashboard / Overview */}
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentView === 'dashboard'
              ? 'text-[#1b4332] font-bold'
              : 'text-gray-500 hover:text-[#1b4332]'
          }`}
        >
          <div className="relative">
            <BookOpen className={`w-5 h-5 transition-transform ${currentView === 'dashboard' ? 'scale-110 text-[#2d6a4f]' : ''}`} />
            {currentView === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2d6a4f]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Overview</span>
        </button>
      </div>
    </nav>
  );
};
