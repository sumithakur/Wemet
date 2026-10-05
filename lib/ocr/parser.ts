export interface ParsedContact {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
}

export function parseBusinessCard(text: string): ParsedContact {
  const result: ParsedContact = {};
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.email = emailMatch[0];

  // Phone (simple heuristic)
  const phoneMatch = text.match(/(?:(?:(\+?\d{1,3}[- ]?)?\(?(\d{3})\)?[- ]?)?\d{3}[- ]?\d{4})/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // URL (exclude email domain)
  const urls = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
  if (urls) {
    for (const url of urls) {
      if (!url.includes('@') && !url.toLowerCase().includes('linkedin.com')) {
        result.website = url;
        break; // take first
      }
    }
  }

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) result.linkedin = linkedinMatch[0];

  // Simplistic fallback for name and title (needs refinement)
  if (lines.length > 0) {
    const possibleName = lines.find(l => l.length > 3 && l.length < 30 && !l.includes('@') && !l.includes('www.'));
    if (possibleName) {
      const parts = possibleName.split(' ');
      result.firstName = parts[0];
      if (parts.length > 1) {
        result.lastName = parts.slice(1).join(' ');
      }
    }
  }

  return result;
}
