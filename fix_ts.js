const fs = require('fs');
const file = 'app/add/card/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('tessedit_pageseg_mode: 11,', 'tessedit_pageseg_mode: 11 as any,');
fs.writeFileSync(file, content);
