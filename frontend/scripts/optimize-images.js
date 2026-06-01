const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../src/assets');
const outputDir = path.join(__dirname, '../src/assets_optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const optimizeImages = async () => {
  try {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
      if (file.endsWith('.webp')) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        
        console.log(`Resizing ${file}...`);
        
        await sharp(inputPath)
          .resize(1200, 1200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 65, effort: 6 })
          .toFile(outputPath);
          
        console.log(`Optimized and resized ${file}`);
      }
    }
    console.log('Optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
};

optimizeImages();
