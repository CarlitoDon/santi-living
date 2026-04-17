const fs = require('fs');
const path = require('path');

function wrapInLayer(filePath, layerName, isGlobals = false) {
  let content = fs.readFileSync(filePath, 'utf8');
  let imports = '';
  // Extract imports
  if (isGlobals) {
    const importMatch = content.match(/@import "tailwindcss";\n@source "\.\.\/";\n/);
    if (importMatch) {
      imports = importMatch[0];
      content = content.replace(imports, '');
    }
  }
  
  // Also properly capture the @theme block so it doesn't get nested inside a layer
  let themeBlock = '';
  if (isGlobals) {
    const themeMatch = content.match(/@theme\s*{[^}]*}/s);
    if (themeMatch) {
      themeBlock = themeMatch[0] + '\n';
      content = content.replace(themeMatch[0], '');
    }
  }

  // Wrap the rest in the specified layer
  const newContent = `${imports}${themeBlock}\n@layer ${layerName} {\n${content}\n}\n`;
  fs.writeFileSync(filePath, newContent, 'utf8');
}

wrapInLayer(path.join(__dirname, 'apps/web-next/src/styles/globals.css'), 'components', true);
wrapInLayer(path.join(__dirname, 'apps/web-next/src/styles/utilities.css'), 'utilities', false);
console.log("Fixed CSS layering");
