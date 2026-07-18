import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// import { Queue, Worker } from "bullmq"; // Mocking queues for preview

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  app.use(express.json());

  // Socket.io integration
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    socket.emit("status", { message: "Connected to API Gateway" });
    
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  // API Gateway Routes
  const apiRouter = express.Router();
  
  // Cache for etsy search (keeps same query for 1 day)
  const searchCache = new Map<string, { timestamp: number, data: any }>();
  
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", services: ["gateway", "socket"] });
  });

  apiRouter.get("/stats", (req, res) => {
    res.json({
      healthScore: 92,
      activeTasks: 3,
      trendsFound: 14,
      totalListings: 128
    });
  });

  apiRouter.post("/ai-studio/generate", (req, res) => {
    const { prompt } = req.body;
    const jobId = Math.random().toString(36).substring(7);
    
    // Process asynchronously
    (async () => {
      try {
        io.emit("task_progress", { jobId, progress: 10, message: "Starting generation pipeline..." });
        
        let imageUrl = "https://placehold.co/600x400/png?text=Mockup";
        let mockupUrl = "https://placehold.co/600x400/png?text=Lifestyle+Mockup";
        
        // 1. Runware API Image Generation
        if (process.env.RUNWARE_API_KEY) {
          io.emit("task_progress", { jobId, progress: 30, message: "Generating design and mockup with Runware..." });
          try {
            const runwareRes = await fetch("https://api.runware.ai/v1", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify([
                {
                  taskType: "authentication",
                  apiKey: process.env.RUNWARE_API_KEY
                },
                {
                  taskType: "imageInference",
                  taskUUID: crypto.randomUUID(),
                  positivePrompt: `Create a flat, high quality print-ready POD product design on a pure white background (NOT a mockup, just the design itself) for: ${prompt}`,
                  width: 512,
                  height: 512,
                  numberResults: 1,
                  model: "rundiffusion:120@100"
                },
                {
                  taskType: "imageInference",
                  taskUUID: crypto.randomUUID(),
                  positivePrompt: `Create a professional lifestyle product photography mockup of a person wearing a t-shirt featuring this design concept, aesthetic cinematic lighting, highly detailed: ${prompt}`,
                  width: 512,
                  height: 512,
                  numberResults: 1,
                  model: "rundiffusion:120@100"
                }
              ])
            });
            if (runwareRes.ok) {
              const runwareData = await runwareRes.json();
              // The data array might contain results for both tasks if they succeed
              const images = runwareData.data?.filter((d: any) => d.imageURL) || [];
              if (images.length > 0) {
                imageUrl = images[0].imageURL;
                if (images.length > 1) {
                  mockupUrl = images[1].imageURL;
                } else {
                  mockupUrl = imageUrl;
                }
              }
            }
          } catch (e) {
            console.error("Runware generation failed:", e);
          }
        }
        
        io.emit("task_progress", { jobId, progress: 60, message: "Generating SEO title and description with Gemini..." });
        
        let title = "Generated Design";
        let description = "Description based on: " + prompt;
        let tags: string[] = [];
        
        // 2. Gemini API Content Generation
        if (process.env.GEMINI_API_KEY) {
          try {
            // @ts-ignore
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
            
            const geminiPrompt = `You are an expert Etsy copywriter and SEO specialist. Based on the following prompt, generate a product listing.

CRITICAL RULES:
1. Title MUST be 100 characters maximum.
2. You MUST provide exactly 13 tags.
3. Each tag MUST be 20 characters maximum.
4. Description MUST be at least 1500 characters (or at least 400 words) long.
5. Description MUST include sections on: Why buy this product, Who is it for, Where to use it.
6. The entire text must be highly optimized for AI-driven search and traditional SEO.

Prompt: ${prompt}

Return the response in JSON format exactly like this schema:
{
  "title": "A highly optimized title (max 100 chars)",
  "description": "A compelling description with keywords, at least 1500 chars...",
  "tags": ["tag1", "tag2"] // Exactly 13 tags
}`;
            
            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: geminiPrompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    tags: { type: "array", items: { type: "string" } }
                  },
                  required: ["title", "description", "tags"]
                }
              }
            });
            const contentData = JSON.parse(response.text?.trim() || "{}");
            if (contentData.title) title = contentData.title;
            if (contentData.description) description = contentData.description;
            if (contentData.tags) tags = contentData.tags;
          } catch (e) {
            console.error("Gemini generation failed:", e);
          }
        }
        
        io.emit("task_progress", { jobId, progress: 90, message: "Finalizing..." });
        
        setTimeout(() => {
          io.emit("task_complete", { 
            jobId, 
            result: { 
              title, 
              description,
              tags,
              imageUrl,
              mockupUrl
            } 
          });
        }, 1000);

      } catch (e) {
        console.error("Generation error", e);
        io.emit("task_complete", { 
          jobId, 
          result: { 
            title: "Error", 
            description: "Failed to generate",
            imageUrl: "https://placehold.co/600x400/png?text=Error"
          } 
        });
      }
    })();

    res.json({ status: "queued", jobId });
  });

  apiRouter.post("/ai-studio/analyze-listing", async (req, res) => {
    try {
      const { title, description, tags } = req.body;
      const cacheKey = `listing_${title}_${tags?.join(',')}`.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < 86400000) {
          return res.json(cached.data);
        }
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Add it to Settings > Secrets." });
      }

      // @ts-ignore - import only here to avoid issues if not installed
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const prompt = `You are an expert Etsy SEO and conversion rate optimization expert. 
      Analyze the following Etsy listing and provide specific, actionable suggestions for improvement.
      Return the response in JSON format with exactly this schema:
      {
        "titleSuggestions": ["suggestion 1", "suggestion 2"],
        "tagSuggestions": ["tag1", "tag2"],
        "descriptionCritique": "A short critique and suggestion for the description.",
        "seoScore": 85
      }

      Listing Title: ${title || "None"}
      Listing Tags: ${Array.isArray(tags) ? tags.join(", ") : "None"}
      Listing Description (first 500 chars): ${description ? description.substring(0, 500) : "None"}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              titleSuggestions: { type: "array", items: { type: "string" } },
              tagSuggestions: { type: "array", items: { type: "string" } },
              descriptionCritique: { type: "string" },
              seoScore: { type: "number" }
            },
            required: ["titleSuggestions", "tagSuggestions", "descriptionCritique", "seoScore"]
          }
        }
      });

      const jsonStr = response.text?.trim() || "{}";
      const data = JSON.parse(jsonStr);
      searchCache.set(`listing_${title}_${tags?.join(',')}`.toLowerCase(), { timestamp: Date.now(), data });

      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze listing" });
    }
  });

  apiRouter.post("/ai-studio/analyze-shop", async (req, res) => {
    try {
      const { shopName, announcement, title } = req.body;
      const cacheKey = `shop_${shopName}`.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < 86400000) {
          return res.json(cached.data);
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Add it to Settings > Secrets." });
      }

      // @ts-ignore
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const prompt = `You are an expert Etsy shop optimizer. 
      Analyze the following Etsy shop and provide specific, actionable suggestions for improvement.
      Return the response in JSON format with exactly this schema:
      {
        "shopTitleCritique": "Critique and suggestion",
        "announcementCritique": "Critique and suggestion",
        "brandingTips": ["tip1", "tip2"],
        "overallScore": 85
      }

      Shop Name: ${shopName || "None"}
      Shop Title: ${title || "None"}
      Announcement: ${announcement || "None"}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              shopTitleCritique: { type: "string" },
              announcementCritique: { type: "string" },
              brandingTips: { type: "array", items: { type: "string" } },
              overallScore: { type: "number" }
            },
            required: ["shopTitleCritique", "announcementCritique", "brandingTips", "overallScore"]
          }
        }
      });

      const jsonStr = response.text?.trim() || "{}";
      const data = JSON.parse(jsonStr);
      searchCache.set(`shop_${shopName}`.toLowerCase(), { timestamp: Date.now(), data });

      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze shop" });
    }
  });

  apiRouter.post("/ai-studio/analyze-keyword", async (req, res) => {
    try {
      const { keyword, topTags } = req.body;
      const cacheKey = `keyword_${keyword}`.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < 86400000) {
          return res.json(cached.data);
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Add it to Settings > Secrets." });
      }

      // @ts-ignore
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const prompt = `You are an expert Etsy keyword researcher. 
      Analyze the keyword '${keyword}' and its commonly associated tags.
      Return the response in JSON format with exactly this schema:
      {
        "competitionLevel": "High/Medium/Low",
        "searchIntent": "What buyers are looking for",
        "nicheOpportunities": ["idea1", "idea2", "idea3"],
        "recommendedLongTail": ["long1", "long2"],
        "opportunityScore": 8,
        "scoreReasoning": "Why this score was given"
      }

      Associated Tags from top listings: ${Array.isArray(topTags) ? topTags.join(", ") : "None"}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              competitionLevel: { type: "string" },
              searchIntent: { type: "string" },
              nicheOpportunities: { type: "array", items: { type: "string" } },
              recommendedLongTail: { type: "array", items: { type: "string" } },
              opportunityScore: { type: "number" },
              scoreReasoning: { type: "string" }
            },
            required: ["competitionLevel", "searchIntent", "nicheOpportunities", "recommendedLongTail", "opportunityScore", "scoreReasoning"]
          }
        }
      });

      const jsonStr = response.text?.trim() || "{}";
      const data = JSON.parse(jsonStr);
      searchCache.set(`keyword_${keyword}`.toLowerCase(), { timestamp: Date.now(), data });

      res.json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze keyword" });
    }
  });

  apiRouter.get("/etsy/search", async (req, res) => {
    try {
      const q = req.query.q as string;
      if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      const cacheKey = q.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey)!;
        // 1 day = 24 * 60 * 60 * 1000 = 86400000 ms
        if (Date.now() - cached.timestamp < 86400000) {
          console.log(`Serving Etsy search for "${q}" from cache`);
          return res.json(cached.data);
        }
      }

      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_SHARED_SECRET || process.env.ETSY_API_SECRET;
      
      if (!apiKey) {
        return res.status(500).json({ error: "ETSY_API_KEY is not configured" });
      }

      // The user explicitly requested the api key and shared secret separated by a colon
      const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      const headers: Record<string, string> = { "x-api-key": headerValue };
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
      
      // Helper to enrich listings with Images and Shop info
      const enrichListings = async (listings: any[]) => {
        if (!listings || listings.length === 0) return [];
        const ids = listings.map(l => l.listing_id).join(',');
        const batchResponse = await fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${ids}&includes=Images,Shop`, { headers });
        if (batchResponse.ok) {
          const batchData = await batchResponse.json();
          return batchData.results || listings;
        }
        return listings;
      };

      // 1. Try if it's a Numeric Listing ID
      if (/^\d+$/.test(q)) {
        try {
          const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${q}?includes=Images,Shop`, { headers });
          if (response.ok) {
            const data = await response.json();
            const resultData = { results: [data], type: "listing" };
            searchCache.set(cacheKey, { timestamp: Date.now(), data: resultData });
            return res.json(resultData);
          }
        } catch (e) {
          console.error("Listing ID search failed, falling back...");
        }
      }

      // 2. Try if it's a Shop Name
      try {
        const shopResponse = await fetch(`https://openapi.etsy.com/v3/application/shops?shop_name=${encodeURIComponent(q)}`, { headers });
        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          if (shopData.results && shopData.results.length > 0) {
            const shopId = shopData.results[0].shop_id;
            const listingsResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active?limit=20`, { headers });
            if (listingsResponse.ok) {
              const listingsData = await listingsResponse.json();
              if (listingsData.results && listingsData.results.length > 0) {
                const enriched = await enrichListings(listingsData.results);
                const resultData = { results: enriched, type: "shop" };
                searchCache.set(cacheKey, { timestamp: Date.now(), data: resultData });
                return res.json(resultData);
              }
            }
          }
        }
      } catch (e) {
        console.error("Shop name search failed, falling back...");
      }

      // 3. Fallback to Keyword Search
      const keywordResponse = await fetch(`https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(q)}&limit=20`, { headers });
      if (keywordResponse.ok) {
        const keywordData = await keywordResponse.json();
        const enriched = await enrichListings(keywordData.results);
        const resultData = { results: enriched, type: "keyword" };
        searchCache.set(cacheKey, { timestamp: Date.now(), data: resultData });
        return res.json(resultData);
      } else {
        const errorText = await keywordResponse.text();
        return res.status(keywordResponse.status).json({ error: "Failed to fetch from Etsy API", details: errorText });
      }

    } catch (error) {
      console.error("Etsy search error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  apiRouter.get("/etsy/listing/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_SHARED_SECRET;
      if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY is not configured" });

      const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      const headers: Record<string, string> = { "x-api-key": headerValue };
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${id}?includes=Images,Shop,Videos`, { headers });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "Failed to fetch from Etsy API", details: errorText });
      }
    } catch (error) {
      console.error("Etsy listing error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  apiRouter.get("/etsy/shop/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_SHARED_SECRET;
      if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY is not configured" });

      const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      const headers: Record<string, string> = { "x-api-key": headerValue };
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      // Get shop details
      const shopResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${id}`, { headers });
      if (!shopResponse.ok) {
        const errorText = await shopResponse.text();
        return res.status(shopResponse.status).json({ error: "Failed to fetch shop from Etsy API", details: errorText });
      }
      const shopData = await shopResponse.json();

      // Get shop listings
      const listingsResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${id}/listings/active?limit=20&includes=Images`, { headers });
      let listings = [];
      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json();
        listings = listingsData.results || [];
      }

      return res.json({ shop: shopData, listings });
    } catch (error) {
      console.error("Etsy shop error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const codeVerifiers = new Map<string, string>();

  apiRouter.get("/auth/etsy/url", (req, res) => {
    const redirectUri = req.query.redirect_uri as string;
    if (!redirectUri) return res.status(400).json({ error: "Missing redirect_uri" });

    const state = Math.random().toString(36).substring(7);
    const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Etsy requires S256 code challenge
    const crypto = require("crypto");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    codeVerifiers.set(state, codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.ETSY_API_KEY || '',
      redirect_uri: redirectUri,
      scope: 'listings_r shops_r',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    res.json({ url: `https://www.etsy.com/oauth/connect?${params}` });
  });

  apiRouter.post("/auth/etsy/token", async (req, res) => {
    const { code, state, redirect_uri } = req.body;
    const codeVerifier = codeVerifiers.get(state);
    
    if (!codeVerifier) {
      return res.status(400).json({ error: "Invalid state or missing code verifier" });
    }

    try {
      const response = await fetch("https://api.etsy.com/v3/public/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.ETSY_API_KEY || '',
          redirect_uri: redirect_uri,
          code: code,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "Failed to exchange token", details: errorText });
      }

      const data = await response.json();
      // Clean up verifier
      codeVerifiers.delete(state);
      
      res.json(data);
    } catch (error) {
      console.error("Token exchange error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Simple endpoint to simulate checking token
  apiRouter.get("/auth/etsy/status", (req, res) => {
    // In a real app we'd check session/cookies
    // Here we'll just return connected: false and let the client manage token in localStorage for preview purposes
    res.json({ connected: false });
  });

  app.use("/api", apiRouter);

  app.get('/auth/callback', (req, res) => {
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              const urlParams = new URLSearchParams(window.location.search);
              const code = urlParams.get('code');
              const state = urlParams.get('state');
              
              if (code) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  code: code,
                  state: state 
                }, '*');
                window.close();
              } else {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR' }, '*');
                window.close();
              }
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication complete. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
