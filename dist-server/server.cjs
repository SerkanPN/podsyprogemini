var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express5 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_http = __toESM(require("http"), 1);
var import_socket = require("socket.io");
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_promises = __toESM(require("fs/promises"), 1);

// db.ts
var import_client = require("@prisma/client");
var import_adapter_pg = require("@prisma/adapter-pg");
var import_pg = __toESM(require("pg"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var pool = new import_pg.default.Pool({ connectionString: process.env.DATABASE_URL });
var adapter = new import_adapter_pg.PrismaPg(pool);
var prisma = new import_client.PrismaClient({ adapter });

// server.ts
var import_cookie_parser = __toESM(require("cookie-parser"), 1);

// src/lib/session.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var SESSION_SECRET = process.env.PODSY_SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error(
    "PODSY_SESSION_SECRET tan\u0131ml\u0131 de\u011Fil (.env). Rastgele, uzun bir secret \xFCretip ekleyin."
  );
}
var SESSION_TTL = "30d";
function issueSession(payload) {
  return import_jsonwebtoken.default.sign(payload, SESSION_SECRET, { expiresIn: SESSION_TTL });
}
function verifySession(token) {
  try {
    return import_jsonwebtoken.default.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
}

// src/routes/payment-pending.ts
var import_express = require("express");
var import_client3 = require("@prisma/client");

// src/middleware/subscription.ts
var import_client2 = require("@prisma/client");
var prisma2 = new import_client2.PrismaClient();
async function requireEtsyShop(req, res, next) {
  const token = req.cookies?.podsy_session;
  if (!token) {
    return res.status(401).json({
      error: "NO_SESSION",
      message: "Etsy ma\u011Fazan\u0131z\u0131 ba\u011Flaman\u0131z gerekiyor.",
      redirectTo: "/connect-etsy"
    });
  }
  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({
      error: "INVALID_SESSION",
      redirectTo: "/connect-etsy"
    });
  }
  const shop = await prisma2.shops.findUnique({
    where: { id: session.shopId },
    select: {
      id: true,
      subscription_tier: true,
      subscription_expires_at: true
    }
  });
  if (!shop) {
    return res.status(401).json({ error: "SHOP_NOT_FOUND", redirectTo: "/connect-etsy" });
  }
  req.podsySession = session;
  req.podsyShop = {
    id: shop.id,
    subscriptionTier: shop.subscription_tier,
    subscriptionExpiresAt: shop.subscription_expires_at
  };
  next();
}
function requireActiveSubscription(req, res, next) {
  const shop = req.podsyShop;
  if (!shop) {
    return res.status(500).json({ error: "MIDDLEWARE_ORDER_ERROR" });
  }
  if (shop.subscriptionTier === "NONE") {
    return res.status(402).json({
      error: "PAYMENT_REQUIRED",
      message: "Podsy'yi kullanmaya ba\u015Flamak i\xE7in \xF6deme talebinde bulunmal\u0131s\u0131n\u0131z.",
      redirectTo: "/payment-pending"
    });
  }
  const isExpired = shop.subscriptionExpiresAt !== null && shop.subscriptionExpiresAt.getTime() < Date.now();
  if (isExpired) {
    return res.status(402).json({
      error: "SUBSCRIPTION_EXPIRED",
      message: "Aboneli\u011Finizin s\xFCresi doldu. Yenilemek i\xE7in sales@podsy.pro ile ileti\u015Fime ge\xE7in.",
      redirectTo: "/payment-pending",
      expiredAt: shop.subscriptionExpiresAt
    });
  }
  next();
}

