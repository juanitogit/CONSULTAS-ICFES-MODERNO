const fs = require('fs');

const content = fs.readFileSync('C:/Users/juan8/.gemini/antigravity/brain/b46b3b9c-96b2-45e7-acd3-a7f2e5e55055/.system_generated/steps/734/content.md', 'utf8');

const regex = /.{0,100}datosReporteGeneral.{0,100}/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log('MATCH:', match[0]);
}

const regex2 = /.{0,100}resultadosbackend\.icfes\.gov\.co\/api\/resultados\/datosReporteGeneral.{0,100}/g;
let match2;
while ((match2 = regex2.exec(content)) !== null) {
  console.log('MATCH2:', match2[0]);
}

