import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support base64 image uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Shared Gemini AI client with telemetry user-agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Health check & configuration status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API: Multimodal Clothing Analysis using Gemini 3.8 Flash Vision
app.post('/api/gemini/analyze-clothing', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not yet populated
      console.warn('GEMINI_API_KEY is not configured, returning mock attribute analysis');
      return res.json({
        success: true,
        source: 'simulated_fallback',
        analysis: {
          clothingName: 'Chic Tailored Fashion Item',
          category: 'Tops',
          clothingType: 'Blouse / Shirt',
          dominantColour: 'Lavender',
          dominantColourHex: '#C4B5FD',
          secondaryColours: ['Soft White', 'Pastel Lilac'],
          pattern: 'Solid',
          style: 'Casual / Elegant',
          suitableOccasions: ['Casual Wear', 'Party Wear'],
          fabricAndTexture: 'Lightweight woven fabric with soft handfeel',
          pairingTips: 'Pairs beautifully with high-waisted neutral denim or pleated trousers.',
          confidenceScore: 0.94,
        },
      });
    }

    // Clean base64 data prefix if present (e.g., data:image/png;base64,...)
    const cleanBase64 = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const promptText = `You are an expert AI fashion stylist and computer vision analyst for SmartStyle.
Analyze this uploaded clothing photograph with high precision.
Identify:
1. clothingName: A descriptive, stylish title (e.g., "Lavender Knit Cardigan", "Wide-Leg Indigo Jeans", "Floral Satin Slip Dress", "Oversized Charcoal Blazer").
2. category: Strictly one of ["Tops", "Bottoms", "Dresses", "Jackets", "Shoes", "Accessories"].
3. clothingType: Specific garment type (e.g., "T-Shirt", "Blouse", "Sweater", "Jeans", "Trousers", "Midi Skirt", "Maxi Dress", "Blazer", "Denim Jacket", "Sneakers", "Loafers", "Heels").
4. dominantColour: The primary, most prominent color name (e.g., "Lavender", "Pastel Pink", "Navy Blue", "Olive Green", "Beige", "Burgundy").
5. dominantColourHex: A matching representative 6-digit hex code (e.g., "#8B5CF6", "#F472B6", "#1E3A8A", "#10B981", "#F59E0B").
6. secondaryColours: Array of additional accent or secondary color names present.
7. pattern: One of ["Solid", "Floral", "Striped", "Plaid", "Polka Dot", "Graphic", "Animal Print", "Textured", "Abstract"].
8. style: One of ["Casual", "Formal", "Elegant", "Chic", "Streetwear", "Minimalist", "Boho", "Athleisure", "Party"].
9. suitableOccasions: Array with 1-3 suitable occasions from ["Casual Wear", "Formal Wear", "Party Wear", "Date Night", "Work / Office", "Travel"].
10. fabricAndTexture: Short description of observable material (e.g., "Cotton jersey", "Denim", "Linen blend", "Silk satin", "Wool knit").
11. pairingTips: 1-2 actionable styling recommendations for outfits.
12. confidenceScore: Number between 0.85 and 0.99.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clothingName: { type: Type.STRING },
            category: { type: Type.STRING },
            clothingType: { type: Type.STRING },
            dominantColour: { type: Type.STRING },
            dominantColourHex: { type: Type.STRING },
            secondaryColours: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            pattern: { type: Type.STRING },
            style: { type: Type.STRING },
            suitableOccasions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            fabricAndTexture: { type: Type.STRING },
            pairingTips: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
          },
          required: [
            'clothingName',
            'category',
            'clothingType',
            'dominantColour',
            'dominantColourHex',
            'secondaryColours',
            'pattern',
            'style',
            'suitableOccasions',
            'fabricAndTexture',
            'pairingTips',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const analysis = JSON.parse(rawText);

    return res.json({
      success: true,
      source: 'gemini_vision',
      analysis,
    });
  } catch (error: any) {
    console.error('Gemini vision analysis error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze clothing image with Gemini',
    });
  }
});

// API: AI Fashion Stylist - Occasion Outfit Recommendation
app.post('/api/gemini/recommend-outfit', async (req: Request, res: Response) => {
  try {
    const { occasion, wardrobeItems = [], userVibe = 'Sophisticated & effortless' } = req.body;

    if (!occasion) {
      return res.status(400).json({ error: 'Occasion is required' });
    }

    if (!Array.isArray(wardrobeItems) || wardrobeItems.length === 0) {
      return res.status(400).json({ error: 'User wardrobe is empty. Add clothes first.' });
    }

    const ai = getGeminiClient();

    // Summary of available inventory for Gemini reasoning
    const inventorySummary = wardrobeItems.map((item: any) => ({
      id: item.id,
      clothingName: item.clothingName,
      category: item.category,
      clothingType: item.clothingType,
      dominantColour: item.dominantColour,
      secondaryColours: item.secondaryColours || [],
      pattern: item.pattern,
      style: item.style,
      suitableOccasions: item.suitableOccasions || [],
    }));

    if (!ai) {
      // Fallback rule-based recommendation if GEMINI_API_KEY is missing
      const tops = wardrobeItems.filter((i: any) => i.category === 'Tops');
      const bottoms = wardrobeItems.filter((i: any) => i.category === 'Bottoms');
      const dresses = wardrobeItems.filter((i: any) => i.category === 'Dresses');
      const shoes = wardrobeItems.filter((i: any) => i.category === 'Shoes');
      const jackets = wardrobeItems.filter((i: any) => i.category === 'Jackets');

      let selectedItems: any[] = [];
      let explanation = '';
      let colorTheory = '';

      if (occasion === 'Party Wear' && dresses.length > 0) {
        selectedItems.push(dresses[0]);
        if (shoes.length > 0) selectedItems.push(shoes[0]);
        if (jackets.length > 0) selectedItems.push(jackets[0]);
        explanation = `A statement ${dresses[0].clothingName} curated for ${occasion}, creating an elegant silhouette.`;
        colorTheory = `Centered on ${dresses[0].dominantColour} with balanced accessories.`;
      } else if (tops.length > 0 && bottoms.length > 0) {
        selectedItems.push(tops[0]);
        selectedItems.push(bottoms[0]);
        if (shoes.length > 0) selectedItems.push(shoes[0]);
        if (jackets.length > 0) selectedItems.push(jackets[0]);
        explanation = `Harmonious pairing of ${tops[0].clothingName} and ${bottoms[0].clothingName} for ${occasion}.`;
        colorTheory = `Complementary blend between ${tops[0].dominantColour} and ${bottoms[0].dominantColour}.`;
      } else {
        selectedItems = wardrobeItems.slice(0, 3);
        explanation = `Curated selection of items tailored to ${occasion}.`;
        colorTheory = 'Clean aesthetic balance across textures.';
      }

      return res.json({
        success: true,
        source: 'rule_fallback',
        outfit: {
          occasion,
          itemIds: selectedItems.map((i) => i.id),
          items: selectedItems,
          title: `${occasion} Ensemble`,
          explanation,
          colorCompatibilityExplanation: colorTheory,
          formalityScore: 88,
          stylingNotes: [
            'Roll sleeves slightly for a modern relaxed touch.',
            'Maintain minimal accessories to keep focal piece accented.',
          ],
        },
      });
    }

    const promptText = `You are SmartStyle's Chief AI Fashion Stylist.
