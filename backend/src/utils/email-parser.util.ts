export function parseEmailAddresses(headerValue: string): string[] {
  if (!headerValue) return [];

  // Simple regex to extract emails
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const matches = headerValue.match(emailRegex);

  return matches || [];
}

export function removeDuplicateEmails(emails: string[]): string[] {
  return [...new Set(emails)];
}

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
