const fs = require('fs');
const content = fs.readFileSync('C:/Users/juan8/.gemini/antigravity/brain/b46b3b9c-96b2-45e7-acd3-a7f2e5e55055/.system_generated/steps/734/content.md', 'utf8');

// Find everything that concatenates with url_api
let match;
const regex = /url_api\s*\+\s*['"`](.*?)['"`]/g;
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}
