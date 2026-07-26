import jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.PODSY_SESSION_SECRET || "default-podsy-secret-key-for-dev";
if (!process.env.PODSY_SESSION_SECRET) {
  console.warn("WARNING: PODSY_SESSION_SECRET is not defined in .env. Using fallback secret.");
}

const SESSION_TTL = "30d"; // Kullanıcı ne sıklıkla tekrar login olmalı, ihtiyaca göre ayarlayın

export interface PodsySessionPayload {
  userId: string; // users.id (Etsy user_id değil, kendi iç ID'niz)
  shopId: string; // shops.id
  etsyUserId: string;
}

/**
 * Etsy OAuth akışı tamamlandıktan (users + shops kaydı oluşturulduktan) sonra çağrılır.
 */
export function issueSession(payload: PodsySessionPayload): string {
  return jwt.sign(payload, SESSION_SECRET!, { expiresIn: SESSION_TTL });
}

/**
 * Middleware içinde her istekte cookie/header'dan gelen token'ı doğrulamak için.
 * Geçersiz/süresi dolmuş token'da null döner — çağıran taraf 401'e çevirir.
 */
export function verifySession(token: string): PodsySessionPayload | null {
  try {
    return jwt.verify(token, SESSION_SECRET!) as PodsySessionPayload;
  } catch {
    return null;
  }
}

/**
 * Etsy refresh_token süresi dolduğunda (Etsy tarafı işlemleri, örn. My Shop senkronu,
 * artık çalışmaz) Podsy session'ı GEÇERLİ KALMALI — kullanıcı "hesabımı kaybettim"
 * hissine kapılmamalı. Bunun yerine ayrı bir bayrak tutun:
 *
 *   shops.etsyConnectionStatus: "CONNECTED" | "NEEDS_REAUTH"
 *
 * ve middleware'de bunu ayrı kontrol edin (bkz. src/middleware/subscription.ts,
 * yorum satırındaki not).
 */
