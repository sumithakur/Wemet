const fs = require('fs');
const file = 'app/contacts/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update imports
content = content.replace(
  "import { Button } from '@/components/ui/button';",
  "import { Button, buttonVariants } from '@/components/ui/button';"
);

// Replace button + nested <a> with just <a> using buttonVariants
content = content.replace(
  /<Button variant="outline" size="sm" className="rounded-full">\s*<a href=\{([^}]+)\}>([^<]+)<\/a>\s*<\/Button>/g,
  '<a href={$1} className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full" })}>$2</a>'
);

// Do the same for target="_blank" LinkedIn button
content = content.replace(
  /<Button variant="outline" size="sm" className="rounded-full">\s*<a href=\{([^}]+)\} target="_blank">([^<]+)<\/a>\s*<\/Button>/g,
  '<a href={$1} target="_blank" className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full" })}>$2</a>'
);

fs.writeFileSync(file, content);
