const fs = require('fs');
const file = 'app/add/manual/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the default assignments to read from searchParams
content = content.replace(
  "let defaultFirstName = '';",
  "let defaultFirstName = searchParams.get('fn') || '';"
).replace(
  "let defaultLastName = '';",
  "let defaultLastName = searchParams.get('ln') || '';"
).replace(
  "let defaultPhone = '';",
  "let defaultPhone = searchParams.get('phone') || '';"
).replace(
  "let defaultEmail = '';",
  "let defaultEmail = searchParams.get('email') || '';"
).replace(
  "let defaultCompany = '';",
  "let defaultCompany = searchParams.get('company') || '';"
).replace(
  "let defaultTitle = '';",
  "let defaultTitle = searchParams.get('title') || '';"
).replace(
  "let defaultWebsite = '';",
  "let defaultWebsite = searchParams.get('website') || '';"
);

// Fix the UI message to include OCR
content = content.replace(
  "{qr && (",
  "{(qr || searchParams.get('ocr')) && ("
).replace(
  "✓ Parsed details from QR code",
  "✓ Parsed details from scan"
);

fs.writeFileSync(file, content);