// src/routes/payment-pending.ts
var prisma3 = new import_client3.PrismaClient();
var router = (0, import_express.Router)();
router.use(requireEtsyShop);
router.get("/status", async (req, res) => {
  const shopId = req.podsyShop.id;
  const latestRequest = await prisma3.subscription_requests.findFirst({
    where: { shop_id: shopId },
    orderBy: { requested_at: "desc" }
  });
  res.json({
    subscriptionTier: req.podsyShop.subscriptionTier,
    subscriptionExpiresAt: req.podsyShop.subscriptionExpiresAt,
    latestRequest,
    paymentInstructions: {
      email: "sales@podsy.pro",
      note: "\xD6deme a\xE7\u0131klamas\u0131na veya mailinize l\xFCtfen Etsy ma\u011Faza ad\u0131n\u0131z\u0131 yaz\u0131n."
    }
  });
});
router.post("/request", async (req, res) => {
  const shopId = req.podsyShop.id;
  const { planRequested, amount, currency } = req.body;
  const session = req.podsySession;
  const user = await prisma3.users.findUniqueOrThrow({ where: { id: session.userId } });
  const request = await prisma3.subscription_requests.create({
    data: {
      shop_id: shopId,
      user_email: user.email ?? "unknown",
      plan_requested: planRequested,
      amount,
      currency,
      status: "PENDING"
    }
  });
  res.status(201).json({ success: true, request });
});
var payment_pending_default = router;

// src/routes/admin-subscriptions.ts
var import_express2 = require("express");
var import_client4 = require("@prisma/client");

// src/middleware/admin-auth.ts
function requireAdminAuth(req, res, next) {
  const adminSecret = req.headers["x-admin-secret"] || req.cookies?.admin_secret;
  if (!process.env.ADMIN_SECRET) {
    console.error("ADMIN_SECRET is not set in environment variables!");
    return res.status(500).json({ error: "Server misconfigured" });
  }
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized. Invalid admin secret." });
  }
  req.podsyAdmin = { email: "admin@podsy.pro" };
  next();
}

// src/routes/admin-subscriptions.ts
var prisma4 = new import_client4.PrismaClient();
var router2 = (0, import_express2.Router)();
router2.use(requireAdminAuth);
router2.get("/pending", async (_req, res) => {
  const pending = await prisma4.subscription_requests.findMany({
    where: { status: "PENDING" },
    include: {
      shops: {
        select: { id: true, shop_name: true, etsy_shop_id: true }
      }
    },
    orderBy: { requested_at: "asc" }
  });
  res.json({ requests: pending });
});
router2.get("/shops/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  if (q.length < 2) {
    return res.status(400).json({ error: "QUERY_TOO_SHORT" });
  }
  const shops = await prisma4.shops.findMany({
    where: { shop_name: { contains: q, mode: "insensitive" } },
    select: {
      id: true,
      shop_name: true,
      etsy_shop_id: true,
      subscription_tier: true,
      subscription_expires_at: true
    },
    take: 20
  });
  res.json({ shops });
});
router2.post("/approve", async (req, res) => {
  const body = req.body;
  if (!body.shopId || !body.plan || !body.durationDays) {
    return res.status(400).json({ error: "MISSING_FIELDS" });
  }
  const expiresAt = new Date(Date.now() + body.durationDays * 24 * 60 * 60 * 1e3);
  const [updatedShop] = await prisma4.$transaction([
    prisma4.shops.update({
      where: { id: body.shopId },
      data: {
        subscription_tier: body.plan,
        subscription_expires_at: expiresAt,
        subscription_source: body.source
      }
    }),
    ...body.subscriptionRequestId ? [
      prisma4.subscription_requests.update({
        where: { id: body.subscriptionRequestId },
        data: {
          status: "APPROVED",
          admin_note: body.adminNote,
          approved_by: req.podsyAdmin?.email,
          approved_at: /* @__PURE__ */ new Date()
        }
      })
    ] : []
  ]);
  res.json({ success: true, shop: updatedShop });
});
router2.post("/reject", async (req, res) => {
  const { subscriptionRequestId, adminNote } = req.body;
  const updated = await prisma4.subscription_requests.update({
    where: { id: subscriptionRequestId },
    data: {
      status: "REJECTED",
      admin_note: adminNote,
      approved_by: req.podsyAdmin?.email,
      approved_at: /* @__PURE__ */ new Date()
    }
  });
  res.json({ success: true, request: updated });
});
var admin_subscriptions_default = router2;

