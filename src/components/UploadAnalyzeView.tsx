import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Image as ImageIcon,
  Edit2,
  Layers,
  Palette,
  Tag,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { ClothingCategory, ClothingItem } from '../types/wardrobe';
import { SAMPLE_UPLOAD_PRESETS } from '../data/initialWardrobe';
import { analyzeClothingImage, fileToBase64, urlToBase64, AnalysisResult } from '../services/api';

interface UploadAnalyzeViewProps {
  onSaveToWardrobe: (item: ClothingItem) => void;
  onNavigateToWardrobe: () => void;
}

export const UploadAnalyzeView: React.FC<UploadAnalyzeViewProps> = ({
  onSaveToWardrobe,
  onNavigateToWardrobe,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Editable analysis state
  const [editName, setEditName] = useState<string>('');
  const [editCategory, setEditCategory] = useState<ClothingCategory>('Tops');
  const [editDominantColor, setEditDominantColor] = useState<string>('');
  const [editColorHex, setEditColorHex] = useState<string>('#A78BFA');
  const [editPattern, setEditPattern] = useState<string>('Solid');
  const [editStyle, setEditStyle] = useState<string>('Casual');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: ClothingCategory[] = [
    'Tops',
    'Bottoms',
    'Dresses',
    'Jackets',
    'Shoes',
    'Accessories',
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file size exceeds 15MB. Please upload a smaller image.');
      return;
    }

    setError(null);
    setIsSaved(false);
    setAnalysis(null);
    setFileName(file.name);
    setMimeType(file.type);

    try {
      const b64 = await fileToBase64(file);
      setSelectedImage(b64);
      triggerAnalysis(b64, file.type);
    } catch (err) {
      setError('Failed to process image file.');
    }
  };

  const handleSelectPreset = async (preset: (typeof SAMPLE_UPLOAD_PRESETS)[0]) => {
    setError(null);
    setIsSaved(false);
    setAnalysis(null);
    setFileName(preset.name);
    setSelectedImage(preset.imageUrl);

    // Convert sample url to base64 for real Gemini inference
    try {
      const b64 = await urlToBase64(preset.imageUrl);
      triggerAnalysis(b64 || preset.imageUrl, 'image/jpeg');
    } catch {
      triggerAnalysis(preset.imageUrl, 'image/jpeg');
    }
  };

  const triggerAnalysis = async (imgData: string, type: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await analyzeClothingImage(imgData, type);
      setAnalysis(res);
      setEditName(res.clothingName);
      setEditCategory(res.category as ClothingCategory);
      setEditDominantColor(res.dominantColour);
      setEditColorHex(res.dominantColourHex || '#8B5CF6');
      setEditPattern(res.pattern);
      setEditStyle(res.style);
    } catch (err: any) {
      setError(err.message || 'Error executing Gemini vision clothing analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveItem = () => {
    if (!selectedImage) return;

    const newItem: ClothingItem = {
      id: `item-${Date.now()}`,
      clothingName: editName || 'Custom Fashion Item',
      imageUrl: selectedImage,
      category: editCategory,
      clothingType: analysis?.clothingType || editCategory,
      dominantColour: editDominantColor || 'Custom Shade',
      dominantColourHex: editColorHex || '#8B5CF6',
      secondaryColours: analysis?.secondaryColours || [],
      pattern: editPattern,
      style: editStyle,
      suitableOccasions: analysis?.suitableOccasions || ['Casual Wear'],
      fabricAndTexture: analysis?.fabricAndTexture || 'Woven fabric',
      pairingTips: analysis?.pairingTips || 'Style with complementary wardrobe pieces.',
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    onSaveToWardrobe(newItem);
    setIsSaved(true);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
    setIsSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multimodal Vision Feature • Gemini 3.8 Flash</span>
        </div>
        <h1 className="font-editorial text-3xl font-bold text-slate-900">
          AI Clothing Recognition & Upload
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Upload any photograph of your clothes. Gemini multimodal vision will automatically detect
          the category, dominant color, pattern, style, and occasions.
        </p>
      </div>

      {/* Main Grid: Upload Zone (Left) & AI Analysis Review Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload / Image Area (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {!selectedImage ? (
            /* Drag and Drop Box */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-white/70 p-10 text-center hover:border-purple-500 hover:bg-purple-50/40 transition-all cursor-pointer shadow-xs min-h-[360px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-600 mb-4 shadow-sm">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="font-editorial text-lg font-bold text-slate-900">
                Drag & Drop Clothing Photograph
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Supports JPG, PNG, WEBP (camera photos, closet pictures, flat-lays) up to 15MB.
              </p>

              <button
                type="button"
                className="mt-6 rounded-full bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition-colors"
              >
                Browse From Device
              </button>
            </div>
          ) : (
            /* Selected Image Preview with Overlay Controls */
            <div className="relative rounded-3xl overflow-hidden border-2 border-purple-200 bg-black shadow-lg">
              <img
                src={selectedImage}
                alt="Uploaded garment preview"
                className="w-full max-h-[480px] object-contain mx-auto bg-slate-900"
              />

              {/* Scanning visual radar when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <span className="absolute h-full w-full rounded-full border-4 border-purple-400 border-t-transparent animate-spin" />
                    <Sparkles className="h-8 w-8 text-pink-300 animate-pulse" />
                  </div>
                  <h4 className="font-editorial text-xl font-bold mt-4">Gemini Vision Scanning...</h4>
                  <p className="text-xs text-purple-200 mt-1 text-center">
                    Extracting silhouette, category, color harmony, and pattern vectors
                  </p>
                </div>
              )}

              {/* Top toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-white/80 p-2 text-slate-800 backdrop-blur-md hover:bg-white transition-colors cursor-pointer"
                  title="Replace photo"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-full bg-red-500/80 p-2 text-white backdrop-blur-md hover:bg-red-600 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/90 p-3 backdrop-blur-md text-xs">
                <span className="font-medium text-slate-700 truncate max-w-[200px]">{fileName}</span>
                <button
                  onClick={() => triggerAnalysis(selectedImage, mimeType)}
                  disabled={isAnalyzing}
                  className="text-purple-700 font-bold hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>Re-analyze</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick-test Presets Gallery (Instant Testing) */}
          <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Instant Academic Test Presets
              </span>
              <span className="text-[11px] text-slate-400">1-click AI demo</span>
            </div>
            <p className="text-xs text-slate-500">
              Test Gemini image analysis without uploading your own photos:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_UPLOAD_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="group flex flex-col rounded-xl border border-slate-200 overflow-hidden text-left hover:border-purple-400 hover:shadow-md transition-all cursor-pointer bg-slate-50"
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{preset.name}</p>
                    <span className="text-[10px] text-purple-600 font-medium">{preset.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Results & Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <p>{error}</p>
            </div>
          )}

          {isSaved && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h4 className="font-bold text-sm">Successfully Added to Your Virtual Wardrobe!</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                "{editName}" has been saved into your digital catalog with its AI visual attributes.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={onNavigateToWardrobe}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  <span>Open Virtual Wardrobe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Upload Another
                </button>
              </div>
            </div>
          )}

          {/* Analysis Result Card */}
          <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-editorial text-lg font-bold text-slate-900">
                  AI Clothing Attribute Analysis
                </h3>
              </div>
              {analysis && (
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                  {Math.round((analysis.confidenceScore || 0.95) * 100)}% Confidence
                </span>
              )}
            </div>

            {!analysis && !isAnalyzing ? (
              <div className="py-12 text-center space-y-2 text-slate-400">
                <ImageIcon className="h-12 w-12 mx-auto stroke-1" />
                <p className="text-xs font-medium">Upload or select an image to inspect AI analysis.</p>
              </div>
            ) : null}

            {analysis && (
              <div className="space-y-5">
                {/* Editable Garment Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Edit2 className="h-3 w-3 text-purple-600" />
                    <span>Garment Title (Editable)</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-purple-600 focus:outline-none"
                  />
                </div>

                {/* Category & Garment Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Layers className="h-3 w-3 text-purple-600" />
                      <span>Category</span>
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as ClothingCategory)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-purple-600 focus:outline-none bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-purple-600" />
                      <span>Clothing Type</span>
                    </label>
                    <input
                      type="text"
                      value={analysis.clothingType}
                      disabled
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Color Detection & Swatch */}
                <div className="rounded-2xl bg-purple-50/50 border border-purple-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Palette className="h-4 w-4 text-purple-600" />
                      <span>Smart Colour Detection</span>
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-purple-700">
                      {editColorHex}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium">Dominant Colour</label>
                      <input
                        type="text"
                        value={editDominantColor}
                        onChange={(e) => setEditDominantColor(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-purple-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editColorHex}
                        onChange={(e) => setEditColorHex(e.target.value)}
                        className="h-9 w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                      />
                      <div className="text-[11px] text-slate-500">
                        Color Swatch
                      </div>
                    </div>
                  </div>

                  {analysis.secondaryColours && analysis.secondaryColours.length > 0 && (
                    <div className="pt-2 border-t border-purple-100/60">
                      <span className="text-[11px] text-slate-500">Secondary Accents:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {analysis.secondaryColours.map((sec, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 border border-purple-100 shadow-2xs"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pattern & Style */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700">Pattern</span>
                    <input
                      type="text"
                      value={editPattern}
                      onChange={(e) => setEditPattern(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700">Style Vibe</span>
                    <input
                      type="text"
                      value={editStyle}
                      onChange={(e) => setEditStyle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Occasions & Pairing Tips */}
                <div className="rounded-2xl bg-slate-50 p-3.5 space-y-2 text-xs border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Calendar className="h-3.5 w-3.5 text-purple-600" />
                    <span>Suitable Occasions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.suitableOccasions.map((occ, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-purple-700"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>

                  {analysis.pairingTips && (
                    <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-600">
                      <strong className="text-slate-800">Stylist Note: </strong>
                      {analysis.pairingTips}
                    </div>
                  )}
                </div>

                {/* Add to Wardrobe Button */}
                <button
                  onClick={handleSaveItem}
                  disabled={isSaved}
                  className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-600 opacity-90'
                      : 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isSaved ? 'Saved in Digital Wardrobe' : 'Add to My Wardrobe'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
