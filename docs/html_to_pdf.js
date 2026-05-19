const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const files = [
  'docs/Safoora_Presentation_Guide.html',
  'docs/Eman_Presentation_Guide.html',
  'docs/Areeba_Presentation_Guide.html'
];

// Use Edge (available on all Windows 11 machines) in headless mode to print PDF
files.forEach(file => {
  const absPath = path.resolve(file);
  const pdfPath = absPath.replace('.html', '.pdf');
  const fileUrl = `file:///${absPath.replace(/\\/g, '/')}`;
  
  console.log(`Converting: ${file}`);
  
  try {
    // Try Edge headless
    execSync(
      `"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-margins "${fileUrl}"`,
      { timeout: 30000, stdio: 'pipe' }
    );
    console.log(`  → Created: ${pdfPath}`);
  } catch(e1) {
    try {
      // Try Chrome headless
      execSync(
        `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-margins "${fileUrl}"`,
        { timeout: 30000, stdio: 'pipe' }
      );
      console.log(`  → Created: ${pdfPath}`);
    } catch(e2) {
      console.log(`  → Could not auto-convert. Open ${file} in browser and Ctrl+P to save.`);
    }
  }
});

console.log('\nDone!');
