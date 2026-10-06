const fs = require('fs');
const file = 'app/add/qr/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldButtons = `<div className="grid grid-cols-2 gap-3">
              <Button onClick={() => window.open(result, '_blank')} className="bg-blue-600 text-white hover:bg-blue-700 h-12 rounded-xl">
                Open Link
              </Button>
              <Button onClick={() => router.push(\`/add/manual?qr=\${encodeURIComponent(result)}\`)} className="bg-gray-900 text-white h-12 rounded-xl hover:bg-gray-800">
                Save Contact
              </Button>
            </div>`;

const newButtons = `<div className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  window.open(result, '_blank');
                  router.push(\`/add/manual?qr=\${encodeURIComponent(result)}\`);
                }} 
                className="bg-blue-600 text-white hover:bg-blue-700 h-12 rounded-xl w-full"
              >
                Open Link & Add Details
              </Button>
              <Button onClick={() => router.push(\`/add/manual?qr=\${encodeURIComponent(result)}\`)} variant="outline" className="h-12 rounded-xl w-full">
                Just Save Details
              </Button>
            </div>`;

content = content.replace(oldButtons, newButtons);
fs.writeFileSync(file, content);