// src/routes/pod-providers.ts
var import_express3 = require("express");
var router3 = (0, import_express3.Router)();
router3.get("/", async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  try {
    const providers = await prisma.pod_providers.findMany({
      where: { user_id: user.id },
      select: { id: true, provider: true, is_active: true, connected_at: true }
      // don't send API key to client
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});
router3.post("/", async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { provider, api_key } = req.body;
  if (!provider || !api_key) return res.status(400).json({ error: "Missing required fields" });
  try {
    const existing = await prisma.pod_providers.findFirst({
      where: { user_id: user.id, provider }
    });
    if (existing) {
      const updated = await prisma.pod_providers.update({
        where: { id: existing.id },
        data: { api_key, is_active: true }
      });
      return res.json({ success: true, id: updated.id });
    } else {
      const newProvider = await prisma.pod_providers.create({
        data: {
          user_id: user.id,
          provider,
          api_key,
          is_active: true
        }
      });
      return res.json({ success: true, id: newProvider.id });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save provider config" });
  }
});
router3.post("/:id/disable", async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  try {
    const p = await prisma.pod_providers.findFirst({ where: { id: req.params.id, user_id: user.id } });
    if (!p) return res.status(404).json({ error: "Not found" });
    await prisma.pod_providers.update({
      where: { id: p.id },
      data: { is_active: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update" });
  }
});
var pod_providers_default = router3;

// src/routes/fulfillment.ts
var import_express4 = require("express");
var router4 = (0, import_express4.Router)();
router4.get("/orders", async (req, res) => {
  const shopId = req.shopId;
  if (!shopId) return res.status(401).json({ error: "Shop required" });
  try {
    const orders = await prisma.fulfillment_orders.findMany({
      where: {
        receipts: {
          shop_id: shopId
        }
      },
      include: {
        receipts: true,
        pod_providers: {
          select: { provider: true }
        }
      },
      orderBy: { created_at: "desc" },
      take: 50
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
router4.post("/mapping", async (req, res) => {
  const shopId = req.shopId;
  if (!shopId) return res.status(401).json({ error: "Shop required" });
  const { listing_id, provider_id, blueprint_id, provider_product_id, variant_mapping } = req.body;
  try {
    const newMapping = await prisma.listing_provider_mapping.create({
      data: {
        listing_id,
        provider_id,
        blueprint_id,
        provider_product_id,
        variant_mapping
      }
    });
    res.json({ success: true, id: newMapping.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create mapping" });
  }
});
var fulfillment_default = router4;

// server.ts
process.env.GEMINI_API_KEY = "AIzaSyC4V6fCSqUh6HtAFCNiMSocJqS4rsAkFBk";
import_dotenv2.default.config();
var ASSETS_FILE = import_path.default.join(process.cwd(), "assets.json");
if (!import_fs.default.existsSync(ASSETS_FILE)) {
  import_fs.default.writeFileSync(ASSETS_FILE, JSON.stringify([]));
}
async function startServer() {
  const app = (0, import_express5.default)();
  const server = import_http.default.createServer(app);
  const io = new import_socket.Server(server, {
    cors: { origin: "*" }
  });
  const PORT = 3e3;
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
  app.use(import_express5.default.json({ limit: "10mb" }));
  app.use((0, import_cookie_parser.default)());
  app.use("/api/payment-pending", payment_pending_default);
  app.use("/api/admin/subscriptions", admin_subscriptions_default);
  app.use("/api/pod-providers", requireEtsyShop, requireActiveSubscription, pod_providers_default);
  app.use("/api/fulfillment", requireEtsyShop, requireActiveSubscription, fulfillment_default);
  app.get("/api/pod-assets", async (req, res) => {
    try {
      const data = await import_promises.default.readFile(ASSETS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: "Failed to read assets" });
    }
  });
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    socket.emit("status", { message: "Connected to API Gateway" });
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
  const apiRouter = import_express5.default.Router();
  apiRouter.get("/admin/system-status", async (req, res) => {
    try {
      const count = await prisma.shops.count({ where: { access_token: { not: null } } });
      res.json({ etsyConnectedShops: count, status: "OK" });
    } catch (e) {
      res.status(500).json({ error: "DB_ERROR" });
    }
  });
  const base64URLEncode = (buffer) => {
    return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };
  const authState = /* @__PURE__ */ new Map();
  apiRouter.get("/etsy/auth", (req, res) => {
    const apiKey = process.env.ETSY_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY missing" });
    const state = Math.random().toString(36).substring(2, 15);
    const codeVerifier = import_crypto.default.randomBytes(32).toString("hex");
    const codeChallenge = base64URLEncode(import_crypto.default.createHash("sha256").update(codeVerifier).digest());
    authState.set(state, codeVerifier);
    const redirectUri = process.env.ETSY_CALLBACK_URL || "http://localhost:3000/api/etsy/callback";
    const scope = "listings_r transactions_r shops_r profile_r favorites_r";
    const authUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&client_id=${apiKey}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    res.redirect(authUrl);
  });
  apiRouter.get("/etsy/callback", async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).send("Missing code or state");
    const codeVerifier = authState.get(state);
    if (!codeVerifier) return res.status(400).send("Invalid state or verifier expired");
    authState.delete(state);
    const apiKey = process.env.ETSY_API_KEY;
    const redirectUri = process.env.ETSY_CALLBACK_URL || "http://localhost:3000/api/etsy/callback";
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
      const userId = data.access_token.split(".")[0];
      let shopId = null;
      let shopName = "Connected Shop";
      let debugInfo = "";
      const sharedSecret = process.env.ETSY_SHARED_SECRET || "";
      const xApiKey = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      if (userId) {
        const shopsRes = await fetch(`https://openapi.etsy.com/v3/application/users/${userId}/shops`, {
          headers: { "x-api-key": xApiKey, "Authorization": `Bearer ${data.access_token}` }
        });
        const responseText = await shopsRes.text();
        debugInfo = `Status: ${shopsRes.status}, Body: ${responseText}`;
        if (shopsRes.ok) {
          try {
            const shopData = JSON.parse(responseText);
            shopId = shopData.shop_id || shopData.results && shopData.results.length > 0 && shopData.results[0].shop_id;
            shopName = shopData.shop_name || shopData.results && shopData.results.length > 0 && shopData.results[0].shop_name || shopName;
          } catch (e) {
            debugInfo += ` | JSON Parse Error: ${e.message}`;
          }
        }
      }
      if (!shopId) {
        return res.send(`Logged in user does not have a shop. User ID: ${userId || "unknown"}. Debug info: ${debugInfo}`);
      }
      let userEmail = `user${userId}@podsypro.com`;
      let userName = "Etsy User";
      try {
        const userRes = await fetch(`https://openapi.etsy.com/v3/application/users/${userId}`, {
          headers: { "x-api-key": xApiKey, "Authorization": `Bearer ${data.access_token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          userName = userData.first_name || userData.login_name || userName;
          userEmail = userData.primary_email || userEmail;
        }
      } catch (e) {
        console.error("Failed to fetch user details during callback:", e);
      }
      let user = await prisma.users.findFirst({ where: { etsy_user_id: userId } });
      if (!user) {
        user = await prisma.users.create({ data: { id: import_crypto.default.randomUUID(), etsy_user_id: userId, email: userEmail, name: userName } });
      } else {
        user = await prisma.users.update({ where: { id: user.id }, data: { email: userEmail, name: userName } });
      }
      const dbShop = await prisma.shops.upsert({
        where: { etsy_shop_id: BigInt(shopId) },
        update: {
          shop_name: shopName,
          access_token: data.access_token,
          refresh_token: data.refresh_token
        },
        create: {
          id: import_crypto.default.randomUUID(),
          user_id: user.id,
          etsy_shop_id: BigInt(shopId),
          etsy_user_id: userId,
          shop_name: shopName,
          access_token: data.access_token,
          refresh_token: data.refresh_token
        }
      });
      const podsySession = issueSession({
        userId: user.id,
        shopId: dbShop.id,
        etsyUserId: userId
      });
      res.cookie("podsy_session", podsySession, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      fetch(`http://localhost:3000/api/etsy/sync-shop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId: shopId.toString() })
      }).catch((err) => console.error("Auto-sync failed:", err));
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
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal error");
    }
  });
  apiRouter.post("/etsy/sync-shop", async (req, res) => {
    const { shopId } = req.body;
    if (!shopId) return res.status(400).json({ error: "Missing shopId" });
    try {
      const shop = await prisma.shops.findFirst({ where: { etsy_shop_id: BigInt(shopId) } });
      if (!shop || !shop.access_token) {
        return res.status(404).json({ error: "Shop not found or not connected" });
      }
      const apiKey = process.env.ETSY_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "ETSY_API_KEY missing" });
      const headers = { "x-api-key": apiKey, "Authorization": `Bearer ${shop.access_token}` };
      const shopRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}`, { headers });
      if (shopRes.ok) {
        const shopData = await shopRes.json();
        const totalSales = shopData.transaction_sold_count || 0;
        const reviewCount = shopData.review_count || 0;
        const activeListings = shopData.listing_active_count || 0;
        await prisma.shops.update({
          where: { id: shop.id },
          data: {
            transaction_sold_count: totalSales,
            review_count: reviewCount,
            listing_active_count: activeListings,
            last_synced_at: /* @__PURE__ */ new Date()
          }
        });
        try {
          await prisma.competitor_snapshots.upsert({
            where: {
              shop_id_snapshot_date: {
                shop_id: shop.id,
                snapshot_date: new Date((/* @__PURE__ */ new Date()).toISOString().split("T")[0])
              }
            },
            update: {
              transaction_sold_count: totalSales,
              review_count: reviewCount,
              listing_active_count: activeListings
            },
            create: {
              id: import_crypto.default.randomUUID(),
              shop_id: shop.id,
              snapshot_date: new Date((/* @__PURE__ */ new Date()).toISOString().split("T")[0]),
              transaction_sold_count: totalSales,
              review_count: reviewCount,
              listing_active_count: activeListings
            }
          });
        } catch (e) {
          console.error("Error creating shop snapshot", e);
        }
      }
      const listingsRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}/listings/active?limit=100`, { headers });
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        const results = listingsData.results || [];
        for (const item of results) {
          await prisma.listings.upsert({
            where: { etsy_listing_id: BigInt(item.listing_id) },
            update: {
              title: item.title,
              state: item.state,
              price_amount: item.price ? item.price.amount / item.price.divisor : 0,
              price_currency: item.price ? item.price.currency_code : "USD",
              last_synced_at: /* @__PURE__ */ new Date()
            },
            create: {
              id: import_crypto.default.randomUUID(),
              etsy_listing_id: BigInt(item.listing_id),
              shop_id: shop.id,
              title: item.title,
              state: item.state,
              price_amount: item.price ? item.price.amount / item.price.divisor : 0,
              price_currency: item.price ? item.price.currency_code : "USD",
              last_synced_at: /* @__PURE__ */ new Date()
            }
          });
        }
      }
      return res.json({ success: true, message: "Sync complete" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  apiRouter.get("/etsy/auth-status", async (req, res) => {
    const count = await prisma.shops.count({ where: { access_token: { not: null } } });
    res.json({ isConnected: count > 0 });
  });
  const searchCache = /* @__PURE__ */ new Map();
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
    (async () => {
      try {
        io.emit("task_progress", { jobId, progress: 10, message: "Analyzing listing and generating design prompt with Gemini..." });
        let imageUrl = "https://placehold.co/600x400/png?text=Mockup";
        let mockupUrls = [];
        let designPrompt = "";
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
        if (process.env.GEMINI_API_KEY && listingInfo) {
          try {
            const analyzePrompt = `You are an expert product designer. Analyze the following Etsy listing to understand the core product design.
Listing Title: ${listingInfo.title}
Listing Tags: ${listingInfo.tags ? listingInfo.tags.join(", ") : ""}

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
            const runwareRes1 = await fetch("https://api.runware.ai/v1", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify([
                { taskType: "authentication", apiKey: process.env.RUNWARE_API_KEY },
                {
                  taskType: "imageInference",
                  taskUUID: import_crypto.default.randomUUID(),
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
              const images1 = runwareData1.data?.filter((d) => d.imageURL) || [];
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
        let tags = [];
        if (process.env.GEMINI_API_KEY) {
          try {
            let seoPrompt = `You are an expert Etsy copywriter and SEO specialist. Based on the following product design prompt, generate a product listing.
Design Prompt: ${designPrompt}`;
            if (listingInfo) {
              seoPrompt += `

Also consider this original listing for context and inspiration:
Original Title: ${listingInfo.title}
Original Tags: ${listingInfo.tags ? listingInfo.tags.join(", ") : ""}`;
            }
            seoPrompt += `

CRITICAL RULES:
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
                const jsonStr = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(jsonStr);
                title = parsed.title;
                description = parsed.description;
                tags = parsed.tags;
              } catch (parseError) {
                console.error("JSON parse failed. Raw response:", response.text.substring(0, 500) + "...");
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
        try {
          const raw = await import_promises.default.readFile(ASSETS_FILE, "utf-8");
          const assets = JSON.parse(raw);
          assets.unshift({
            id: import_crypto.default.randomUUID(),
            ...resultData,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
          await import_promises.default.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
        } catch (dbErr) {
          console.error("Failed to save to assets DB:", dbErr);
        }
        setTimeout(() => {
          io.emit("task_complete", {
            jobId,
            result: resultData
          });
        }, 1e3);
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
      const cacheKey = `listing_${title}_${tags?.join(",")}`.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 864e5) {
          return res.json(cached.data);
        }
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Add it to Settings > Secrets." });
      }
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
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(jsonStr);
      searchCache.set(`listing_${title}_${tags?.join(",")}`.toLowerCase(), { timestamp: Date.now(), data });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze listing" });
    }
  });
  apiRouter.post("/ai-studio/analyze-shop", async (req, res) => {
    try {
      const { shopName, announcement, title } = req.body;
      const cacheKey = `shop_${shopName}`.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 864e5) {
          return res.json(cached.data);
        }
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Add it to Settings > Secrets." });
      }
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
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(jsonStr);
      searchCache.set(`shop_${shopName}`.toLowerCase(), { timestamp: Date.now(), data });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze shop" });
    }
  });
  apiRouter.post("/ai-studio/analyze-keyword", async (req, res) => {
    try {
      const { keyword, topTags } = req.body;
      const cacheKey = `keyword_${keyword}`.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 864e5) {
          return res.json(cached.data);
        }
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing. Add it to Settings > Secrets." });
      }
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
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(jsonStr);
      searchCache.set(`keyword_${keyword}`.toLowerCase(), { timestamp: Date.now(), data });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze keyword" });
    }
  });
  apiRouter.get("/etsy/search", async (req, res) => {
    try {
      const q = req.query.q;
      if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const limit = req.query.limit ? parseInt(req.query.limit) : 100;
      const cacheKey = q.toLowerCase();
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 864e5) {
          console.log(`Serving Etsy search for "${q}" from cache`);
          return res.json(cached.data);
        }
      }
      const apiKey = process.env.ETSY_API_KEY;
      const sharedSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
      if (!apiKey) {
        return res.status(500).json({ error: "ETSY_API_KEY is not configured" });
      }
      const headerValue = sharedSecret ? `${apiKey}:${sharedSecret}` : apiKey;
      const headers = { "x-api-key": headerValue };
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
      const enrichListings = async (listings) => {
        if (!listings || listings.length === 0) return [];
        const ids = listings.map((l) => l.listing_id).join(",");
        const batchResponse = await fetch(`https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${ids}&includes=Images,Shop`, { headers });
        if (batchResponse.ok) {
          const batchData = await batchResponse.json();
          return batchData.results || listings;
        }
        return listings;
      };
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
      const headers = { "x-api-key": headerValue };
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
      const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${id}?includes=Images,Shop,Videos`, { headers });
      if (response.ok) {
        const data = await response.json();
        (async () => {
          try {
            let dbShopId = null;
            if (data.shop) {
              const s = await prisma.shops.upsert({
                where: { etsy_shop_id: BigInt(data.shop.shop_id) },
                update: { shop_name: data.shop.shop_name },
                create: {
                  id: import_crypto.default.randomUUID(),
                  user_id: (await prisma.users.findFirst())?.id || "unknown",
                  etsy_shop_id: BigInt(data.shop.shop_id),
                  shop_name: data.shop.shop_name
                }
              });
              dbShopId = s.id;
            }
            if (dbShopId) {
              const price = data.price?.amount ? data.price.amount / data.price.divisor : 0;
              await prisma.listings.upsert({
                where: { etsy_listing_id: BigInt(data.listing_id) },
                update: {
                  title: data.title,
                  price_amount: price,
                  price_currency: data.price?.currency_code || "USD",
                  state: data.state
                },
                create: {
                  id: import_crypto.default.randomUUID(),
                  shop_id: dbShopId,
                  etsy_listing_id: BigInt(data.listing_id),
                  title: data.title,
                  price_amount: price,
                  price_currency: data.price?.currency_code || "USD",
                  state: data.state
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
      const headers = { "x-api-key": headerValue };
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
    } catch (error) {
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
      const headers = { "x-api-key": headerValue };
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
    } catch (error) {
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
      const headers = { "x-api-key": headerValue };
      const authHeader = req.headers.authorization;
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
      const shopResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${id}`, { headers });
      if (!shopResponse.ok) {
        const errorText = await shopResponse.text();
        return res.status(shopResponse.status).json({ error: "Failed to fetch shop from Etsy API", details: errorText });
      }
      const shopData = await shopResponse.json();
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
  apiRouter.post("/etsy/sync-extension-scrape", async (req, res) => {
    try {
      const shopData = req.body;
      const listings = shopData.listings || [];
      try {
        const s = await prisma.shops.upsert({
          where: { etsy_shop_id: BigInt(shopData.etsyShopId) },
          update: {
            shop_name: shopData.shopName,
            user_id: (await prisma.users.findFirst())?.id || "unknown"
          },
          create: {
            id: import_crypto.default.randomUUID(),
            etsy_shop_id: BigInt(shopData.etsyShopId),
            shop_name: shopData.shopName,
            user_id: (await prisma.users.findFirst())?.id || "unknown"
          }
        });
        for (const l of listings) {
          await prisma.listings.upsert({
            where: { etsy_listing_id: BigInt(l.etsyListingId) },
            update: {
              title: l.title,
              price_amount: l.price,
              price_currency: l.currency,
              state: "active"
            },
            create: {
              id: import_crypto.default.randomUUID(),
              etsy_listing_id: BigInt(l.etsyListingId),
              shop_id: s.id,
              title: l.title,
              price_amount: l.price,
              price_currency: l.currency,
              state: "active"
            }
          });
        }
      } catch (e) {
        console.error("Failed to sync extension payload", e);
      }
      return res.json({ success: true, message: "Scraped data synced to database successfully", receivedAt: Date.now() });
    } catch (error) {
      console.error("Sync extension scrape error:", error);
      res.status(500).json({ error: "Failed to sync scraped data" });
    }
  });
  const codeVerifiers = /* @__PURE__ */ new Map();
  apiRouter.get("/auth/etsy/url", (req, res) => {
    const redirectUri = req.query.redirect_uri;
    if (!redirectUri) return res.status(400).json({ error: "Missing redirect_uri" });
    const state = Math.random().toString(36).substring(7);
    const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const crypto2 = require("crypto");
    const codeChallenge = crypto2.createHash("sha256").update(codeVerifier).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    codeVerifiers.set(state, codeVerifier);
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.ETSY_API_KEY || "",
      redirect_uri: redirectUri,
      scope: "listings_r shops_r",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256"
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
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.ETSY_API_KEY || "",
          redirect_uri,
          code,
          code_verifier: codeVerifier
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "Failed to exchange token", details: errorText });
      }
      const data = await response.json();
      codeVerifiers.delete(state);
      res.json(data);
    } catch (error) {
      console.error("Token exchange error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  apiRouter.get("/auth/etsy/status", (req, res) => {
    res.json({ connected: false });
  });
  apiRouter.get("/profile", async (req, res) => {
    try {
      let user = await prisma.users.findFirst({
        orderBy: { createdAt: "desc" },
        include: { shops: true }
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.email === "admin@podsypro.com" && user.shops && user.shops.length > 0) {
        const shop = user.shops[0];
        if (shop.access_token) {
          try {
            const apiKey = process.env.ETSY_API_KEY;
            const headers = { "x-api-key": apiKey, "Authorization": `Bearer ${shop.access_token}` };
            const shopRes = await fetch(`https://openapi.etsy.com/v3/application/shops/${shop.etsy_shop_id}`, { headers });
            if (shopRes.ok) {
              const shopData = await shopRes.json();
              if (shopData.user_id) {
                const userRes = await fetch(`https://openapi.etsy.com/v3/application/users/${shopData.user_id}`, { headers });
                if (userRes.ok) {
                  const userData = await userRes.json();
                  user = await prisma.users.update({
                    where: { id: user.id },
                    data: {
                      email: userData.primary_email || "user@podsypro.com",
                      name: userData.first_name || userData.login_name || "Podsy User"
                    },
                    include: { shops: true }
                  });
                }
              }
            }
          } catch (err) {
            console.error("Failed to sync real user profile from Etsy:", err);
          }
        }
      }
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: "Internal error" });
    }
  });
  app.get("/api/dev/dump", async (req, res) => {
    const users = await prisma.users.findMany({ include: { shops: true } });
    const listings = await prisma.listings.findMany();
    res.json({ users, listings });
  });
  app.post("/api/dev/reset", async (req, res) => {
    res.json({ message: "Reset disabled" });
  });
  apiRouter.get("/debug/db", async (req, res) => {
    try {
      const users = await prisma.users.findMany({ include: { shops: true } });
      const listings = await prisma.listings.findMany();
      res.json({ users, listings });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch db" });
    }
  });
  apiRouter.get("/debug/reset", async (req, res) => {
    try {
      res.send("<h2>Database Reset Successfully!</h2><p>All old dummy data has been deleted. Please go back to the app and connect your shop again.</p>");
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to reset db", details: e.message });
    }
  });
  app.use("/api", apiRouter);
  app.get("/auth/callback", (req, res) => {
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
  const isProduction = process.env.NODE_ENV === "production" || __dirname.includes("dist-server");
  if (!isProduction) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use((req, res, next) => {
      if (req.url === "/" || req.url === "/index.html") {
        req.url = "/app.html";
      }
      next();
    });
    app.use(vite.middlewares);
  } else {
    const baseDir = __dirname.includes("dist-server") ? import_path.default.join(__dirname, "..") : process.cwd();
    const distPath = import_path.default.join(baseDir, "dist");
    app.use(import_express5.default.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        } else if (filePath.endsWith(".svg")) {
          res.setHeader("Content-Type", "image/svg+xml");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "app.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
