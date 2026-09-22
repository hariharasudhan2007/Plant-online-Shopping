import React from "react";
import { 
  Sprout, 
  ShoppingBag, 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Flame, 
  BarChart3, 
  Search, 
  Bot, 
  Sparkles,
  Layers,
  Database
} from "lucide-react";
import { AppView, CartItem } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  cartCount?: number;
  cartItems?: CartItem[];
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAi: () => void;
  onOpenSupabase?: () => void;
  isSupabaseConnected?: boolean;
  urgentTaskCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  cartItems = [],
  onOpenCart,
  onOpenSearch,
  onOpenAi,
  onOpenSupabase,
  isSupabaseConnected = false,
  urgentTaskCount = 0,
}) => {
  const totalCartCount =
    cartCount !== undefined
      ? cartCount
      : (cartItems || []).reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const navLinks: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "shop", label: "Plant Shop", icon: ShoppingBag },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "priorities", label: "Priorities", icon: Layers },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2ece5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate("shop")}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center text-white shadow-sm shadow-[#2d6a4f]/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-[#95d5b2]" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-[#1b4332] block leading-none">
                VERDANT
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#52796f]">
                Botanical Living & Studio
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f1f6f3] p-1 rounded-xl border border-[#e2ece5]">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-[#1b4332] shadow-xs font-semibold"
                      : "text-[#405648] hover:text-[#1b4332] hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#2d6a4f]" : "text-[#6b8273]"}`} />
                  <span>{tab.label}</span>
                  {tab.id === "tasks" && urgentTaskCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title={`${urgentTaskCount} urgent tasks`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Mobile App Install Button */}
            <PWAInstallButton />

            {/* Supabase Database Status & Tools */}
            {onOpenSupabase && (
              <button
                onClick={onOpenSupabase}
                id="supabase-status-btn"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  isSupabaseConnected
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-[#f4f7f5] text-[#335c49] border-[#d8e3dc] hover:bg-[#e6efe9]"
                }`}
                title="Supabase PostgreSQL Database Management & Migration"
              >
                <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? "text-emerald-600" : "text-[#2d6a4f]"}`} />
                <span className="hidden sm:inline font-semibold">Supabase</span>
                <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
              </button>
            )}

            {/* Quick Global Search */}
            <button
              onClick={onOpenSearch}
              id="search-trigger-btn"
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#52796f] bg-[#f1f6f3] hover:bg-[#e4ede7] border border-[#e2ece5] rounded-lg transition-colors cursor-pointer"
              title="AI Natural Language & Spotlight Search (⌘K)"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2d6a4f]" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#52796f] bg-white border border-[#cbd7cf] rounded-sm">
                ⌘K
              </kbd>
            </button>

            {/* AI Assistant Copilot Trigger */}
            <button
              onClick={onOpenAi}
              id="ai-assistant-btn"
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#2d6a4f] to-[#40916c] hover:from-[#1b4332] hover:to-[#2d6a4f] rounded-lg shadow-sm transition-all cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d8f3dc] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Flora AI</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              id="cart-trigger-btn"
              className="relative p-2 text-[#1b4332] hover:bg-[#f1f6f3] border border-[#e2ece5] rounded-lg transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#2d6a4f]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#2d6a4f] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-[#e2ece5] scrollbar-none">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium transition-colors ${
                  isActive
                    ? "bg-[#2d6a4f] text-white font-semibold"
                    : "text-[#405648] hover:bg-[#f1f6f3]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
