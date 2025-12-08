import * as THREE from 'three';

/**
 * Creates a procedural wood texture
 * Generates a simple wood grain pattern for pine-like appearance
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d')!;
  
  // Base pine color - light tan/beige
  const baseColor = '#d4a574';
  const grainColor = '#b8865f';
  const darkGrainColor = '#9e6f4a';
  
  // Fill base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  
  // Add wood grain lines (vertical) - more prominent
  const grainCount = 60;
  for (let i = 0; i < grainCount; i++) {
    const x = (i / grainCount) * size;
    const waveAmplitude = 8 + Math.random() * 15;
    const waveFrequency = 0.015 + Math.random() * 0.025;
    
    ctx.strokeStyle = i % 3 === 0 ? darkGrainColor : grainColor;
    ctx.lineWidth = 1 + Math.random() * 2.5;
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    
    ctx.beginPath();
    for (let y = 0; y < size; y++) {
      const offsetX = Math.sin(y * waveFrequency) * waveAmplitude;
      const xPos = x + offsetX;
      if (y === 0) {
        ctx.moveTo(xPos, y);
      } else {
        ctx.lineTo(xPos, y);
      }
    }
    ctx.stroke();
  }
  
  // Add some knots/imperfections - more visible
  ctx.globalAlpha = 0.6;
  const knotCount = 4 + Math.floor(Math.random() * 5);
  for (let i = 0; i < knotCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 15 + Math.random() * 25;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, darkGrainColor);
    gradient.addColorStop(0.5, grainColor);
    gradient.addColorStop(1, baseColor);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add noise for realism - more pronounced
  ctx.globalAlpha = 0.1;
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);  // More repetition for better detail visibility
  
  return texture;
}

/**
 * Creates a normal map for wood to add depth
 */
export function createWoodNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d')!;
  
  // Start with neutral normal (RGB: 128, 128, 255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, size, size);
  
  // Add vertical grain bumps
  const grainCount = 30;
  for (let i = 0; i < grainCount; i++) {
    const x = (i / grainCount) * size;
    const waveAmplitude = 3 + Math.random() * 5;
    const waveFrequency = 0.015;
    
    const gradient = ctx.createLinearGradient(x - 2, 0, x + 2, 0);
    gradient.addColorStop(0, '#8080ff');
    gradient.addColorStop(0.5, '#9090ff');
    gradient.addColorStop(1, '#8080ff');
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.3;
    
    for (let y = 0; y < size; y++) {
      const offsetX = Math.sin(y * waveFrequency) * waveAmplitude;
      ctx.fillRect(x + offsetX - 1, y, 2, 1);
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  
  return texture;
}

/**
 * Pine wood material colors
 */
export const PINE_COLORS = {
  base: '#d4a574',      // Light tan/beige - base pine color
  grain: '#b8865f',     // Medium brown - grain color
  dark: '#9e6f4a',      // Dark brown - dark grain
  highlight: '#e8c89a', // Light cream - highlights
  hover: '#10b981',     // Emerald green - hover state (kept for UI)
};
