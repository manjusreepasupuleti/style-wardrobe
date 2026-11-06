import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Bookmark,
  RefreshCw,
  Layers,
  Heart,
  Palette,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { ClothingItem, Occasion, OutfitRecommendation } from '../types/wardrobe';
import { getOutfitRecommendation } from '../services/api';

interface StylistViewProps {
  wardrobe: ClothingItem[];
  savedOutfits: OutfitRecommendation[];
  onSaveOutfit: (outfit: OutfitRecommendation) => void;
  onNavigateToUpload: () => void;
}

export const StylistView: React.FC<StylistViewProps> = ({
  wardrobe,
  savedOutfits,
  onSaveOutfit,
  onNavigateToUpload,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('Casual Wear');
  const [userVibe, setUserVibe] = useState<string>('Effortless Chic & Modern');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitRecommendation | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const occasions: { id: Occasion; title: string; desc: string; icon: string }[] = [
    {
      id: 'Casual Wear',
      title: 'Casual Wear',
      desc: 'Relaxed daytime outfits, denim pairings, everyday ease',
      icon: '☕',
    },
    {
      id: 'Formal Wear',
      title: 'Formal Wear',
      desc: 'Tailored blazers, clean shirts, trousers, office elegance',
      icon: '💼',
    },
    {
      id: 'Party Wear',
      title: 'Party Wear',
      desc: 'Statement satin dresses, chic jackets, evening glamour',
      icon: '✨',
    },
    {
      id: 'Date Night',
      title: 'Date Night',
      desc: 'Flattering silhouettes, sophisticated contrasts, romantic tones',
      icon: '🍷',
    },
    {
      id: 'Work / Office',
      title: 'Work / Office',
      desc: 'Sharp smart-casual staples with structured proportion',
      icon: '🏛️',
    },
    {
      id: 'Travel',
      title: 'Travel & Airport',
      desc: 'Comfortable layers, breathable fabrics, and platform sneakers',
      icon: '✈️',
    },
  ];

  const handleGenerateOutfit = async (occasionToUse?: Occasion) => {
    const occ = occasionToUse || selectedOccasion;
    if (wardrobe.length === 0) {
      setError('Your wardrobe is empty. Please upload some clothes first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const outfit = await getOutfitRecommendation(occ, wardrobe, userVibe);
      setCurrentOutfit(outfit);
    } catch (err: any) {
      setError(err.message || 'Failed to curate outfit.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentOutfit = () => {
    if (!currentOutfit) return;
    onSaveOutfit({
      ...currentOutfit,
      isFavorite: true,
    });
    setSaveSuccess(true);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          <Wand2 className="h-3.5 w-3.5" />
          <span>Multimodal Wardrobe Synthesis</span>
        </div>
        <h1 className="font-editorial text-3xl font-bold text-slate-900">
          AI Fashion Stylist
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Select an occasion and SmartStyle will formulate styled looks assembled strictly from your
          actual digital closet, backed by color theory and aesthetic balance.
        </p>
      </div>

      {wardrobe.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-purple-200 bg-white p-12 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 mx-auto">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-slate-900">
            Your Virtual Wardrobe is Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Before Gemini can formulate personalized outfit pairings, you must catalog some clothing
            items (shirts, jeans, dresses, shoes).
          </p>
          <button
            onClick={onNavigateToUpload}
            className="rounded-full bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-md cursor-pointer"
          >
            Upload Clothes to Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Occasion Selector & Preferences (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Step 1: Choose Occasion
                </span>
                <h3 className="font-editorial text-lg font-bold text-slate-900 mt-0.5">
                  Where are you dressing for?
                </h3>
              </div>

              <div className="space-y-2.5">
                {occasions.map((occ) => {
                  const isSelected = selectedOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => {
                        setSelectedOccasion(occ.id);
                        handleGenerateOutfit(occ.id);
                      }}
                      className={`w-full flex items-center justify-between rounded-2xl p-3.5 text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{occ.icon}</span>
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isSelected ? 'text-purple-900' : 'text-slate-800'
                            }`}
                          >
                            {occ.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{occ.desc}</p>
                        </div>
                      </div>

                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-700">Style Vibe Filter</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Effortless Chic & Modern',
                    'Minimalist Clean Lines',
                    'Streetwear Edge',
                    'Classic Tailored',
                  ].map((vibe) => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => setUserVibe(vibe)}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                        userVibe === vibe
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-purple-50'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleGenerateOutfit()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer"
              >
                <Wand2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Styling Your Look...' : 'Generate AI Outfit'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Curated Outfit Display Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 text-xs">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p>{error}</p>
              </div>
            )}

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-900 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Outfit saved to your Favorites collection!</span>
              </div>
            )}

            {!currentOutfit && !isLoading ? (
              <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center space-y-3 shadow-xs">
                <Sparkles className="h-12 w-12 text-purple-300 mx-auto" />
                <h3 className="font-editorial text-lg font-bold text-slate-900">
                  Ready to Style Your Look
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Pick an occasion on the left and click "Generate AI Outfit" to synthesize a complete
                  runway-ready ensemble from your closet.
                </p>
                <button
                  onClick={() => handleGenerateOutfit('Casual Wear')}
                  className="rounded-full bg-purple-100 px-5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-200 transition-colors"
                >
                  Generate Quick Casual Look
                </button>
              </div>
            ) : null}

            {isLoading && (
              <div className="rounded-3xl border border-purple-200 bg-white p-16 text-center space-y-4 shadow-sm">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <span className="absolute h-full w-full rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
                  <Sparkles className="h-6 w-6 text-pink-500 animate-pulse" />
                </div>
                <h4 className="font-editorial text-xl font-bold text-slate-900">
                  Curating from your Wardrobe...
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Cross-referencing {wardrobe.length} clothing items for color compatibility,
                  fabric weights, and silhouette balance for {selectedOccasion}.
                </p>
              </div>
            )}

            {currentOutfit && !isLoading && (
              <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-md space-y-6 animate-in fade-in duration-300">
                {/* Header: Title and Save Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
                  <div>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 uppercase">
                      {currentOutfit.occasion}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-slate-900 mt-1">
                      {currentOutfit.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveCurrentOutfit}
                      className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Save Outfit</span>
                    </button>
                    <button
                      onClick={() => handleGenerateOutfit()}
                      className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Generate Another Outfit"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Clothing Items Grid (The Actual Closet Items Chosen) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Included Closet Pieces ({currentOutfit.items.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentOutfit.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-purple-100 overflow-hidden bg-slate-50 shadow-2xs group hover:border-purple-300 transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-square w-full overflow-hidden relative">
                          <img
                            src={item.imageUrl}
                            alt={item.clothingName}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute top-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-800">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[11px] font-bold text-slate-900 line-clamp-1">
                            {item.clothingName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className="h-2 w-2 rounded-full border border-black/10"
                              style={{ backgroundColor: item.dominantColourHex }}
                            />
                            <span className="text-[10px] text-slate-500">{item.dominantColour}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why This Outfit Matches */}
                <div className="rounded-2xl bg-purple-50/70 border border-purple-100 p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span>Why This Outfit Matches</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentOutfit.explanation}
                  </p>
                </div>

                {/* Colour Compatibility Explanation */}
                <div className="rounded-2xl bg-pink-50/60 border border-pink-100 p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-950">
                    <Palette className="h-4 w-4 text-pink-600" />
                    <span>Color Theory & Compatibility Analysis</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentOutfit.colorCompatibilityExplanation}
                  </p>
                </div>

                {/* Styling Notes */}
                {currentOutfit.stylingNotes && currentOutfit.stylingNotes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700">Runway Styling Advice:</span>
                    <ul className="space-y-1">
                      {currentOutfit.stylingNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
