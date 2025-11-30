/**
 * Email parsing utilities for extracting and parsing email data
 */

/**
 * Parse email addresses from a header string
 * @param headerValue Email header value (e.g., "user@example.com, another@test.com")
 * @returns Array of extracted email addresses
 */
export function parseEmailAddresses(headerValue: string): string[] {
  if (!headerValue) return [];

  // Simple regex to extract emails
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const matches = headerValue.match(emailRegex);

  return matches || [];
}

/**
 * Remove duplicate email addresses while preserving order
 * @param emails Array of email addresses
 * @returns Array with duplicates removed
 */
export function removeDuplicateEmails(emails: string[]): string[] {
  return [...new Set(emails)];
}

/**
 * Filter and map attachments, ensuring only those with data are included
 * @param attachments Array of attachments with optional inlineData
 * @returns Array of attachments with only those containing data
 */
export function filterAttachmentsWithData(
  attachments: any[],
): Array<{ filename: string; mimeType: string; data: string }> {
  return attachments
    .filter((att) => att.inlineData) // Only include attachments with data
    .map((att) => ({
      filename: att.filename,
      mimeType: att.mimeType,
      data: att.inlineData,
    }));
}
