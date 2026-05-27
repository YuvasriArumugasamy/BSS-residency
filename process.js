const { execSync } = require('child_process');
const fs = require('fs');

function processFile(gitPath, outputPath) {
    let content = execSync(`git show main:${gitPath}`, { encoding: 'utf8' });
    content = content.replace(/BSS Residency/g, 'SM Golden Resorts');
    content = content.replace(/BSS RESIDENCY/g, 'SM GOLDEN RESORTS');
    content = content.replace(/bss residency/g, 'sm golden resorts');
    content = content.replace(/bssresidency\.com/g, 'smgoldenresorts.com');
    content = content.replace(/bss_residency/g, 'sm_golden_resorts');
    
    // Save to the proper path
    fs.writeFileSync(`frontend/src/pages/${outputPath}`, content, 'utf8');
    console.log(`Created ${outputPath}`);
}

processFile('frontend/src/pages/Gallery.js', 'Gallery.jsx');
processFile('frontend/src/pages/FAQ.js', 'FAQ.jsx');
processFile('frontend/src/pages/Gallery.css', 'Gallery.css');
processFile('frontend/src/pages/FAQ.css', 'FAQ.css');