The user wants an outfit recommendation for the occasion: "${occasion}".
User style vibe: "${userVibe}".

Available Wardrobe Inventory (MUST choose ONLY from these exact items by id):
${JSON.stringify(inventorySummary, null, 2)}

Fashion Rules:
1. Complete Outfit Logic:
   - Option A: 1 Top + 1 Bottom + (optional 1 Shoes) + (optional 1 Jacket / Accessory)
   - Option B: 1 Dress + (optional 1 Shoes) + (optional 1 Jacket / Accessory)
2. Occasion Suitability:
   - Casual Wear: relaxed, comfortable, harmonious colors (e.g. t-shirt + jeans + sneakers, or casual dress).
   - Formal Wear: tailored, structured pieces, muted or classic colors (e.g. blazers, trousers, crisp shirts, formal shoes).
   - Party Wear: statement pieces, vibrant or metallic/satin finishes, dresses, chic layers.
   - Date Night: elevated casual or chic dress/tailored mix with flattering contrasts.
3. Color Theory:
   - Explain why the dominant and secondary colors work together (monochromatic, complementary, neutral anchor, analogous harmony).
4. Strictly return valid itemIds that exist in the provided wardrobe list. Do NOT invent items not present in the list.

Respond with structured JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            itemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            explanation: { type: Type.STRING },
            colorCompatibilityExplanation: { type: Type.STRING },
            formalityScore: { type: Type.INTEGER },
            stylingNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'title',
            'itemIds',
            'explanation',
            'colorCompatibilityExplanation',
            'formalityScore',
            'stylingNotes',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const matchedItems = (parsed.itemIds || [])
      .map((id: string) => wardrobeItems.find((w: any) => w.id === id))
      .filter(Boolean);

    return res.json({
      success: true,
      source: 'gemini_ai',
      outfit: {
        occasion,
        ...parsed,
        items: matchedItems,
      },
    });
  } catch (error: any) {
    console.error('Gemini stylist error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate outfit recommendation',
    });
  }
});

