/**
 * src/routes/admin-subscriptions.ts
 */

import { Router } from "express";
import { SubscriptionTier } from "@prisma/client";
import { requireAdminAuth } from "../middleware/admin-auth";

import { prisma } from "../../db";
const router = Router();

router.use(requireAdminAuth);

router.get("/pending", async (_req, res) => {
  const pending = await prisma.subscription_requests.findMany({
    where: { status: "PENDING" },
    include: {
      shops: {
        select: { id: true, shop_name: true, etsy_shop_id: true },
      },
    },
    orderBy: { requested_at: "asc" },
  });

  res.json({ requests: pending });
});

router.get("/shops/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  if (q.length < 2) {
    return res.status(400).json({ error: "QUERY_TOO_SHORT" });
  }

  const shops = await prisma.shops.findMany({
    where: { shop_name: { contains: q, mode: "insensitive" } },
    select: {
      id: true,
      shop_name: true,
      etsy_shop_id: true,
      subscription_tier: true,
      subscription_expires_at: true,
    },
    take: 20,
  });

  res.json({ shops });
});

interface ApproveBody {
  shopId: string;
  plan: SubscriptionTier;
  durationDays: number;
  source: string;
  adminNote?: string;
  subscriptionRequestId?: string;
}

router.post("/approve", async (req, res) => {
  const body = req.body as ApproveBody;

  if (!body.shopId || !body.plan || !body.durationDays) {
    return res.status(400).json({ error: "MISSING_FIELDS" });
  }

  const expiresAt = new Date(Date.now() + body.durationDays * 24 * 60 * 60 * 1000);

  const [updatedShop] = await prisma.$transaction([
    prisma.shops.update({
      where: { id: body.shopId },
      data: {
        subscription_tier: body.plan,
        subscription_expires_at: expiresAt,
        subscription_source: body.source,
      },
    }),
    ...(body.subscriptionRequestId
      ? [
          prisma.subscription_requests.update({
            where: { id: body.subscriptionRequestId },
            data: {
              status: "APPROVED",
              admin_note: body.adminNote,
              approved_by: req.podsyAdmin?.email,
              approved_at: new Date(),
            },
          }),
        ]
      : []),
  ]);

  res.json({ success: true, shop: updatedShop });
});

router.post("/reject", async (req, res) => {
  const { subscriptionRequestId, adminNote } = req.body as {
    subscriptionRequestId: string;
    adminNote?: string;
  };

  const updated = await prisma.subscription_requests.update({
    where: { id: subscriptionRequestId },
    data: {
      status: "REJECTED",
      admin_note: adminNote,
      approved_by: req.podsyAdmin?.email,
      approved_at: new Date(),
    },
  });

  res.json({ success: true, request: updated });
});

export default router;
