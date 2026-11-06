import React from 'react';
import {
  Sparkles,
  Shirt,
  Layers,
  Heart,
  TrendingUp,
  PlusCircle,
  Wand2,
  Search,
  ArrowRight,
  Clock,
  Palette,
} from 'lucide-react';
import { ClothingItem, OutfitRecommendation, UserProfile } from '../types/wardrobe';

interface DashboardViewProps {
  wardrobe: ClothingItem[];
  outfits: OutfitRecommendation[];
  user: UserProfile | null;
  onNavigate: (view: string) => void;
  onSelectItem: (item: ClothingItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wardrobe,
  outfits,
  user,
  onNavigate,
  onSelectItem,
}) => {
  // Category counts
  const tops = wardrobe.filter((i) => i.category === 'Tops');
  const bottoms = wardrobe.filter((i) => i.category === 'Bottoms');
  const dresses = wardrobe.filter((i) => i.category === 'Dresses');
  const jackets = wardrobe.filter((i) => i.category === 'Jackets');
  const shoes = wardrobe.filter((i) => i.category === 'Shoes');
  const favorites = wardrobe.filter((i) => i.isFavorite);

  // Recently added (last 4 items)
  const recentItems = [...wardrobe]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Unique colors in wardrobe
  const uniqueColors = Array.from(new Set(wardrobe.map((i) => i.dominantColour)));

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-pink-300" />
              <span>SmartStyle Fashion Intelligence</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Welcome back, {user ? user.name.split(' ')[0] : 'Stylist'}!
            </h1>
            <p className="text-sm sm:text-base text-purple-100 max-w-xl">
              "Welcome back! Let's create your perfect look." Your digital closet is synced with
              Gemini Vision ready for instant styling.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-purple-900 shadow-md hover:bg-purple-50 transition-all hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-purple-600" />
              <span>Upload Clothing</span>
            </button>
            <button
              onClick={() => onNavigate('stylist')}
              className="flex items-center gap-2 rounded-full bg-white/20 border border-white/30 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/30 transition-all cursor-pointer backdrop-blur-md"
            >
              <Wand2 className="h-4 w-4 text-pink-300" />
              <span>AI Stylist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe Breakdown Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Items */}
        <div
          onClick={() => onNavigate('wardrobe')}
          className="group rounded-2xl bg-white p-4 border border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Items</span>
            <Layers className="h-4 w-4" />
          </div>
          <p className="font-editorial text-2xl font-bold text-slate-900 mt-2">{wardrobe.length}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-1">Full Collection</p>
        </div>

        {/* Tops */}
        <div
          onClick={() => onNavigate('wardrobe')}
          className="group rounded-2xl bg-white p-4 border border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tops</span>
            <Shirt className="h-4 w-4" />
          </div>
          <p className="font-editorial text-2xl font-bold text-slate-900 mt-2">{tops.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Blouses, tees, knits</p>
        </div>

        {/* Bottoms */}
        <div
          onClick={() => onNavigate('wardrobe')}
          className="group rounded-2xl bg-white p-4 border border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bottoms</span>
            <Layers className="h-4 w-4" />
          </div>
          <p className="font-editorial text-2xl font-bold text-slate-900 mt-2">{bottoms.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Denim, trousers</p>
        </div>

        {/* Dresses */}
        <div
          onClick={() => onNavigate('wardrobe')}
          className="group rounded-2xl bg-white p-4 border border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-pink-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dresses</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="font-editorial text-2xl font-bold text-slate-900 mt-2">{dresses.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Slips, midis, gowns</p>
        </div>

        {/* Jackets */}
        <div
          onClick={() => onNavigate('wardrobe')}
          className="group rounded-2xl bg-white p-4 border border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jackets</span>
            <Layers className="h-4 w-4" />
          </div>
          <p className="font-editorial text-2xl font-bold text-slate-900 mt-2">{jackets.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Blazers, outerwear</p>
        </div>

        {/* Shoes */}
        <div
          onClick={() => onNavigate('wardrobe')}
          className="group rounded-2xl bg-white p-4 border border-purple-100 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shoes</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="font-editorial text-2xl font-bold text-slate-900 mt-2">{shoes.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Sneakers, heels</p>
        </div>
      </div>

      {/* Main Grid: Recently Added & Recommended Combinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recently Added Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <h2 className="font-editorial text-xl font-bold text-slate-900">Recently Added Clothes</h2>
            </div>
            <button
              onClick={() => onNavigate('wardrobe')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({wardrobe.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group relative rounded-2xl border border-purple-100 bg-white overflow-hidden shadow-xs hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer flex flex-col"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-purple-50 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.clothingName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-800 backdrop-blur-xs">
                    <span
                      className="h-2 w-2 rounded-full border border-black/10"
                      style={{ backgroundColor: item.dominantColourHex }}
                    />
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {item.clothingName}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.dominantColour} • {item.pattern}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-purple-700">{item.style}</span>
                    {item.isFavorite && <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Workflow Actions Banner */}
          <div className="rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Visual Similarity Search</h4>
                <p className="text-xs text-slate-600">
                  Upload an inspiration image to find matching pieces in your closet.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('similarity')}
              className="rounded-full bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Try Similarity Search
            </button>
          </div>
        </div>

        {/* Right Column: AI Recommended Combination & Style Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Recommended Combination Card */}
          <div className="rounded-3xl border border-purple-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-purple-600" />
                <h3 className="font-editorial text-base font-bold text-slate-900">
                  AI Recommended Look
                </h3>
              </div>
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                Casual Chic
              </span>
            </div>

            {tops.length > 0 && bottoms.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-purple-50 relative">
                    <img
                      src={tops[0].imageUrl}
                      alt={tops[0].clothingName}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                      Top
                    </span>
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-purple-50 relative">
                    <img
                      src={bottoms[0].imageUrl}
                      alt={bottoms[0].clothingName}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                      Bottom
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-purple-50/70 p-3 text-slate-700 space-y-1 text-xs">
                  <p className="font-bold text-purple-950">Color Compatibility Insight</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Combines {tops[0].dominantColour} with {bottoms[0].dominantColour}. The contrasting tones maintain clean visual balance with neutral shoes.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('stylist')}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 py-2.5 text-xs font-bold text-purple-800 hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  <span>Customize in AI Stylist</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Add tops and bottoms to unlock automated outfit synthesis.
              </p>
            )}
          </div>

          {/* Color Palette Spectrum */}
          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-600" />
              <h3 className="font-editorial text-base font-bold text-slate-900">
                Wardrobe Color Spectrum
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Extracted via Gemini Vision color quantization:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {uniqueColors.map((color) => {
                const item = wardrobe.find((w) => w.dominantColour === color);
                return (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: item?.dominantColourHex || '#cbd5e1' }}
                    />
                    <span>{color}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
