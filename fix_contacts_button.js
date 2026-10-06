const fs = require('fs');
const file = 'app/contacts/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { Button } from '@/components/ui/button';",
  "import { Button, buttonVariants } from '@/components/ui/button';"
);

content = content.replace(
  /<Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-9">\s*<Link href="\/add">\+ Add<\/Link>\s*<\/Button>/g,
  '<Link href="/add" className={buttonVariants({ size: "sm", className: "bg-blue-600 hover:bg-blue-700 h-9" })}>+ Add</Link>'
);

fs.writeFileSync(file, content);
