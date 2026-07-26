/**
 * src/middleware/subscription.ts
 */

import { Request, Response, NextFunction } from "express";
import { SubscriptionTier } from "@prisma/client";
import { verifySession, PodsySessionPayload } from "../lib/session";

import { prisma } from "../../db";

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

  const user = await prisma.users.findUnique({
    where: { id: session.userId },
    include: { shops: true }
  });

  if (!user) {
    return res.status(401).json({
      error: "USER_NOT_FOUND",
      message: "Kullanıcı hesabı bulunamadı. Lütfen mağazanızı tekrar bağlayın.",
      redirectTo: "/connect-etsy",
    });
  }

  const shop = user.shops && user.shops.length > 0 ? user.shops[0] : null;
  if (!shop) {
    return res.status(401).json({
      error: "SHOP_NOT_FOUND",
      message: "Kullanıcıya bağlı aktif bir mağaza bulunamadı.",
      redirectTo: "/connect-etsy"
    });
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
