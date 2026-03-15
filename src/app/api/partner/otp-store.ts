/**
 * In-memory OTP store for partner set-password flow.
 * Key: email (lowercase), Value: { code, expiresAt }
 */
const store = new Map<string, { code: string; expiresAt: number }>();

const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function setOtp(email: string, code: string): void {
  const key = email.trim().toLowerCase();
  store.set(key, {
    code,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function getOtp(email: string): { code: string; expiresAt: number } | null {
  const key = email.trim().toLowerCase();
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry;
}

export function consumeOtp(email: string, code: string): boolean {
  const key = email.trim().toLowerCase();
  const entry = store.get(key);
  if (!entry || entry.code !== code || Date.now() > entry.expiresAt) {
    return false;
  }
  store.delete(key);
  return true;
}
