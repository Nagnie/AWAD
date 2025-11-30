/**
 * Email encoding utilities for base64url encoding
 */

/**
 * Encode string to base64url format compatible with Gmail API
 * @param data String to encode
 * @returns Base64url encoded string with padding preserved
 */
export function encodeBase64Url(data: string): string {
  // Convert to Buffer
  const buffer = Buffer.from(data, 'utf-8');

  // Encode to base64
  let base64 = buffer.toString('base64');

  // Convert to base64url (URL-safe) with padding
  // Gmail API may require padding, so we keep it
  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');

  return base64;
}

/**
 * Generate unique MIME boundary for multipart messages
 * @returns Unique boundary string
 */
export function generateBoundary(): string {
  return `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
