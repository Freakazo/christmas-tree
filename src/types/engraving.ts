/**
 * Engraving repeat configuration per face type
 */
export interface EngravingRepeat {
  top: number;       // Number of times to repeat on top face
  bottom: number;    // Number of times to repeat on bottom face
  front: number;     // Number of times to repeat on front face
  back: number;      // Number of times to repeat on back face
  left: number;      // Number of times to repeat on left face
  right: number;     // Number of times to repeat on right face
}

/**
 * Full engraving configuration
 */
export interface EngravingConfig {
  enabled: boolean;
  imageUrl: string;
  targets: {
    top: boolean;
    bottom: boolean;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
  };
  repeat: EngravingRepeat;
}

/**
 * Default engraving configuration
 */
export const DEFAULT_ENGRAVING_CONFIG: EngravingConfig = {
  enabled: false,
  imageUrl: '/christmas-tree/textures/engraving-default.svg',
  targets: {
    top: true,
    bottom: false,
    front: true,
    back: true,
    left: false,
    right: false,
  },
  repeat: {
    top: 1,
    bottom: 1,
    front: 1,
    back: 1,
    left: 1,
    right: 1,
  },
};
