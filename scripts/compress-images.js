/**
 * Image Compression Script
 * 
 * To run this script, you will need to install the `sharp` image processing library:
 *   npm install -D sharp
 * 
 * Then run:
 *   node scripts/compress-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Attempt to require sharp, prompt installation if missing
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error("The 'sharp' library is required for compression.");
  console.log("Please run: npm install -D sharp");
  process.exit(1);
}

const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images-webp');

async function convertToWebP() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

  if (jpgFiles.length === 0) {
    console.log("No JPG files found to compress.");
    return;
  }

  console.log(`Found ${jpgFiles.length} frames to compress. This may take a moment...`);

  let processed = 0;
  for (const file of jpgFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);

    try {
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 }) // Adjust quality as needed
        .toFile(outputPath);
      
      processed++;
      if (processed % 24 === 0 || processed === jpgFiles.length) {
        console.log(`Progress: ${processed}/${jpgFiles.length}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  console.log("Compression complete! Your frames are now in /public/images-webp.");
  console.log("To use them, update your components' config to point to the new folder and change frameExtension to 'webp'.");
}

convertToWebP();
