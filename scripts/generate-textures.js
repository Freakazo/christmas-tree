/**
 * Build script to pre-generate wood textures as PNG images
 * This runs during the build process to create static texture assets
 */

const { createCanvas } = require('canvas');
const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

// Output directory
const outputDir = join(__dirname, '..', 'public', 'textures');

// Ensure output directory exists
try {
  mkdirSync(outputDir, { recursive: true });
} catch (err) {
  // Directory might already exist
}

/**
 * Creates a procedural wood texture
 * Generates directly to pixel data for reliability
 */
function createWoodTexture() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  const size = 512;
  
  // Base pine color - light tan/beige (RGB values)
  const baseR = 212, baseG = 165, baseB = 116;
  const grainR = 184, grainG = 134, grainB = 95;
  const darkR = 158, darkG = 111, darkB = 74;
  
  // Create image data
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  // Fill with base color
  for (let i = 0; i < data.length; i += 4) {
    data[i] = baseR;
    data[i + 1] = baseG;
    data[i + 2] = baseB;
    data[i + 3] = 255; // Full opacity
  }
  
  // Add vertical grain lines
  const grainCount = 80;
  for (let i = 0; i < grainCount; i++) {
    const x = Math.floor((i / grainCount) * size);
    const waveAmplitude = 8 + Math.random() * 15;
    const waveFrequency = 0.015 + Math.random() * 0.025;
    const isDark = (i % 3 === 0);
    const grainIntensity = 0.3 + Math.random() * 0.4;
    
    for (let y = 0; y < size; y++) {
      const offsetX = Math.sin(y * waveFrequency) * waveAmplitude;
      const xPos = Math.floor(x + offsetX);
      
      if (xPos >= 0 && xPos < size) {
        const idx = (y * size + xPos) * 4;
        
        // Blend grain color
        const targetR = isDark ? darkR : grainR;
        const targetG = isDark ? darkG : grainG;
        const targetB = isDark ? darkB : grainB;
        
        data[idx] = Math.floor(data[idx] * (1 - grainIntensity) + targetR * grainIntensity);
        data[idx + 1] = Math.floor(data[idx + 1] * (1 - grainIntensity) + targetG * grainIntensity);
        data[idx + 2] = Math.floor(data[idx + 2] * (1 - grainIntensity) + targetB * grainIntensity);
      }
    }
  }
  
  // Add knots
  const knotCount = 6 + Math.floor(Math.random() * 4);
  for (let k = 0; k < knotCount; k++) {
    const knotX = Math.floor(Math.random() * size);
    const knotY = Math.floor(Math.random() * size);
    const radius = 15 + Math.random() * 20;
    
    for (let y = Math.max(0, knotY - radius); y < Math.min(size, knotY + radius); y++) {
      for (let x = Math.max(0, knotX - radius); x < Math.min(size, knotX + radius); x++) {
        const dist = Math.sqrt((x - knotX) ** 2 + (y - knotY) ** 2);
        if (dist < radius) {
          const idx = (y * size + x) * 4;
          const intensity = 1 - (dist / radius);
          const knotIntensity = intensity * 0.6;
          
          // Blend to darker color for knot
          data[idx] = Math.floor(data[idx] * (1 - knotIntensity) + darkR * knotIntensity);
          data[idx + 1] = Math.floor(data[idx + 1] * (1 - knotIntensity) + darkG * knotIntensity);
          data[idx + 2] = Math.floor(data[idx + 2] * (1 - knotIntensity) + darkB * knotIntensity);
        }
      }
    }
  }
  
  // Add noise
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Creates a normal map for wood to add depth
 */
function createWoodNormalMap() {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  const size = 512;
  
  // Create image data - neutral normal (RGB: 128, 128, 255)
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  
  // Fill with neutral normal
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128;     // R - X component
    data[i + 1] = 128; // G - Y component
    data[i + 2] = 255; // B - Z component (pointing up)
    data[i + 3] = 255; // A - full opacity
  }
  
  // Add vertical grain bumps
  const grainCount = 60;
  for (let i = 0; i < grainCount; i++) {
    const x = Math.floor((i / grainCount) * size);
    const waveAmplitude = 3 + Math.random() * 5;
    const waveFrequency = 0.015;
    
    for (let y = 0; y < size; y++) {
      const offsetX = Math.sin(y * waveFrequency) * waveAmplitude;
      const xPos = Math.floor(x + offsetX);
      
      if (xPos >= 0 && xPos < size) {
        const idx = (y * size + xPos) * 4;
        // Slight bump in the normal
        data[idx] = Math.min(255, data[idx] + 20);     // R - slight X shift
        data[idx + 2] = Math.max(200, data[idx + 2]);  // B - keep mostly pointing up
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Generate textures
console.log('Generating wood textures...');

const woodTexture = createWoodTexture();
const woodNormalMap = createWoodNormalMap();

// Save as PNG files
const woodTexturePath = join(outputDir, 'wood-texture.png');
const normalMapPath = join(outputDir, 'wood-normal.png');

writeFileSync(woodTexturePath, woodTexture.toBuffer('image/png'));
writeFileSync(normalMapPath, woodNormalMap.toBuffer('image/png'));

console.log('✓ Wood texture saved to:', woodTexturePath);
console.log('✓ Normal map saved to:', normalMapPath);
console.log('✓ Texture generation complete!');
