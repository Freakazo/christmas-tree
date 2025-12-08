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
  numberOfLayers: number;
  actualHeight: number;
  cutAngleDegrees: number;
  stockMaterialNeeded: {
    totalLinearMeters: number;
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
  const numberOfLayers = Math.floor(tree.targetHeight / stock.height);
  const actualHeight = numberOfLayers * stock.height;

  // Calculate the cut angle
  // The tree forms a triangle from center to edge
  // From center to edge is baseWidth/2
  // tan(angle) = height / (baseWidth/2) = 2 * height / baseWidth
  let cutAngleDegrees: number;
  
  if (manualAngleOverride !== undefined) {
    // Use manual override if provided
    cutAngleDegrees = manualAngleOverride;
  } else {
    // Calculate automatically
    const cutAngleRadians = Math.atan((2 * actualHeight) / tree.baseWidth);
    cutAngleDegrees = (cutAngleRadians * 180) / Math.PI;
  }

  // Calculate piece lengths
  // Each piece gets progressively shorter as we go up
  const pieces: TreePiece[] = [];
  
  for (let i = 0; i < numberOfLayers; i++) {
    // Height at this layer
    const layerHeight = i * stock.height;
    
    // Width at this layer (linear taper)
    const widthAtLayer = tree.baseWidth * (1 - layerHeight / actualHeight);
    
    pieces.push({
      layerNumber: i,
      length: widthAtLayer,
      cutAngle: cutAngleDegrees,
      depth: stock.depth,
      height: stock.height,
    });
  }

  // Calculate total material needed
  const totalLinearLength = pieces.reduce((sum, piece) => sum + piece.length, 0);
  const totalLinearMeters = totalLinearLength / 1000;
  const numberOfStockPieces = Math.ceil(totalLinearLength / stock.length);

  return {
    pieces,
    numberOfLayers,
    actualHeight,
    cutAngleDegrees,
    stockMaterialNeeded: {
      totalLinearMeters,
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
