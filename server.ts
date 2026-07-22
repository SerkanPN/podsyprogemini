process.env.GEMINI_API_KEY = "AIzaSyC4V6fCSqUh6HtAFCNiMSocJqS4rsAkFBk";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import crypto from "crypto";
import fsSync from "fs";
import fs from "fs/promises";
import { prisma } from "./db";

dotenv.config();

const ASSETS_FILE = path.join(process.cwd(), "assets.json");
if (!fsSync.existsSync(ASSETS_FILE)) {
  fsSync.writeFileSync(ASSETS_FILE, JSON.stringify([]));
}

// import { Queue, Worker } from "bullmq"; // Mocking queues for preview

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.use(express.json({ limit: '10mb' }));

  app.get("/api/pod-assets", async (req, res) => {
    try {
      const data = await fs.readFile(ASSETS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: "Failed to read assets" });
    }
  });

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

  // --- ETSY OAUTH 2.0 PKCE ---
  
  // Base64URL encode buffer
  const base64URLEncode = (buffer: Buffer) => {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  // Temporary store for code_verifier (in memory for now, should be session/DB in prod)
  const authState = new Map<string, string>();

  apiRouter.get("/etsy/auth", (req, res) => {
    const apiKey = process.env.ETSY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY missing" });

    // Generate state and PKCE verifier
    const state = Math.random().toString(36).substring(2, 15);
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const codeChallenge = base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());

    // Save verifier mapped to state
    authState.set(state, codeVerifier);

    const redirectUri = "http://localhost:3000/api/etsy/callback";
    const scope = "listings_r transactions_r shops_r profile_r favorites_r";

    const authUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&client_id=${apiKey}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    
    res.redirect(authUrl);
  });

  apiRouter.get("/etsy/callback", async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).send("Missing code or state");

    const codeVerifier = authState.get(state as string);
    if (!codeVerifier) return res.status(400).send("Invalid state or verifier expired");

    authState.delete(state as string);

    const apiKey = process.env.ETSY_API_KEY;
    const redirectUri = "http://localhost:3000/api/etsy/callback";

    try {
      const response = await fetch("https://api.etsy.com/v3/public/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: apiKey,
          redirect_uri: redirectUri,
          code,
          code_verifier: codeVerifier
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).send(`Failed to get token: ${JSON.stringify(data)}`);
      }

      // We have the access_token. Let's fetch the shop ID.
      const userRes = await fetch(`https://openapi.etsy.com/v3/application/users/me`, {
        headers: { "x-api-key": apiKey, "Authorization": `Bearer ${data.access_token}` }
      });
      const userData = await userRes.json();
      const shopId = userData.shop_id;

      if (!shopId) {
        return res.send("Logged in user does not have a shop.");
      }


      // Ensure a dummy user exists for relations
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({ data: { email: "admin@podsypro.com" }});
      }

      // We should also fetch the shop details to get the proper name
      const shopDetailsRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}`, {
        headers: { "x-api-key": apiKey, "Authorization": `Bearer ${data.access_token}` }
      });
      let shopName = "Connected Shop";
      if (shopDetailsRes.ok) {
        const shopData = await shopDetailsRes.json();
        shopName = shopData.shop_name || shopName;
      }

      // Upsert the shop with the tokens
      await prisma.shop.upsert({
        where: { etsyShopId: shopId.toString() },
        update: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          shopName: shopName,
          hasFullDetails: true
        },
        create: {
          userId: user.id,
          etsyShopId: shopId.toString(),
          shopName: shopName,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          hasFullDetails: true
        }
      });

      // Redirect back to our app (or send a success HTML page that closes itself)
      res.send(`
        <html>
          <body>
            <h2>Etsy Shop Connected Successfully!</h2>
            <p>You can close this window and return to PodsyPro.</p>
            <script>
              // Notify the extension if possible, or just close
              setTimeout(() => { window.close(); }, 3000);
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error(err);
      res.status(500).send("Internal error");
    }
  });

  // --- DEEP SYNC ARCHITECTURE ---

  apiRouter.post("/etsy/sync-shop", async (req, res) => {
    const { shopId } = req.body; // Internal shop ID or etsyShopId
    if (!shopId) return res.status(400).json({ error: "Missing shopId" });

    try {
      const shop = await prisma.shop.findFirst({ where: { etsyShopId: shopId } });
      if (!shop || !shop.accessToken) {
        return res.status(404).json({ error: "Shop not found or not connected" });
      }

      const apiKey = process.env.ETSY_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY missing" });

      const headers = { "x-api-key": apiKey, "Authorization": `Bearer ${shop.accessToken}` };

      // 1. Fetch Shop Stats
      const shopRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsyShopId}`, { headers });
      if (shopRes.ok) {
        const shopData = await shopRes.json();
        const totalSales = shopData.transaction_sold_count || 0;
        
        await prisma.shop.update({
          where: { id: shop.id },
          data: { totalSales, rawJson: JSON.stringify(shopData) }
        });
        
        await prisma.shopSnapshot.create({
          data: { shopId: shop.id, totalSales }
        });
      }

      // 2. Fetch Active Listings
      const listingsRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsyShopId}/listings/active?limit=100`, { headers });
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        for (const item of listingsData.results) {
          const price = item.price?.amount ? item.price.amount / item.price.divisor : 0;
          await prisma.listing.upsert({
            where: { etsyId: item.listing_id.toString() },
            update: {
              title: item.title,
              views: item.views,
              favorites: item.num_favorers,
              price: price,
              rawJson: JSON.stringify(item)
            },
            create: {
              shopId: shop.id,
              etsyId: item.listing_id.toString(),
              title: item.title,
              views: item.views,
              favorites: item.num_favorers,
              price: price,
              rawJson: JSON.stringify(item)
            }
          });
        }
      }

      // 3. Fetch Receipts (Orders)
      const receiptsRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsyShopId}/receipts?limit=50`, { headers });
      if (receiptsRes.ok) {
        const receiptsData = await receiptsRes.json();
        for (const receipt of receiptsData.results) {
          const rId = receipt.receipt_id.toString();
          const rDb = await prisma.receipt.upsert({
            where: { receiptId: rId },
            update: {
              status: receipt.status,
              rawJson: JSON.stringify(receipt)
            },
            create: {
              shopId: shop.id,
              receiptId: rId,
              buyerEmail: receipt.buyer_email,
              buyerUserId: receipt.buyer_user_id?.toString(),
              creationTsz: receipt.creation_tsz,
              grandtotal: receipt.grandtotal?.amount ? receipt.grandtotal.amount / receipt.grandtotal.divisor : 0,
              subtotal: receipt.subtotal?.amount ? receipt.subtotal.amount / receipt.subtotal.divisor : 0,
              status: receipt.status,
              rawJson: JSON.stringify(receipt)
            }
          });

          // Fetch transactions for this receipt if possible, or use the summary
          const transactionsRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsyShopId}/receipts/${rId}/transactions`, { headers });
          if (transactionsRes.ok) {
            const txData = await transactionsRes.json();
            for (const tx of txData.results) {
              await prisma.transaction.upsert({
                where: { transactionId: tx.transaction_id.toString() },
                update: { rawJson: JSON.stringify(tx) },
                create: {
                  receiptId: rDb.id,
                  shopId: shop.id,
                  transactionId: tx.transaction_id.toString(),
                  title: tx.title,
                  quantity: tx.quantity,
                  price: tx.price?.amount ? tx.price.amount / tx.price.divisor : 0,
                  listingId: tx.listing_id?.toString(),
                  productId: tx.product_id?.toString(),
                  rawJson: JSON.stringify(tx)
                }
              });
            }
          }
        }
      }

      return res.json({ success: true, message: "Sync complete" });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Check auth status for extension
  apiRouter.get("/etsy/auth-status", async (req, res) => {
    // Return true if any shop is connected (for now, simple global check)
    const count = await prisma.shop.count({ where: { accessToken: { not: null } } });
    res.json({ isConnected: count > 0 });
  });
  
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
    const { listingInfo } = req.body;
    const jobId = Math.random().toString(36).substring(7);
    
    // Process asynchronously
    (async () => {
      try {
        io.emit("task_progress", { jobId, progress: 10, message: "Analyzing listing and generating design prompt with Gemini..." });
        
        let imageUrl = "https://placehold.co/600x400/png?text=Mockup";
        let mockupUrls: string[] = [];
        let designPrompt = "";

        // @ts-ignore
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
        
        if (process.env.GEMINI_API_KEY && listingInfo) {
          try {
            const analyzePrompt = `You are an expert product designer. Analyze the following Etsy listing to understand the core product design.
Listing Title: ${listingInfo.title}
Listing Tags: ${listingInfo.tags ? listingInfo.tags.join(', ') : ''}

Write a highly detailed text-to-image prompt to generate a new, unique design inspired by this product. 
CRITICAL RULE: The prompt MUST describe ONLY a flat, 2D print-ready design on a solid white background. Do NOT describe a mockup, a t-shirt, a person, or a physical product. Only describe the artwork itself.
Output ONLY the prompt string.`;

            const aiRes = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents: analyzePrompt
            });
            if (aiRes.text) designPrompt = aiRes.text.trim();
          } catch (err) {
            console.error("Gemini design prompt generation failed:", err);
          }
        }

        if (process.env.RUNWARE_API_KEY) {
          io.emit("task_progress", { jobId, progress: 30, message: "Generating flat design with Runware..." });
          try {
            // Task 1: Generate the flat design
            const runwareRes1 = await fetch("https://api.runware.ai/v1", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify([
                { taskType: "authentication", apiKey: process.env.RUNWARE_API_KEY },
                {
                  taskType: "imageInference",
                  taskUUID: crypto.randomUUID(),
                  positivePrompt: `High quality flat vector design on a pure white background, print-ready, isolated. ${designPrompt}`,
                  width: 512,
                  height: 512,
                  numberResults: 1,
                  model: "rundiffusion:120@100"
                }
              ])
            });
            
            if (runwareRes1.ok) {
              const runwareData1 = await runwareRes1.json();
              const images1 = runwareData1.data?.filter((d: any) => d.imageURL) || [];
              if (images1.length > 0) {
                imageUrl = images1[0].imageURL;
              }
            }
          } catch (e) {
            console.error("Runware generation failed:", e);
          }
        }
        
        io.emit("task_progress", { jobId, progress: 75, message: "Generating SEO title and description with Gemini..." });
        
        let title = "Generated Design";
        let description = "Description based on: " + designPrompt;
        let tags: string[] = [];
        
        if (process.env.GEMINI_API_KEY) {
          try {
            let seoPrompt = `You are an expert Etsy copywriter and SEO specialist. Based on the following product design prompt, generate a product listing.
Design Prompt: ${designPrompt}`;

            if (listingInfo) {
              seoPrompt += `\n\nAlso consider this original listing for context and inspiration:
Original Title: ${listingInfo.title}
Original Tags: ${listingInfo.tags ? listingInfo.tags.join(', ') : ''}`;
            }

            seoPrompt += `\n\nCRITICAL RULES:
1. Title MUST be 100 characters maximum.
2. You MUST provide exactly 13 tags.
3. Each tag MUST be 20 characters maximum.
4. Description MUST be at least 1500 characters (or at least 400 words) long.
5. Description MUST include sections on: Why buy this product, Who is it for, Where to use it.
6. The entire text must be highly optimized for AI-driven search and traditional SEO.

Return the response in JSON format exactly like this schema:
{
  "title": "A highly optimized title (max 100 chars)",
  "description": "A compelling description with keywords, at least 1500 chars...",
  "tags": ["tag1", "tag2"] // Exactly 13 tags
}`;

            const response = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents: seoPrompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    tags: { type: "array", items: { type: "string" } }
                  }
                }
              }
            });
            
            if (response.text) {
              try {
                const jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                title = parsed.title;
                description = parsed.description;
                tags = parsed.tags;
              } catch (parseError) {
                console.error("JSON parse failed. Raw response:", response.text.substring(0, 500) + '...');
                // Fallback
                title = "Generated Design";
                description = "Failed to parse description from AI.";
                tags = ["design", "art", "custom"];
              }
            }
          } catch (e) {
            console.error("Gemini generation failed", e);
          }
        }
        
        io.emit("task_progress", { jobId, progress: 90, message: "Finalizing..." });
        
        const resultData = { 
          title, 
          description,
          tags,
          imageUrl,
          mockupUrls
        };

        // Save to JSON DB
        try {
          const raw = await fs.readFile(ASSETS_FILE, "utf-8");
          const assets = JSON.parse(raw);
          assets.unshift({
            id: crypto.randomUUID(),
            ...resultData,
            createdAt: new Date().toISOString()
          });
          await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
        } catch (dbErr) {
          console.error("Failed to save to assets DB:", dbErr);
        }

        setTimeout(() => {
          io.emit("task_complete", { 
            jobId, 
            result: resultData
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
        model: "gemini-2.0-flash",
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

      let jsonStr = response.text?.trim() || "{}";
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
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
        model: "gemini-2.0-flash",
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

      let jsonStr = response.text?.trim() || "{}";
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
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
        model: "gemini-2.0-flash",
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

      let jsonStr = response.text?.trim() || "{}";
      jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
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
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

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
      const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
      
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
            const resultData = { results: [data], type: "listing", count: 1 };
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
            const listingsResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active?limit=${limit}`, { headers });
            if (listingsResponse.ok) {
              const listingsData = await listingsResponse.json();
              if (listingsData.results && listingsData.results.length > 0) {
                const enriched = await enrichListings(listingsData.results);
                const resultData = { 
                  results: enriched, 
                  type: "shop", 
                  count: listingsData.count || enriched.length 
                };
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
      const keywordResponse = await fetch(`https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(q)}&limit=${limit}`, { headers });
      if (keywordResponse.ok) {
        const keywordData = await keywordResponse.json();
        const enriched = await enrichListings(keywordData.results);
        const resultData = { 
          results: enriched, 
          type: "keyword", 
          count: keywordData.count || enriched.length 
        };
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
      const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
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

        // Background Database Saving
        (async () => {
          try {
            // Upsert shop if present
            let dbShopId = null;
            if (data.shop) {
              const s = await prisma.shop.upsert({
                where: { etsyShopId: data.shop.shop_id.toString() },
                update: { shopName: data.shop.shop_name, rawJson: JSON.stringify(data.shop) },
                create: {
                  userId: (await prisma.user.findFirst())?.id || "",
                  etsyShopId: data.shop.shop_id.toString(),
                  shopName: data.shop.shop_name,
                  rawJson: JSON.stringify(data.shop)
                }
              });
              dbShopId = s.id;
            }

            if (dbShopId) {
              const price = data.price?.amount ? data.price.amount / data.price.divisor : 0;
              const listing = await prisma.listing.upsert({
                where: { etsyId: data.listing_id.toString() },
                update: {
                  title: data.title,
                  views: data.views,
                  favorites: data.num_favorers,
                  price: price,
                  rawJson: JSON.stringify(data)
                },
                create: {
                  shopId: dbShopId,
                  etsyId: data.listing_id.toString(),
                  title: data.title,
                  views: data.views,
                  favorites: data.num_favorers,
                  price: price,
                  rawJson: JSON.stringify(data)
                }
              });
              
              await prisma.listingSnapshot.create({
                data: {
                  listingId: listing.id,
                  views: data.views,
                  favorites: data.num_favorers,
                  price: price
                }
              });
            }
          } catch (dbErr) {
            console.error("Failed to background save listing to DB:", dbErr);
          }
        })();

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

  apiRouter.get("/etsy/listing/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
      if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY is not configured" });

      const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      const headers: Record<string, string> = { "x-api-key": headerValue };
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${id}/reviews?limit=20`, { headers });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "Failed to fetch reviews from Etsy API", details: errorText });
      }
    } catch (error: any) {
      console.error("Etsy reviews error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  apiRouter.get("/etsy/listing/:id/inventory", async (req, res) => {
    try {
      const { id } = req.params;
      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
      if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY is not configured" });

      const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      const headers: Record<string, string> = { "x-api-key": headerValue };
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }

      const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${id}/inventory`, { headers });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "Failed to fetch inventory from Etsy API", details: errorText });
      }
    } catch (error: any) {
      console.error("Etsy inventory error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  apiRouter.get("/etsy/shop/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
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
    // cPanel Passenger için özel dizin ve MIME çözümü
    const baseDir = __dirname.includes('dist-server') ? path.join(__dirname, '..') : process.cwd();
    const distPath = path.join(baseDir, 'dist');
    
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
        }
      }
    }));
    
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
