import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { WardrobeView } from './components/WardrobeView';
import { UploadAnalyzeView } from './components/UploadAnalyzeView';
import { StylistView } from './components/StylistView';
import { SimilaritySearchView } from './components/SimilaritySearchView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { ClothingItem, OutfitRecommendation, UserProfile } from './types/wardrobe';
import {
  getStoredWardrobe,
  saveWardrobe,
  getStoredOutfits,
  saveOutfits,
  getStoredUser,
  saveUser,
} from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => getStoredWardrobe());
  const [outfits, setOutfits] = useState<OutfitRecommendation[]>(() => getStoredOutfits());
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    saveWardrobe(wardrobe);
  }, [wardrobe]);

  useEffect(() => {
    saveOutfits(outfits);
  }, [outfits]);

  useEffect(() => {
    if (user) {
      saveUser(user);
    }
  }, [user]);

  // Actions
  const handleAddClothing = (item: ClothingItem) => {
    setWardrobe((prev) => [item, ...prev]);
  };

  const handleUpdateClothing = (updatedItem: ClothingItem) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDeleteClothing = (id: string) => {
    if (window.confirm('Are you sure you want to remove this clothing item?')) {
      setWardrobe((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleToggleFavorite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleSaveOutfit = (outfit: OutfitRecommendation) => {
    setOutfits((prev) => [outfit, ...prev]);
  };

  const handleRemoveOutfit = (id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleImportWardrobe = (newItems: ClothingItem[]) => {
    setWardrobe(newItems);
  };

  const favoritesCount = wardrobe.filter((i) => i.isFavorite).length;

  const isPublicLanding = currentView === 'landing';

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        wardrobeCount={wardrobe.length}
      />

      {/* Main Content Area */}
      {isPublicLanding ? (
        <main className="flex-1">
          <LandingPage
            onGetStarted={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setIsAuthOpen(true);
              }
            }}
            onExplore={() => setCurrentView('wardrobe')}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Dashboard Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            wardrobeCount={wardrobe.length}
            favoritesCount={favoritesCount}
            user={user}
            onLogout={handleLogout}
          />

          {/* Active View Container */}
          <main className="flex-1 min-w-0">
            {currentView === 'dashboard' && (
              <DashboardView
                wardrobe={wardrobe}
                outfits={outfits}
                user={user}
                onNavigate={(view) => setCurrentView(view)}
                onSelectItem={() => setCurrentView('wardrobe')}
              />
            )}

            {currentView === 'wardrobe' && (
              <WardrobeView
                wardrobe={wardrobe}
                onToggleFavorite={handleToggleFavorite}
                onDeleteItem={handleDeleteClothing}
                onUpdateItem={handleUpdateClothing}
                onNavigateToUpload={() => setCurrentView('upload')}
              />
            )}

            {currentView === 'upload' && (
              <UploadAnalyzeView
                onSaveToWardrobe={handleAddClothing}
                onNavigateToWardrobe={() => setCurrentView('wardrobe')}
              />
            )}

            {currentView === 'stylist' && (
              <StylistView
                wardrobe={wardrobe}
                savedOutfits={outfits}
                onSaveOutfit={handleSaveOutfit}
                onNavigateToUpload={() => setCurrentView('upload')}
              />
            )}

            {currentView === 'similarity' && (
              <SimilaritySearchView
                wardrobe={wardrobe}
                onNavigateToUpload={() => setCurrentView('upload')}
              />
            )}

            {currentView === 'favorites' && (
              <FavoritesView
                wardrobe={wardrobe}
                outfits={outfits}
                onToggleFavoriteItem={handleToggleFavorite}
                onRemoveOutfit={handleRemoveOutfit}
                onNavigate={(view) => setCurrentView(view)}
              />
            )}

            {currentView === 'profile' && user && (
              <ProfileView
                user={user}
                wardrobe={wardrobe}
                onUpdateUser={(updated) => setUser(updated)}
                onImportWardrobe={handleImportWardrobe}
                onLogout={handleLogout}
              />
            )}
          </main>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
