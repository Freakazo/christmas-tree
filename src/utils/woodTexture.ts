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

// List of available Christmas item SVGs
const CHRISTMAS_ITEMS = [
  'snowman.svg',
  'tree.svg',
  'star.svg',
  'gift.svg',
  'candy-cane.svg',
  'bell.svg',
  'reindeer.svg',
  'snowflake.svg',
];

// Helper interface for placed items
interface PlacedItem {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

/**
 * Check if two rectangles (considering rotation) would overlap
 * Uses a simple bounding box check with padding
 */
function wouldOverlap(
  item1: PlacedItem,
  item2: PlacedItem,
  padding: number = 5
): boolean {
  // Calculate bounding boxes with rotation (use diagonal for simplicity)
  const diagonal1 = Math.sqrt(item1.width * item1.width + item1.height * item1.height) / 2;
  const diagonal2 = Math.sqrt(item2.width * item2.width + item2.height * item2.height) / 2;
  
  // Calculate center points
  const cx1 = item1.x + item1.width / 2;
  const cy1 = item1.y + item1.height / 2;
  const cx2 = item2.x + item2.width / 2;
  const cy2 = item2.y + item2.height / 2;
  
  // Distance between centers
  const dx = cx1 - cx2;
  const dy = cy1 - cy2;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Check if distance is less than sum of diagonals (with padding)
  return distance < (diagonal1 + diagonal2 + padding);
}

/**
 * Generate a random engraving texture with multiple small Christmas items
 * randomly placed on a canvas without overlapping
 */
export function generateRandomEngravingTexture(
  width: number,
  height: number,
  density: number = 5,
  itemSize: number = 50,
  onLoad: (texture: THREE.Texture) => void,
  onError?: (error: Error) => void
): void {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const itemPromises = CHRISTMAS_ITEMS.map(item => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `${baseUrl}textures/engravings/${item}`;
    });
  });

  Promise.all(itemPromises)
    .then(images => {
      // Create canvas with high quality settings
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { 
        alpha: true,
        willReadFrequently: false,
      });
      
      if (!ctx) {
        if (onError) onError(new Error('Failed to get canvas context'));
        return;
      }

      // Enable high quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear canvas (transparent)
      ctx.clearRect(0, 0, width, height);

      // Calculate number of items based on density and area
      const area = width * height;
      const numItems = Math.floor((area / 10000) * density);

      // Track placed items to prevent overlaps
      const placedItems: PlacedItem[] = [];

      // Try to place items (with max attempts to avoid infinite loop)
      const maxAttempts = numItems * 50;
      let attempts = 0;
      let placed = 0;

      while (placed < numItems && attempts < maxAttempts) {
        attempts++;

        const img = images[Math.floor(Math.random() * images.length)];
        const sizeVariation = 0.7 + Math.random() * 0.6; // 70-130%
        
        // Preserve aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = itemSize * sizeVariation;
        let drawHeight = itemSize * sizeVariation;
        
        if (aspectRatio > 1) {
          // Wider than tall
          drawHeight = drawWidth / aspectRatio;
        } else {
          // Taller than wide
          drawWidth = drawHeight * aspectRatio;
        }
        
        const x = Math.random() * (width - drawWidth);
        const y = Math.random() * (height - drawHeight);
        const rotation = Math.random() * Math.PI * 2; // Random rotation

        const newItem: PlacedItem = {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
          rotation,
        };

        // Check for overlaps with existing items
        let overlaps = false;
        for (const existing of placedItems) {
          if (wouldOverlap(newItem, existing)) {
            overlaps = true;
            break;
          }
        }

        // If no overlap, place the item
        if (!overlaps) {
          ctx.save();
          ctx.translate(x + drawWidth / 2, y + drawHeight / 2);
          ctx.rotate(rotation);
          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          ctx.restore();

          placedItems.push(newItem);
          placed++;
        }
      }

      // Create texture from canvas with high quality settings
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      
      // Use linear filtering for sharper images when zooming in
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      // Generate mipmaps for better quality at different distances
      texture.generateMipmaps = true;
      
      // Increase anisotropy for sharper textures at oblique angles
      texture.anisotropy = 16;
      
      texture.needsUpdate = true;
      
      onLoad(texture);
    })
    .catch(error => {
      console.error('Failed to load Christmas item images:', error);
      if (onError) onError(error as Error);
    });
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
