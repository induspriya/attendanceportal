const fs = require('fs');
const path = require('path');

// Read the built HTML file
const htmlPath = path.join(__dirname, 'client', 'build', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find the actual CSS and JS filenames from the static directory
const staticCssDir = path.join(__dirname, 'client', 'build', 'static', 'css');
const staticJsDir = path.join(__dirname, 'client', 'build', 'static', 'js');

let cssFile = '';
let jsFile = '';

// Get CSS filename
if (fs.existsSync(staticCssDir)) {
  const cssFiles = fs.readdirSync(staticCssDir).filter(file => file.endsWith('.css'));
  if (cssFiles.length > 0) {
    cssFile = cssFiles[0];
  }
}

// Get JS filename
if (fs.existsSync(staticJsDir)) {
  const jsFiles = fs.readdirSync(staticJsDir).filter(file => file.endsWith('.js'));
  if (jsFiles.length > 0) {
    jsFile = jsFiles[0];
  }
}

console.log('Found CSS file:', cssFile);
console.log('Found JS file:', jsFile);

// Keep the original static paths - don't modify them
console.log('✅ HTML paths kept as original static paths.');
console.log('Using default Vercel static file handling.');
