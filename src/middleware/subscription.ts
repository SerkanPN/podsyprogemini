/**
 * src/middleware/subscription.ts
 */

import { Request, Response, NextFunction } from "express";
import { PrismaClient, SubscriptionTier } from "@prisma/client";
import { verifySession, PodsySessionPayload } from "../lib/session";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      podsySession?: PodsySessionPayload;
      podsyShop?: {
        id: string;
        subscriptionTier: SubscriptionTier;
        subscriptionExpiresAt: Date | null;
      };
    }
  }
}

export async function requireEtsyShop(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.podsy_session;
  if (!token) {
    return res.status(401).json({
      error: "NO_SESSION",
      message: "Etsy mağazanızı bağlamanız gerekiyor.",
      redirectTo: "/connect-etsy",
    });
  }

  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({
      error: "INVALID_SESSION",
      redirectTo: "/connect-etsy",
    });
  }

  const shop = await prisma.shops.findUnique({
    where: { id: session.shopId },
    select: {
      id: true,
      subscription_tier: true,
      subscription_expires_at: true,
    },
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

export function requireActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const shop = req.podsyShop;
  if (!shop) {
    return res.status(500).json({ error: "MIDDLEWARE_ORDER_ERROR" });
  }

  if (shop.subscriptionTier === "NONE") {
    return res.status(402).json({
      error: "PAYMENT_REQUIRED",
      message: "Podsy'yi kullanmaya başlamak için ödeme talebinde bulunmalısınız.",
      redirectTo: "/payment-pending",
    });
  }

  const isExpired =
    shop.subscriptionExpiresAt !== null &&
    shop.subscriptionExpiresAt.getTime() < Date.now();

  if (isExpired) {
    return res.status(402).json({
      error: "SUBSCRIPTION_EXPIRED",
      message: "Aboneliğinizin süresi doldu. Yenilemek için sales@podsy.pro ile iletişime geçin.",
      redirectTo: "/payment-pending",
      expiredAt: shop.subscriptionExpiresAt,
    });
  }

  next();
}
