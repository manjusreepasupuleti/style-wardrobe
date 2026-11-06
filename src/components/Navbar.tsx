import React from 'react';
import {
  Sparkles,
  Shirt,
  Compass,
  Layers,
  Heart,
  User,
  PlusCircle,
  Menu,
  X,
  Bot,
  Search,
} from 'lucide-react';
import { UserProfile } from '../types/wardrobe';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  wardrobeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  wardrobeCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'wardrobe', label: 'Wardrobe', count: wardrobeCount, icon: Shirt },
    { id: 'stylist', label: 'AI Stylist', icon: Bot, badge: 'AI' },
    { id: 'similarity', label: 'Visual Search', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-100/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex cursor-pointer items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 shadow-md shadow-purple-500/20 text-white">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-2xl font-bold tracking-tight text-slate-900">
                SmartStyle
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-purple-700">
                AI FASHION
              </span>
            </div>
            <p className="hidden text-[10px] text-slate-500 sm:block -mt-1 font-medium">
              Your Wardrobe. Your Style. Powered by AI.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                    : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && !isActive && (
                  <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-bold text-pink-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all hover:shadow-md cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Clothing</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/50 p-1 pr-3 hover:bg-purple-100/50 transition-colors cursor-pointer"
                title="View Profile"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover border border-purple-300"
                />
                <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="hidden text-xs font-medium text-slate-500 hover:text-red-600 sm:inline px-2 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 rounded-full border border-purple-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span>Log In</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-purple-600"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-purple-100 bg-white/95 px-4 pt-2 pb-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-purple-100 text-purple-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="rounded-full bg-purple-200 px-2 py-0.5 text-xs text-purple-800 font-semibold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Layers className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
