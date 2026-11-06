import React, { useState, useRef } from 'react';
import {
  Search,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Layers,
  Palette,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { ClothingItem, SimilarityMatch } from '../types/wardrobe';
import { searchSimilarClothing, fileToBase64, urlToBase64 } from '../services/api';

interface SimilaritySearchViewProps {
  wardrobe: ClothingItem[];
  onNavigateToUpload: () => void;
}

export const SimilaritySearchView: React.FC<SimilaritySearchViewProps> = ({
  wardrobe,
  onNavigateToUpload,
}) => {
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [matches, setMatches] = useState<SimilarityMatch[]>([]);
  const [referenceAnalysis, setReferenceAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured inspiration queries to test similarity instantly
  const inspirationGallery = [
    {
      title: 'Lavender Knitwear Inspiration',
      category: 'Tops',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Minimalist Ivory Button-Down',
      category: 'Tops',
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Tailored Camel Outerwear',
      category: 'Jackets',
      imageUrl: 'https://images.unsplash.com/photo-1548624149-f9b276fa4c99?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Clean Platform Sneakers',
      category: 'Shoes',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    try {
      const b64 = await fileToBase64(file);
      setReferenceImage(b64);
      executeSearch(b64);
    } catch {
      setError('Failed to load image.');
    }
  };

  const handleSelectInspiration = async (insp: (typeof inspirationGallery)[0]) => {
    setReferenceImage(insp.imageUrl);
    try {
      const b64 = await urlToBase64(insp.imageUrl);
      executeSearch(b64 || insp.imageUrl);
    } catch {
      executeSearch(insp.imageUrl);
    }
  };

  const executeSearch = async (imgData: string) => {
    if (wardrobe.length === 0) {
      setError('Your wardrobe is empty. Upload clothes first to run similarity matches.');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const result = await searchSimilarClothing(imgData, wardrobe);
      setReferenceAnalysis(result.referenceAnalysis);
      setMatches(result.matches);
    } catch (err: any) {
      setError(err.message || 'Error executing visual similarity search.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          <Search className="h-3.5 w-3.5" />
          <span>Computer Vision & Retrieval</span>
        </div>
        <h1 className="font-editorial text-3xl font-bold text-slate-900">
          Visual Similarity Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Upload any reference photo or fashion inspiration. SmartStyle indexes your wardrobe using
          category vectors, dominant & secondary color distances, and pattern attributes to find your
          closest existing pieces.
        </p>
      </div>

      {/* Query Uploader & Inspiration Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Reference Image Area (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Query Reference Image
            </span>

            {!referenceImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 p-8 text-center hover:border-purple-500 transition-all cursor-pointer min-h-[220px]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <UploadCloud className="h-10 w-10 text-purple-500 mb-2" />
                <p className="text-xs font-bold text-slate-800">Upload Reference Image</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Snap an outfit or upload from Pinterest / Instagram
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-slate-900 aspect-[4/3]">
                <img
                  src={referenceImage}
                  alt="Reference Query"
                  className="h-full w-full object-contain"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 backdrop-blur-md hover:bg-white transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            )}

            {/* Inferred Reference Vectors Snippet */}
            {referenceAnalysis && (
              <div className="rounded-2xl bg-purple-50/60 p-3.5 border border-purple-100 space-y-2 text-xs">
                <span className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  <span>Extracted Query Features</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Category: </span>
                    <strong className="text-slate-800">{referenceAnalysis.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Color: </span>
                    <strong className="text-slate-800">{referenceAnalysis.dominantColour}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Pattern: </span>
                    <strong className="text-slate-800">{referenceAnalysis.pattern}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Style: </span>
                    <strong className="text-slate-800">{referenceAnalysis.style}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Inspiration Gallery */}
          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Or Pick from Inspiration Gallery
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {inspirationGallery.map((insp) => (
                <button
                  key={insp.title}
                  onClick={() => handleSelectInspiration(insp)}
                  className="group rounded-xl border border-slate-200 overflow-hidden text-left hover:border-purple-400 hover:shadow-md transition-all cursor-pointer bg-slate-50"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={insp.imageUrl}
                      alt={insp.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{insp.title}</p>
                    <span className="text-[9px] text-purple-600 font-semibold">{insp.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Similarity Ranked Results Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <p>{error}</p>
            </div>
          )}

          {isSearching && (
            <div className="rounded-3xl border border-purple-200 bg-white p-12 text-center space-y-4">
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                <span className="absolute h-full w-full rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-slate-900">
                Computing Visual Similarity Metrics...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Comparing categorical taxonomy, dominant colour delta-E approximation, and pattern signatures against your wardrobe.
              </p>
            </div>
          )}

          {!isSearching && matches.length === 0 && (
            <div className="rounded-3xl border border-purple-100 bg-white p-12 text-center space-y-3">
              <Search className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="font-editorial text-lg font-bold text-slate-800">
                Search Your Wardrobe Visually
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select an inspiration image on the left to rank your own wardrobe items from highest to lowest similarity.
              </p>
            </div>
          )}

          {!isSearching && matches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-slate-900">
                    Ranked Similarity Matches ({matches.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ranked by multi-factor attribute alignment and color proximity.
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  Top Match: {matches[0].similarityPercentage}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matches.map((match, idx) => (
                  <div
                    key={match.item.id}
                    className="rounded-3xl border border-purple-100 bg-white p-4 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-purple-50 shrink-0 relative">
                        <img
                          src={match.item.imageUrl}
                          alt={match.item.clothingName}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-1 left-1 rounded-md bg-black/60 px-1 py-0.5 text-[8px] text-white">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-purple-600 uppercase">
                            {match.item.category}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                              match.similarityPercentage >= 70
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {match.similarityPercentage}% Match
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {match.item.clothingName}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="h-2 w-2 rounded-full border border-black/10"
                            style={{ backgroundColor: match.item.dominantColourHex }}
                          />
                          <span className="text-[10px] text-slate-500">
                            {match.item.dominantColour} • {match.item.pattern}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match reason breakdown pills */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500">Matching Attributes:</span>
                      <div className="flex flex-wrap gap-1">
                        {match.matchReasons.map((reason, rIdx) => (
                          <span
                            key={rIdx}
                            className="rounded-md bg-purple-50 px-2 py-0.5 text-[9px] font-medium text-purple-800"
                          >
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Architecture Note */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-1.5 text-xs text-indigo-950">
            <div className="flex items-center gap-1.5 font-bold">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>Academic Engineering Architecture</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              In this implementation, visual similarity combines Gemini multimodal attribute
              extraction (category, color, pattern, silhouette) with weighted distance metrics. The
              pipeline is modularized with clean interfaces so a custom TensorFlow/PyTorch ResNet-50
              or MobileNet embedding vector model can be plugged directly into this endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
