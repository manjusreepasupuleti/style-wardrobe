import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  UploadCloud,
  Sparkles,
  Search,
  Heart,
  User,
  LogOut,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { UserProfile } from '../types/wardrobe';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  wardrobeCount: number;
  favoritesCount: number;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  wardrobeCount,
  favoritesCount,
  user,
  onLogout,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wardrobe', label: 'My Wardrobe', icon: Shirt, badge: wardrobeCount },
    { id: 'upload', label: 'Upload Clothes', icon: UploadCloud, highlight: true },
    { id: 'stylist', label: 'AI Stylist', icon: Sparkles, tag: 'AI' },
    { id: 'similarity', label: 'Similarity Search', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-purple-100/70 bg-white/70 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User preview snippet */}
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-purple-50/80 to-pink-50/50 border border-purple-100/60 shadow-xs">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[11px] text-purple-600 truncate">{user.stylePreference}</p>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:bg-purple-50/80 hover:text-purple-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-purple-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.tag && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                        isActive ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-600'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                  <ChevronRight
                    className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Academic Project Credits & Logout */}
      <div className="space-y-3 pt-4 border-t border-purple-100">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-slate-700">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            <span>B.Tech IT AI/ML Project</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-600 leading-relaxed">
            Gemini Multimodal Vision + Color Harmony & Vector Similarity retrieval.
          </p>
        </div>

        {user && (
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
