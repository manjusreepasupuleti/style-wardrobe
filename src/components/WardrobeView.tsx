import React, { useState } from 'react';
import {
  Search,
  Filter,
  Heart,
  Edit2,
  Trash2,
  PlusCircle,
  Tag,
  Palette,
  Layers,
  Sparkles,
  ArrowUpDown,
  X,
  Check,
} from 'lucide-react';
import { ClothingCategory, ClothingItem } from '../types/wardrobe';

interface WardrobeViewProps {
  wardrobe: ClothingItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: ClothingItem) => void;
  onNavigateToUpload: () => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  wardrobe,
  onToggleFavorite,
  onDeleteItem,
  onUpdateItem,
  onNavigateToUpload,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'category'>('newest');

  // Edit item state
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes', 'Accessories'];

  // Extract unique colors available in the wardrobe
  const availableColors = ['All', ...Array.from(new Set(wardrobe.map((i) => i.dominantColour)))];

  // Filtering & Sorting
  const filteredItems = wardrobe
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesColor =
        selectedColor === 'All' ||
        item.dominantColour.toLowerCase() === selectedColor.toLowerCase();
      const matchesSearch =
        item.clothingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clothingType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dominantColour.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.style.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesColor && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.clothingName.localeCompare(b.clothingName);
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-700 mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span>Pinterest-Style Digital Catalog</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-slate-900">
            My Virtual Wardrobe
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {wardrobe.length} items cataloged and indexed with AI attributes.
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Clothing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-xs space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All' ? wardrobe.length : wardrobe.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Color filter, and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, fabric, style, occasion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Color filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 focus:border-purple-600 focus:outline-none bg-slate-50/50"
            >
              {availableColors.map((col) => (
                <option key={col} value={col}>
                  Color: {col}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 focus:border-purple-600 focus:outline-none bg-slate-50/50"
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="name">Sort: Garment Name</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Pinterest Masonry Cards */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-purple-200 bg-white p-12 text-center space-y-3">
          <Layers className="h-12 w-12 text-purple-300 mx-auto" />
          <h3 className="font-editorial text-lg font-bold text-slate-800">
            No clothing items match your filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your color or category filter, or upload a new garment to expand your collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedColor('All');
              setSearchQuery('');
            }}
            className="rounded-full bg-purple-100 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl border border-purple-100 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              {/* Image Container with Badges */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-purple-50">
                <img
                  src={item.imageUrl}
                  alt={item.clothingName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Favorite Heart Button */}
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-md hover:scale-110 transition-transform cursor-pointer"
                  title="Toggle favorite"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      item.isFavorite
                        ? 'fill-pink-500 text-pink-500'
                        : 'text-slate-400 hover:text-pink-500'
                    }`}
                  />
                </button>

                {/* Category & Color Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-800 backdrop-blur-md shadow-2xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: item.dominantColourHex }}
                  />
                  <span>{item.category}</span>
                </div>

                {/* Subtype Badge */}
                <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-xs">
                  {item.clothingType}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {item.clothingName}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {item.dominantColour}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.pattern}
                    </span>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.style}
                    </span>
                  </div>
                </div>

                {item.pairingTips && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {item.pairingTips}
                  </p>
                )}

                {/* Card Actions: Edit & Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex items-center gap-1 text-slate-500 hover:text-purple-700 font-semibold cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-600 font-semibold cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-purple-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-editorial text-lg font-bold text-slate-900">
                Edit Clothing Item
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Garment Name</label>
                <input
                  type="text"
                  value={editingItem.clothingName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, clothingName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as ClothingCategory,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold bg-white focus:border-purple-600 focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Dominant Colour</label>
                  <input
                    type="text"
                    value={editingItem.dominantColour}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, dominantColour: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pattern</label>
                  <input
                    type="text"
                    value={editingItem.pattern}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, pattern: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Style Vibe</label>
                  <input
                    type="text"
                    value={editingItem.style}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, style: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
