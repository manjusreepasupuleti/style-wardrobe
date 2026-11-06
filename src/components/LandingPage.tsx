import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Shirt,
  Palette,
  Search,
  Wand2,
  Upload,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Eye,
  TrendingUp,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExplore }) => {
  return (
    <div className="w-full space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Soft background glow spheres */}
        <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-purple-200/50 blur-3xl" />
        <div className="absolute top-20 right-1/4 -z-10 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute top-40 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  B.Tech IT AI/ML Capstone Project
                </span>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-800">
                  Gemini 3.8 Flash
                </span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Fashion Stylist
                </span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
                Discover your style, organize your digital wardrobe, and create stunning outfit
                combinations using multimodal Artificial Intelligence and color theory.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onExplore}
                  className="flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-7 py-3.5 text-sm font-semibold text-purple-900 shadow-xs hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span>Explore SmartStyle</span>
                </button>
              </div>

              {/* Quick stats ticker */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-100/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="font-editorial text-2xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Multimodal Vision</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-bold text-slate-900">6+</p>
                  <p className="text-xs text-slate-500">Clothing Categories</p>
                </div>
                <div>
                  <p className="font-editorial text-2xl font-bold text-slate-900">&lt;2s</p>
                  <p className="text-xs text-slate-500">Styling Generation</p>
                </div>
              </div>
            </div>

            {/* Right Fashion Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main featured fashion frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-purple-100">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
                    alt="Editorial Fashion Model"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-block rounded-full bg-purple-500/80 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md mb-1">
                      Autumn / Winter Curated Look
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-white">
                      The Pastel & Tailored Silhouette
                    </h3>
                    <p className="text-xs text-purple-200">
                      Coordinated via Gemini Color Theory Reasoning
                    </p>
                  </div>
                </div>

                {/* Floating Wardrobe Cards */}
                <div className="absolute -top-6 -left-6 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white/95 p-2.5 shadow-xl border border-purple-100 backdrop-blur-md animate-bounce duration-1000">
                  <img
                    src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=200&q=80"
                    alt="Lavender Top"
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Tops Identified</span>
                    <p className="text-xs font-bold text-slate-800">Lavender Knit Cardigan</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      <span className="text-[10px] text-slate-500">#A78BFA • 96% Match</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-xl border border-purple-100 backdrop-blur-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Stylist Active</p>
                    <p className="text-[11px] text-slate-500">Matching from your actual closet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold tracking-wide text-purple-700 uppercase">
            Core AI Capabilities
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900">
            Intelligent Fashion Technology
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Engineered with multimodal deep learning vision to give you complete command over your personal wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mb-5">
              <Shirt className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. AI Clothing Recognition</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload any clothing photo from your device. Gemini Vision automatically classifies the garment category, sub-type, pattern, fabric, and silhouette.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors mb-5">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Digital Virtual Wardrobe</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pinterest-style organized catalog of your clothes. Filter instantly by Tops, Bottoms, Dresses, Jackets, and Shoes with smart search and favorites.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-5">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Smart Colour Detection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Extracts dominant shades, secondary accent colors, and precise hex swatches to build an algorithmic color palette profile of your wardrobe.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-5">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Visual Similarity Search</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload an inspiration photo or outfit you saw online. SmartStyle finds the closest visual matches already in your closet using multi-attribute ranking.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group rounded-3xl border border-purple-100 bg-white p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all lg:col-span-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white mb-5">
              <Wand2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. AI Outfit Recommendations</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select Casual, Formal, or Party occasions. SmartStyle formulates full outfits strictly from your real clothes, explaining the color compatibility theory, silhouette balance, and styling tips so you look runway ready every day.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 to-pink-50/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wide text-purple-700 uppercase shadow-xs">
              Simple 4-Step Process
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900">
              How SmartStyle Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From phone camera snap to personalized fashion recommendations in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
              <span className="text-3xl font-editorial font-bold text-purple-200">01</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 mt-2 mb-4">
                <Upload className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Upload Clothes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a photo or drag & drop images of your shirts, dresses, pants, or jackets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
              <span className="text-3xl font-editorial font-bold text-purple-200">02</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-700 mt-2 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">AI Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini 3.8 Flash extracts category, dominant color, pattern, style, and occasions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
              <span className="text-3xl font-editorial font-bold text-purple-200">03</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mt-2 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Digital Wardrobe</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review and save to your searchable, filterable virtual closet.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-3xl bg-white p-6 shadow-sm border border-purple-100">
              <span className="text-3xl font-editorial font-bold text-purple-200">04</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white mt-2 mb-4">
                <Wand2 className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Smart Recommendations</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick your occasion and receive personalized outfit combinations instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Project Presentation Section */}
      <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-purple-200 backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-purple-300" />
                <span>Academic Project Specification • B.Tech Information Technology</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                SmartStyle: AI-Based Virtual Wardrobe & Fashion Recommendation System
              </h3>
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                Built to explore multimodal AI image understanding in sustainable digital fashion. Incorporates Google Gemini 3.8 Flash for visual attribute extraction and structured JSON inference, with a modular architecture ready for TensorFlow feature embeddings.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-purple-200">React 19 + TypeScript</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-purple-200">Express Full-Stack</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-purple-200">Gemini 3.8 Flash Vision</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-purple-200">Color Harmony Algorithms</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-purple-200">GitHub Pages Ready</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={onGetStarted}
                className="w-full rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-bold text-purple-950 hover:bg-purple-50 transition-colors shadow-lg cursor-pointer"
              >
                Launch Virtual Wardrobe
              </button>
              <button
                onClick={onExplore}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-center text-sm font-bold text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                View Live Styling Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 border-t border-purple-100 text-slate-500 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base font-bold text-slate-800">SmartStyle</span>
            <span>• "Your Wardrobe. Your Style. Powered by AI."</span>
          </div>
          <p>© 2026 SmartStyle Fashion AI. Academic B.Tech IT AI/ML Capstone Project.</p>
        </div>
      </footer>
    </div>
  );
};
