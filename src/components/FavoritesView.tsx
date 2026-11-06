import React, { useState } from 'react';
import {
  Heart,
  Shirt,
  Sparkles,
  Trash2,
  Bookmark,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ClothingItem, OutfitRecommendation } from '../types/wardrobe';

interface FavoritesViewProps {
  wardrobe: ClothingItem[];
  outfits: OutfitRecommendation[];
  onToggleFavoriteItem: (id: string) => void;
  onRemoveOutfit: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  wardrobe,
  outfits,
  onToggleFavoriteItem,
  onRemoveOutfit,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'outfits'>('items');

  const favoriteItems = wardrobe.filter((i) => i.isFavorite);
  const favoriteOutfits = outfits.filter((o) => o.isFavorite !== false);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700 mb-1">
            <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
            <span>Saved Collections</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-slate-900">
            Favorites & Curations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Quick access to your most-loved wardrobe essentials and saved AI outfit combinations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'items'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shirt className="h-4 w-4" />
            <span>Clothes ({favoriteItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'outfits'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Outfits ({favoriteOutfits.length})</span>
          </button>
        </div>
      </div>

      {/* Tab: Favorite Clothes */}
      {activeTab === 'items' && (
        <div>
          {favoriteItems.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-white p-12 text-center space-y-3">
              <Heart className="h-12 w-12 text-pink-300 mx-auto" />
              <h3 className="font-editorial text-lg font-bold text-slate-800">
                No Favorite Clothing Items Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tap the heart icon on any garment in your virtual wardrobe to pin your go-to pieces here.
              </p>
              <button
                onClick={() => onNavigate('wardrobe')}
                className="rounded-full bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Browse My Wardrobe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-3xl border border-purple-100 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-pink-300 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden relative bg-purple-50">
                    <img
                      src={item.imageUrl}
                      alt={item.clothingName}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      onClick={() => onToggleFavoriteItem(item.id)}
                      className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-md hover:scale-110 transition-transform cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                    </button>
                    <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-800 backdrop-blur-md">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.clothingName}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full border border-black/10"
                        style={{ backgroundColor: item.dominantColourHex }}
                      />
                      <span className="text-[10px] text-slate-500">
                        {item.dominantColour} • {item.style}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Outfits */}
      {activeTab === 'outfits' && (
        <div>
          {favoriteOutfits.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-purple-200 bg-white p-12 text-center space-y-3">
              <Sparkles className="h-12 w-12 text-purple-300 mx-auto" />
              <h3 className="font-editorial text-lg font-bold text-slate-800">
                No Saved Outfits Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the AI Fashion Stylist to formulate looks for any occasion and click "Save Outfit".
              </p>
              <button
                onClick={() => onNavigate('stylist')}
                className="rounded-full bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Go to AI Stylist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                    <div>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 uppercase">
                        {outfit.occasion}
                      </span>
                      <h3 className="font-editorial text-lg font-bold text-slate-900 mt-1">
                        {outfit.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => onRemoveOutfit(outfit.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                      title="Delete outfit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Items snapshot */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {outfit.items.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square rounded-xl overflow-hidden bg-purple-50 relative border border-slate-100"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.clothingName}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1 py-0.2 text-[8px] text-white">
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/50 p-3 rounded-2xl border border-purple-100/60">
                    {outfit.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
