const fs = require('fs');

let c = fs.readFileSync('server.ts', 'utf8');
const start = c.indexOf('apiRouter.post("/ai-studio/generate"');
const end = c.indexOf('apiRouter.get("/etsy/search"');

if (start > -1 && end > -1) {
  c = c.substring(0, start) + c.substring(end);
  fs.writeFileSync('server.ts', c);
  console.log('Removed AI Studio endpoints successfully');
} else {
  console.log('Endpoints not found', {start, end});
}