// API: Visual Similarity Search
app.post('/api/gemini/similarity-search', async (req: Request, res: Response) => {
  try {
    const { referenceImageBase64, mimeType = 'image/jpeg', wardrobeItems = [] } = req.body;

    if (!referenceImageBase64) {
      return res.status(400).json({ error: 'referenceImageBase64 is required' });
    }

    if (!Array.isArray(wardrobeItems) || wardrobeItems.length === 0) {
      return res.json({
        success: true,
        referenceAnalysis: null,
        matches: [],
        message: 'No items in wardrobe to compare against.',
      });
    }

    const ai = getGeminiClient();
    const cleanBase64 = referenceImageBase64.includes('base64,')
      ? referenceImageBase64.split('base64,')[1]
      : referenceImageBase64;

    let refAnalysis: any = null;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this reference clothing item to find visually similar pieces. Extract:
category ("Tops", "Bottoms", "Dresses", "Jackets", "Shoes", "Accessories"),
dominantColour, secondaryColours, pattern, style, clothingType.`,
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              clothingType: { type: Type.STRING },
              dominantColour: { type: Type.STRING },
              secondaryColours: { type: Type.ARRAY, items: { type: Type.STRING } },
              pattern: { type: Type.STRING },
              style: { type: Type.STRING },
            },
            required: ['category', 'dominantColour', 'pattern', 'style'],
          },
        },
      });

      refAnalysis = JSON.parse(response.text || '{}');
    } else {
      refAnalysis = {
        category: 'Tops',
        clothingType: 'Shirt',
        dominantColour: 'Lavender',
        secondaryColours: ['White'],
        pattern: 'Solid',
        style: 'Casual',
      };
    }

    // Similarity ranking engine (Modular: ready for TensorFlow image embeddings)
    // Category match: 40 points
    // Dominant colour match: 30 points
    // Pattern match: 15 points
    // Style match: 15 points
    const scoredItems = wardrobeItems.map((item: any) => {
      let score = 0;
      const reasons: string[] = [];

      // Category match
      if (
        refAnalysis.category &&
        item.category &&
        item.category.toLowerCase() === refAnalysis.category.toLowerCase()
      ) {
        score += 40;
        reasons.push(`Matching category (${item.category})`);
      }

      // Dominant colour match
      if (
        refAnalysis.dominantColour &&
        item.dominantColour &&
        item.dominantColour.toLowerCase() === refAnalysis.dominantColour.toLowerCase()
      ) {
        score += 30;
        reasons.push(`Identical dominant color (${item.dominantColour})`);
      } else if (
        refAnalysis.dominantColour &&
        item.secondaryColours &&
        item.secondaryColours.some(
          (c: string) => c.toLowerCase() === refAnalysis.dominantColour.toLowerCase()
        )
      ) {
        score += 15;
        reasons.push(`Color found in secondary accents`);
      }

      // Pattern match
      if (
        refAnalysis.pattern &&
        item.pattern &&
        item.pattern.toLowerCase() === refAnalysis.pattern.toLowerCase()
      ) {
        score += 15;
        reasons.push(`Matching pattern (${item.pattern})`);
      }

      // Style match
      if (
        refAnalysis.style &&
        item.style &&
        item.style.toLowerCase() === refAnalysis.style.toLowerCase()
      ) {
        score += 15;
        reasons.push(`Matching vibe (${item.style})`);
      }

      return {
        item,
        similarityPercentage: Math.min(100, Math.max(10, score)),
        matchReasons: reasons,
      };
    });

    // Sort descending by score
    scoredItems.sort((a, b) => b.similarityPercentage - a.similarityPercentage);

    return res.json({
      success: true,
      referenceAnalysis: refAnalysis,
      matches: scoredItems,
    });
  } catch (error: any) {
    console.error('Visual similarity search error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to execute visual similarity search',
    });
  }
});

// In-memory data store with JSON file persistence
import fs from 'fs';

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'wardrobe-db.json');

interface DatabaseSchema {
  wardrobe: any[];
  outfits: any[];
  user: any;
}

const loadDatabase = (): DatabaseSchema => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read wardrobe-db.json, initializing default:', err);
  }
  return {
    wardrobe: [],
    outfits: [],
    user: {
      id: 'user-demo-101',
      name: 'Manjusree Pasupuleti',
      email: 'manjusreepasupuleti25@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      stylePreference: 'Modern Minimalist & Chic Elegance',
      joinedDate: 'March 2026',
    },
  };
};

const saveDatabase = (db: DatabaseSchema) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write wardrobe-db.json:', err);
  }
};

let db = loadDatabase();

// REST API: Wardrobe Items (CRUD)
app.get('/api/wardrobe', (req: Request, res: Response) => {
  res.json({ success: true, wardrobe: db.wardrobe });
});

app.post('/api/wardrobe', (req: Request, res: Response) => {
  const item = req.body;
  if (!item || !item.clothingName) {
    return res.status(400).json({ error: 'clothingName is required' });
  }
  const newItem = {
    ...item,
    id: item.id || `item-${Date.now()}`,
    createdAt: item.createdAt || new Date().toISOString(),
  };
  db.wardrobe.unshift(newItem);
  saveDatabase(db);
  res.status(201).json({ success: true, item: newItem });
});

app.put('/api/wardrobe/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.wardrobe.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  db.wardrobe[index] = { ...db.wardrobe[index], ...req.body };
  saveDatabase(db);
  res.json({ success: true, item: db.wardrobe[index] });
});

app.delete('/api/wardrobe/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.wardrobe = db.wardrobe.filter((i) => i.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Item deleted' });
});

app.patch('/api/wardrobe/:id/favorite', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = db.wardrobe.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  item.isFavorite = !item.isFavorite;
  saveDatabase(db);
  res.json({ success: true, item });
});

// REST API: Outfits (CRUD)
app.get('/api/outfits', (req: Request, res: Response) => {
  res.json({ success: true, outfits: db.outfits });
});

app.post('/api/outfits', (req: Request, res: Response) => {
  const outfit = req.body;
  const newOutfit = {
    ...outfit,
    id: outfit.id || `outfit-${Date.now()}`,
    createdAt: outfit.createdAt || new Date().toISOString(),
  };
  db.outfits.unshift(newOutfit);
  saveDatabase(db);
  res.status(201).json({ success: true, outfit: newOutfit });
});

app.delete('/api/outfits/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.outfits = db.outfits.filter((o) => o.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Outfit removed' });
});

// REST API: User Profile
app.get('/api/user', (req: Request, res: Response) => {
  res.json({ success: true, user: db.user });
});

app.put('/api/user', (req: Request, res: Response) => {
  db.user = { ...db.user, ...req.body };
  saveDatabase(db);
  res.json({ success: true, user: db.user });
});

// Root redirect to /kisaansathi/ if base path is configured
app.get('/', (req: Request, res: Response, next) => {
  res.redirect('/kisaansathi/');
});

// Setup Vite middleware in dev or static serve in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use('/kisaansathi', express.static(distPath));
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartStyle server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
