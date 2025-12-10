import * as THREE from 'three';

// Singleton texture instances - loaded once and reused
let woodTextureInstance: THREE.Texture | null = null;
let normalMapInstance: THREE.Texture | null = null;
let isLoading = false;
let textureReadyCallbacks: (() => void)[] = [];

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
 * Get the shared wood texture (singleton pattern)
 */
export function getWoodTexture(): THREE.Texture | null {
  return woodTextureInstance;
}

/**
 * Get the shared normal map (singleton pattern)
 */
export function getWoodNormalMap(): THREE.Texture | null {
  return normalMapInstance;
}

/**
 * Load an engraving texture from a URL
 * Uses caching to avoid loading the same texture multiple times
 */
export function loadEngravingTexture(
  url: string,
  onLoad: (texture: THREE.Texture) => void,
  onError?: (error: Error) => void
): void {
  const textureLoader = new THREE.TextureLoader();
  
  textureLoader.load(
    url,
    (texture) => {
      // Configure texture for engraving
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // Keep original aspect ratio - repeat will be set per-face
      texture.colorSpace = THREE.SRGBColorSpace;
      onLoad(texture);
    },
    undefined,
    (error) => {
      console.error('Failed to load engraving texture:', error);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Check if textures are ready
 */
export function areTexturesReady(): boolean {
  return woodTextureInstance !== null && normalMapInstance !== null;
}

/**
 * Load pre-generated textures from image files
 * This is much faster than generating them procedurally at runtime
 */
export function generateTexturesAsync(onReady?: () => void): void {
  if (areTexturesReady()) {
    // Textures already loaded
    if (onReady) onReady();
    return;
  }

  // Add callback to list
  if (onReady) {
    textureReadyCallbacks.push(onReady);
  }

  // If already loading, just wait for completion
  if (isLoading) {
    return;
  }

  isLoading = true;

  // Load textures from pre-generated images
  const textureLoader = new THREE.TextureLoader();
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  let loadedCount = 0;
  const totalTextures = 2;
  
  const checkComplete = () => {
    loadedCount++;
    if (loadedCount === totalTextures) {
      // Configure textures
      if (woodTextureInstance) {
        woodTextureInstance.wrapS = THREE.RepeatWrapping;
        woodTextureInstance.wrapT = THREE.RepeatWrapping;
        woodTextureInstance.repeat.set(2, 2); // Larger grain scale (half the tiles)
      }
      
      if (normalMapInstance) {
        normalMapInstance.wrapS = THREE.RepeatWrapping;
        normalMapInstance.wrapT = THREE.RepeatWrapping;
        normalMapInstance.repeat.set(1, 1);
      }
      
      // Notify all waiting callbacks
      textureReadyCallbacks.forEach(callback => callback());
      textureReadyCallbacks = [];
      isLoading = false;
    }
  };
  
  // Load wood texture
  textureLoader.load(
    `${baseUrl}textures/wood-texture.png`,
    (texture) => {
      // Set color space to sRGB for proper color rendering (Three.js r152+)
      texture.colorSpace = THREE.SRGBColorSpace;
      woodTextureInstance = texture;
      checkComplete();
    },
    undefined,
    (error) => {
      console.error('Failed to load wood texture:', error);
      isLoading = false;
    }
  );
  
  // Load normal map (normal maps should stay in linear space)
  textureLoader.load(
    `${baseUrl}textures/wood-normal.png`,
    (texture) => {
      normalMapInstance = texture;
      checkComplete();
    },
    undefined,
    (error) => {
      console.error('Failed to load normal map:', error);
      isLoading = false;
    }
  );
}
