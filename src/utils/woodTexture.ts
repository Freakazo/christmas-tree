import * as THREE from 'three';

// Singleton texture instances - created once and reused
let woodTextureInstance: THREE.CanvasTexture | null = null;
let normalMapInstance: THREE.CanvasTexture | null = null;
let isGenerating = false;
let textureReadyCallbacks: (() => void)[] = [];

/**
 * Creates a procedural wood texture
 * Generates a simple wood grain pattern for pine-like appearance
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const size = 256;  // Reduced from 512 for faster generation
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
  
  // Add wood grain lines (vertical) - optimized for performance
  const grainCount = 40;  // Reduced for faster generation
  for (let i = 0; i < grainCount; i++) {
    const x = (i / grainCount) * size;
    const waveAmplitude = 8 + Math.random() * 15;
    const waveFrequency = 0.015 + Math.random() * 0.025;
    
    ctx.strokeStyle = i % 3 === 0 ? darkGrainColor : grainColor;
    ctx.lineWidth = 1 + Math.random() * 2.5;
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    
    ctx.beginPath();
    // Sample every 2 pixels for performance
    for (let y = 0; y < size; y += 2) {
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
  
  // Add some knots/imperfections - optimized
  ctx.globalAlpha = 0.6;
  const knotCount = 3 + Math.floor(Math.random() * 3);  // Fewer knots for performance
  for (let i = 0; i < knotCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 15 + Math.random() * 20;
    
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
  const size = 256;  // Reduced from 512 for faster generation
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

/**
 * Get or create the shared wood texture (singleton pattern)
 * This ensures we only generate the texture once, improving performance
 */
export function getWoodTexture(): THREE.CanvasTexture | null {
  return woodTextureInstance;
}

/**
 * Get or create the shared normal map (singleton pattern)
 * This ensures we only generate the normal map once, improving performance
 */
export function getWoodNormalMap(): THREE.CanvasTexture | null {
  return normalMapInstance;
}

/**
 * Check if textures are ready
 */
export function areTexturesReady(): boolean {
  return woodTextureInstance !== null && normalMapInstance !== null;
}

/**
 * Generate textures asynchronously in the background
 * This allows the UI to load immediately with solid colors
 */
export function generateTexturesAsync(onReady?: () => void): void {
  if (areTexturesReady()) {
    // Textures already exist
    if (onReady) onReady();
    return;
  }

  // Add callback to list
  if (onReady) {
    textureReadyCallbacks.push(onReady);
  }

  // If already generating, just wait for completion
  if (isGenerating) {
    return;
  }

  isGenerating = true;

  // Generate textures in next tick to not block rendering
  setTimeout(() => {
    try {
      woodTextureInstance = createWoodTexture();
      normalMapInstance = createWoodNormalMap();
      
      // Notify all waiting callbacks
      textureReadyCallbacks.forEach(callback => callback());
      textureReadyCallbacks = [];
    } finally {
      isGenerating = false;
    }
  }, 0);
}
