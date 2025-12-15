/**
 * Full engraving configuration
 */
export interface EngravingConfig {
  enabled: boolean;
  targets: {
    top: boolean;
    bottom: boolean;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
  };
  density: number;   // Number of items per 10000 square units (1-20)
  itemSize: number;  // Base size of each item in pixels (20-100)
}

/**
 * Default engraving configuration
 */
export const DEFAULT_ENGRAVING_CONFIG: EngravingConfig = {
  enabled: false,
  targets: {
    top: true,
    bottom: false,
    front: false,
    back: false,
    left: false,
    right: false,
  },
  density: 8,        // Medium density
  itemSize: 40,      // Medium size items
};
