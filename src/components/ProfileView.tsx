import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Upload,
  Database,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { ClothingItem, UserProfile } from '../types/wardrobe';

interface ProfileViewProps {
  user: UserProfile;
  wardrobe: ClothingItem[];
  onUpdateUser: (user: UserProfile) => void;
  onImportWardrobe: (items: ClothingItem[]) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  wardrobe,
  onUpdateUser,
  onImportWardrobe,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [stylePreference, setStylePreference] = useState(user.stylePreference);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [jsonImportError, setJsonImportError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      stylePreference,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(wardrobe, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smartstyle_wardrobe_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportWardrobe(parsed);
          setJsonImportError(null);
          alert(`Successfully imported ${parsed.length} wardrobe items!`);
        } else {
          setJsonImportError('Invalid JSON format: expected an array of clothing items.');
        }
      } catch (err) {
        setJsonImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Color distribution
  const colorCounts: Record<string, number> = {};
  wardrobe.forEach((item) => {
    colorCounts[item.dominantColour] = (colorCounts[item.dominantColour] || 0) + 1;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 mb-1">
          <User className="h-3.5 w-3.5" />
          <span>User Profile & Academic Project Specifications</span>
        </div>
        <h1 className="font-editorial text-3xl font-bold text-slate-900">
          My Account & System Info
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal style profile and inspect project architecture details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: User Details Card (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-4 border-b border-purple-100 pb-5">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-purple-200 shadow-md"
              />
              <div>
                <h3 className="font-editorial text-xl font-bold text-slate-900">{user.name}</h3>
                <p className="text-xs text-purple-700 font-semibold">{user.email}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>Member since {user.joinedDate}</span>
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Style Aesthetic</label>
                <input
                  type="text"
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </form>
          </div>

          {/* Database Integration & JSON Backup (Satisfies: "once you give this web i will connect it to the database") */}
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              <h3 className="font-editorial text-base font-bold text-slate-900">
                Database Sync & Backup
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your wardrobe records to JSON to easily seed or migrate into Firebase Firestore,
              PostgreSQL, Supabase, or MongoDB.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Wardrobe JSON</span>
              </button>

              <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Import Wardrobe JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {jsonImportError && (
              <p className="text-[11px] text-red-600">{jsonImportError}</p>
            )}
          </div>
        </div>

        {/* Right: Academic Specifications & Architecture (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Academic Capstone Card */}
          <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-900 to-indigo-950 p-6 text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-purple-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-purple-300" />
                <div>
                  <h3 className="font-editorial text-lg font-bold">Academic Project Reference</h3>
                  <p className="text-[11px] text-purple-200">B.Tech IT AI/ML Final Year Capstone</p>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-200">
                2026 Batch
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-purple-100">
              <p>
                <strong>Project Title:</strong> SmartStyle – AI-Based Virtual Wardrobe and Fashion Recommendation System.
              </p>
              <p>
                <strong>Core Vision Model:</strong> Google Gemini 3.8 Flash (Multimodal Generative AI) with structured response schema inference.
              </p>
              <p>
                <strong>Extracted Attributes:</strong> Taxonomy Category, Specific Clothing Type, Dominant & Secondary Colors (Hex Quantization), Pattern, Formality Vibe, Suitable Occasions, and Material Texture.
              </p>
              <p>
                <strong>Recommendation Engine:</strong> Color harmony logic (complementary, split-complementary, monochromatic) and silhouette balancing over user's authenticated digital closet.
              </p>
              <p>
                <strong>Modularity:</strong> Built with clean interfaces ready for TensorFlow embedding vectors (ResNet / MobileNet visual search).
              </p>
            </div>

            {/* Architecture Pipeline Schema */}
            <div className="rounded-2xl bg-black/30 p-4 border border-white/10 font-mono text-[10px] space-y-1 text-purple-200">
              <p className="text-white font-bold mb-1">// End-to-End Execution Pipeline:</p>
              <p>1. Camera / File Upload → Base64 Stream</p>
              <p>2. POST /api/gemini/analyze-clothing</p>
              <p>3. Gemini 3.8 Flash Multimodal Inference</p>
              <p>4. Attribute Extraction & JSON Schema Parse</p>
              <p>5. User Review & Virtual Wardrobe Persistence</p>
              <p>6. AI Stylist Occasion Combinatorics</p>
              <p>7. Visual Distance Retrieval Ranking</p>
            </div>
          </div>

          {/* Wardrobe Color Analytics Card */}
          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <h3 className="font-editorial text-base font-bold text-slate-900">
                Personal Style Palette Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Breakdown of dominant colors extracted across your wardrobe:
            </p>

            <div className="space-y-2">
              {Object.entries(colorCounts).map(([color, count]) => {
                const percentage = Math.round((count / wardrobe.length) * 100);
                const sampleItem = wardrobe.find((w) => w.dominantColour === color);
                return (
                  <div key={color} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full border border-black/10"
                          style={{ backgroundColor: sampleItem?.dominantColourHex || '#94a3b8' }}
                        />
                        <span className="font-semibold text-slate-800">{color}</span>
                      </div>
                      <span className="text-slate-500">{count} items ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
