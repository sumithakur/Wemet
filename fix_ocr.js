const fs = require('fs');
const file = 'app/add/card/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "setProgress('Analyzing business card...');",
  `await worker.setParameters({
        tessedit_pageseg_mode: 11, // Sparse text mode (find as much text as possible in no particular order)
      });
      
      setProgress('Analyzing business card...');`
);

fs.writeFileSync(file, content);
