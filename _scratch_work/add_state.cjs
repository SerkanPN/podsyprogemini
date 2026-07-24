const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src', 'pages', 'ListingDetail.tsx');
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/tags\r?\n\s*\} = data;/m, 'tags,\n    state\n  } = data;');

fs.writeFileSync(file, c);
console.log('State added to ListingDetail.tsx safely via regex.');
