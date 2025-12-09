export interface StockDimensions {
  depth: number;    // mm (e.g., 125mm)
  height: number;   // mm (e.g., 75mm)
  length: number;   // mm (e.g., 2400mm)
}

export interface TreeDimensions {
  baseWidth: number;  // mm
  targetHeight: number; // mm
}

export interface TreePiece {
  layerNumber: number;  // 0 = bottom
  length: number;       // mm
  cutAngle: number;     // degrees
  depth: number;        // mm (from stock)
  height: number;       // mm (from stock)
}

export interface TreeCalculation {
  pieces: TreePiece[];
  numberOfLayers: number;           // usable layers after reserving the top
  totalLayers: number;              // includes the reserved star platform layer
  actualHeight: number;             // height after removing the star platform
  cutAngleDegrees: number;
  reservedTopPiece: TreePiece | null;
  warnings: string[];
  stockMaterialNeeded: {
    totalLinearMeters: number;
    usableLinearMeters: number;
    starPlatformLinearMeters: number;
    numberOfStockPieces: number;
  };
}

/**
 * Calculate the tree geometry and material requirements
 */
export function calculateTree(
  stock: StockDimensions,
  tree: TreeDimensions,
  manualAngleOverride?: number
): TreeCalculation {
  // Number of layers based on target height and layer thickness
  const totalLayers = Math.floor(tree.targetHeight / stock.height);
  const taperHeight = totalLayers * stock.height;

  const warnings: string[] = [];
  if (totalLayers < 2) {
    warnings.push(
      'Need at least two layers to leave a flat platform for the tree topper. Increase the target height or use thinner stock.'
    );
  }

  // Calculate the cut angle using the full taper height so the profile would come to a point
  let cutAngleDegrees: number;
  if (manualAngleOverride !== undefined) {
    cutAngleDegrees = manualAngleOverride;
  } else {
    if (taperHeight === 0 || tree.baseWidth === 0) {
      cutAngleDegrees = 0;
    } else {
      const cutAngleRadians = Math.atan((2 * taperHeight) / tree.baseWidth);
      cutAngleDegrees = (cutAngleRadians * 180) / Math.PI;
    }
  }

  // Calculate piece lengths for the full taper profile
  const allPieces: TreePiece[] = [];
  for (let i = 0; i < totalLayers; i++) {
    const layerHeight = taperHeight === 0 ? 0 : i * stock.height;
    const widthAtLayer = taperHeight === 0
      ? tree.baseWidth
      : tree.baseWidth * (1 - layerHeight / taperHeight);

    allPieces.push({
      layerNumber: i,
      length: widthAtLayer,
      cutAngle: cutAngleDegrees,
      depth: stock.depth,
      height: stock.height,
    });
  }

  // Reserve the top piece as a flat star platform and remove it from the visual stack
  const reservedTopPiece = allPieces.length > 0 ? allPieces[allPieces.length - 1] : null;
  const usablePieces = reservedTopPiece ? allPieces.slice(0, -1) : allPieces;

  const numberOfLayers = usablePieces.length;
  const actualHeight = numberOfLayers * stock.height;

  // Calculate material usage, ensuring the reserved top piece still counts toward stock
  const usableLinearLength = usablePieces.reduce((sum, piece) => sum + piece.length, 0);
  const starPlatformLength = reservedTopPiece?.length ?? 0;
  const totalLinearLength = usableLinearLength + starPlatformLength;

  const totalLinearMeters = totalLinearLength / 1000;
  const usableLinearMeters = usableLinearLength / 1000;
  const starPlatformLinearMeters = starPlatformLength / 1000;
  const numberOfStockPieces = totalLinearLength === 0 ? 0 : Math.ceil(totalLinearLength / stock.length);

  return {
    pieces: usablePieces,
    numberOfLayers,
    totalLayers,
    actualHeight,
    cutAngleDegrees,
    reservedTopPiece,
    warnings,
    stockMaterialNeeded: {
      totalLinearMeters,
      usableLinearMeters,
      starPlatformLinearMeters,
      numberOfStockPieces,
    },
  };
}

/**
 * Format a number to specified decimal places
 */
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}
