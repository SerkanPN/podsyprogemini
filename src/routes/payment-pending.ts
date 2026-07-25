/**
 * src/routes/payment-pending.ts
 */

import { Router } from "express";
import { PrismaClient, SubscriptionTier } from "@prisma/client";
import { requireEtsyShop } from "../middleware/subscription";

const prisma = new PrismaClient();
const router = Router();

router.use(requireEtsyShop);

router.get("/status", async (req, res) => {
  const shopId = req.podsyShop!.id;

  const latestRequest = await prisma.subscription_requests.findFirst({
    where: { shop_id: shopId },
    orderBy: { requested_at: "desc" },
  });

  res.json({
    subscriptionTier: req.podsyShop!.subscriptionTier,
    subscriptionExpiresAt: req.podsyShop!.subscriptionExpiresAt,
    latestRequest,
    paymentInstructions: {
      email: "sales@podsy.pro",
      note: "Ödeme açıklamasına veya mailinize lütfen Etsy mağaza adınızı yazın.",
    },
  });
});

router.post("/request", async (req, res) => {
  const shopId = req.podsyShop!.id;
  const { planRequested, amount, currency } = req.body as {
    planRequested: SubscriptionTier;
    amount?: number;
    currency?: string;
  };

  const session = req.podsySession!;
  const user = await prisma.users.findUniqueOrThrow({ where: { id: session.userId } });

  const request = await prisma.subscription_requests.create({
    data: {
      shop_id: shopId,
      user_email: user.email ?? "unknown",
      plan_requested: planRequested,
      amount,
      currency,
      status: "PENDING",
    },
  });

  res.status(201).json({ success: true, request });
});

export default router;
