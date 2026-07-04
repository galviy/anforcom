let SECRET = Bun.env.SECRET_COOKIE!;


const KEY = await crypto.subtle.importKey(
  "raw",
  Buffer.from(SECRET.padEnd(32).slice(0, 32)),
  "AES-GCM",
  false,
  ["encrypt", "decrypt"]
)

function sign(value: string): string {
  return new Bun.CryptoHasher("sha256", SECRET)
    .update(value)
    .digest("base64url");
}

export function signCookie(value: string): string {
  return `s:${value}.${sign(value)}`;
}

export function unsignCookie(cookie: string): string | false {
  if (!cookie.startsWith("s:")) return false;

  const lastDot = cookie.lastIndexOf(".");
  if (lastDot === -1) return false;

  const value = cookie.slice(2, lastDot);
  const signature = cookie.slice(lastDot + 1);

  return signature === sign(value) ? value : false;
}
export async function encryptCookie(value: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    KEY,
    Buffer.from(value)
  )

  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.byteLength)
  return Buffer.from(combined).toString('base64url')
}

export async function decryptCookie(cookie: string): Promise<string | false> {
  try {
    const combined = Buffer.from(cookie, 'base64url')
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      KEY,
      encrypted
    )
    return Buffer.from(decrypted).toString()
  } catch {
    return false 
  }
}


export function parseCookie(cookie: string): Record<string, string> {
  return Object.fromEntries(
    cookie.split(';').map(c => c.trim().split('='))
  )
}