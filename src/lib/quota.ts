/**
 * src/lib/quota.ts
 *
 * Kota limitlerini kod içine hardcode ETMEYİN. "Free plan günde 1 rakip"
 * yerine "günde 2" yapmak istediğinizde kod deploy etmeniz gerekmesin —
 * bu yüzden limitler PlanLimit tablosundan okunuyor, shops.quotaOverrides
 * ile mağaza bazlı istisna da mümkün.
 */

import { PrismaClient, SubscriptionTier } from "@prisma/client";

const prisma = new PrismaClient();

export type QuotaKey =
  | "competitorTrackingLimit"
  | "listingAnalysisDailyLimit"
  | "cloneStudioMonthlyLimit";

interface QuotaCheckResult {
  allowed: boolean;
  limit: number; // -1 = sınırsız
  currentUsage: number;
}

/**
 * Belirli bir kota tipi için mağazanın limitini bulur.
 * Öncelik sırası: shops.quotaOverrides (mağazaya özel istisna) > PlanLimit tablosu (plana göre genel limit)
 */
async function resolveLimit(
  shopId: string,
  tier: SubscriptionTier,
  key: QuotaKey,
  quotaOverrides: Record<string, number> | null
): Promise<number> {
  if (quotaOverrides && typeof quotaOverrides[key] === "number") {
    return quotaOverrides[key];
  }

  const planLimit = await prisma.planLimit.findUnique({ where: { tier } });
  if (!planLimit) {
    // PlanLimit satırı eksikse güvenli tarafta kalın: erişimi kapatın, sessizce
    // "sınırsız" varsaymayın. Bu durumu Sentry'ye de loglamanız önerilir.
    return 0;
  }

  return (planLimit as any)[key]; // as any cast for now since schema isn't pulled yet
}

/**
 * Örnek kullanım noktası: kullanıcı "rakip mağaza ekle" işlemi yapmak istediğinde
 * bu ürün/özellik seviyesindeki kontrol middleware'den AYRI çağrılır — middleware
 * sadece "abonelik aktif mi" kontrol eder, bu fonksiyon ise "bu özellik için
 * kotan doldu mu" kontrol eder.
 */
export async function checkQuota(
  shopId: string,
  key: QuotaKey,
  countCurrentUsageFn: () => Promise<number>
): Promise<QuotaCheckResult> {
  const shop = await prisma.shop.findUniqueOrThrow({
    where: { id: shopId },
    select: { subscriptionTier: true, quotaOverrides: true },
  });

  const limit = await resolveLimit(
    shopId,
    shop.subscriptionTier as any,
    key,
    shop.quotaOverrides as Record<string, number> | null
  );

  if (limit === -1) {
    return { allowed: true, limit: -1, currentUsage: -1 };
  }

  const currentUsage = await countCurrentUsageFn();
  return { allowed: currentUsage < limit, limit, currentUsage };
}
