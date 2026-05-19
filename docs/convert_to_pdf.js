const fs = require('fs');
const { marked } = require('marked');
const path = require('path');

const files = [
  { input: 'docs/Safoora_Presentation_Guide.md', output: 'docs/Safoora_Presentation_Guide.html', name: 'Safoora', color: '#10B981' },
  { input: 'docs/Eman_Presentation_Guide.md', output: 'docs/Eman_Presentation_Guide.html', name: 'Eman', color: '#3B82F6' },
  { input: 'docs/Areeba_Presentation_Guide.md', output: 'docs/Areeba_Presentation_Guide.html', name: 'Areeba', color: '#8B5CF6' },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

@page {
  margin: 1.2cm 1.5cm;
  @bottom-center { content: counter(page); font-size: 10px; color: #737373; }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0a;
  color: #e5e5e5;
  line-height: 1.75;
  font-size: 14px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

h1 {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 2em 0 0.5em 0;
  color: #ffffff;
  border-bottom: 2px solid ACCENT_COLOR;
  padding-bottom: 12px;
}

h1:first-of-type { margin-top: 0; }

h2 {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  margin: 2em 0 0.6em 0;
  padding-left: 14px;
  border-left: 4px solid ACCENT_COLOR;
}

h3 {
  font-size: 17px;
  font-weight: 700;
  color: ACCENT_COLOR;
  margin: 1.8em 0 0.5em 0;
}

h4 { font-size: 15px; font-weight: 700; color: #ffffff; margin: 1.4em 0 0.4em 0; }

p { margin: 0.6em 0; color: #d4d4d4; }

strong { color: #ffffff; font-weight: 700; }

em { color: #a3a3a3; }

a { color: ACCENT_COLOR; text-decoration: none; }

hr {
  border: none;
  border-top: 1px solid #262626;
  margin: 2em 0;
}

ul, ol {
  padding-left: 1.6em;
  margin: 0.6em 0;
}

li { margin: 0.3em 0; color: #d4d4d4; }

blockquote {
  border-left: 4px solid ACCENT_COLOR;
  background: #141414;
  padding: 16px 20px;
  margin: 1em 0;
  border-radius: 0 12px 12px 0;
  color: #a3a3a3;
  font-style: italic;
}

blockquote strong { color: #ffffff; }

code {
  background: #1a1a1a;
  color: ACCENT_COLOR;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}

pre {
  background: #111111;
  border: 1px solid #262626;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  margin: 1em 0;
  font-size: 12px;
  line-height: 1.6;
}

pre code {
  background: transparent;
  padding: 0;
  color: #a3a3a3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 13px;
}

thead {
  background: #141414;
}

th {
  text-align: left;
  padding: 12px 14px;
  font-weight: 700;
  color: #ffffff;
  border-bottom: 2px solid ACCENT_COLOR;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 11px;
}

td {
  padding: 10px 14px;
  border-bottom: 1px solid #1a1a1a;
  color: #d4d4d4;
}

tr:hover td { background: #141414; }

.cover-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  text-align: center;
  page-break-after: always;
}

.cover-page h1 {
  font-size: 42px;
  border: none;
  background: linear-gradient(135deg, ACCENT_COLOR, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.cover-page .subtitle {
  font-size: 20px;
  color: #a3a3a3;
  font-weight: 400;
}

.cover-page .presenter {
  margin-top: 40px;
  padding: 16px 32px;
  background: #141414;
  border: 1px solid #262626;
  border-radius: 16px;
  font-size: 16px;
  color: ACCENT_COLOR;
  font-weight: 600;
}

.cover-page .logo {
  font-size: 80px;
  margin-bottom: 20px;
}

.footer-sig {
  text-align: right;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #262626;
  color: #525252;
  font-style: italic;
  font-size: 12px;
}
`;

files.forEach(file => {
  const md = fs.readFileSync(file.input, 'utf-8');
  const html = marked.parse(md);
  const styledCss = css.replace(/ACCENT_COLOR/g, file.color);

  const emojis = { 'Safoora': '🧠', 'Eman': '🗄️', 'Areeba': '🎨' };
  const titles = { 'Safoora': 'The AI Intelligence Engine', 'Eman': 'The Backend, Database & Security', 'Areeba': 'The Frontend, UI/UX & 3D Engine' };

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FaidaHai - ${file.name} Presentation Guide</title>
  <style>${styledCss}</style>
</head>
<body>
  <div class="cover-page">
    <div class="logo">${emojis[file.name]}</div>
    <h1>FaidaHai</h1>
    <p class="subtitle">${titles[file.name]}</p>
    <div class="presenter">Presenter: ${file.name}</div>
    <p style="margin-top: 60px; color: #525252; font-size: 13px;">Complete Study Guide &amp; Presentation Preparation</p>
    <p style="color: #525252; font-size: 12px;">Incubated at the Adan IT Center</p>
  </div>
  ${html}
</body>
</html>`;

  fs.writeFileSync(file.output, fullHtml, 'utf-8');
  console.log(`Created: ${file.output}`);
});

console.log('\\nDone! Open each HTML in Chrome and press Ctrl+P → Save as PDF');
console.log('Set Background Graphics = ON for the dark theme to print correctly.');
