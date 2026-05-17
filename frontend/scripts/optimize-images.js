const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../src/assets');
const outputDir = path.join(__dirname, '../src/assets'); // Override in place or create new webp files

const optimizeImages = async () => {
  try {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const inputPath = path.join(inputDir, file);
        const parsedPath = path.parse(file);
        const outputPath = path.join(outputDir, `${parsedPath.name}.webp`);
        
        console.log(`Processing ${file}...`);
        
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
          
        console.log(`Optimized ${file} to ${parsedPath.name}.webp`);
        
        // Optionally, delete the old file if we are confident
        // fs.unlinkSync(inputPath); 
      }
    }
    console.log('Optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
};

optimizeImages();
