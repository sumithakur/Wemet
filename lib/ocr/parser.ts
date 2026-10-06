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

const JOB_TITLES = ['ceo', 'cto', 'cfo', 'coo', 'manager', 'director', 'engineer', 'developer', 'designer', 'founder', 'president', 'vp', 'vice president', 'head', 'lead', 'consultant', 'specialist', 'executive', 'officer', 'partner', 'associate', 'architect'];

export function parseBusinessCard(text: string): ParsedContact {
  const result: ParsedContact = {};
  
  // Clean text and split into lines
  const lines = text
    .split('\n')
    .map(l => l.trim().replace(/[^a-zA-Z0-9@.\-+\s:()]/g, '')) // Remove weird OCR artifacts but keep common symbols
    .filter(l => l.length > 2);

  // 1. Email extraction (most reliable)
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  for (const line of lines) {
    const match = line.match(emailRegex);
    if (match) {
      result.email = match[1].toLowerCase();
      break;
    }
  }

  // 2. Phone extraction
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  for (const line of lines) {
    const match = line.match(phoneRegex);
    if (match) {
      result.phone = match[0].replace(/[^\d+]/g, ''); // Clean to just numbers and +
      break;
    }
  }

  // 3. Website / URL extraction
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)/i;
  for (const line of lines) {
    if (line.toLowerCase().includes('linkedin')) {
      result.linkedin = line;
      continue;
    }
    const match = line.match(urlRegex);
    if (match && !line.includes('@')) {
      result.website = match[1].toLowerCase();
    }
  }

  // 4. Identify Job Title
  let titleIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    if (JOB_TITLES.some(title => lowerLine.includes(title))) {
      result.jobTitle = lines[i];
      titleIndex = i;
      break;
    }
  }

  // 5. Name extraction (Heuristics)
  // The name is usually one of the first 3 lines, has 2-3 words, capitalized, and is NOT an email, phone, or title.
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    const line = lines[i];
    if (i === titleIndex) continue;
    if (line.includes('@') || line.match(phoneRegex) || line.toLowerCase().includes('www')) continue;
    
    const words = line.split(' ');
    // Most names are 2-3 words. If a word is all lowercase, it might be a bad OCR or website.
    if (words.length >= 1 && words.length <= 4) {
      // It's likely a name
      result.firstName = words[0];
      if (words.length > 1) {
        result.lastName = words.slice(1).join(' ');
      }
      break; // Found the name
    }
  }

  // 6. Company extraction
  // Often near the top or near the website/email domain
  if (result.email) {
    const domain = result.email.split('@')[1].split('.')[0];
    if (domain !== 'gmail' && domain !== 'yahoo' && domain !== 'hotmail' && domain !== 'outlook') {
      // Capitalize first letter of domain
      result.company = domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  return result;
}
