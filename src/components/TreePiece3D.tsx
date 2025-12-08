import { useRef, useState, useEffect } from 'react';
import { Mesh } from 'three';
import { TreePiece } from '../utils/treeCalculations';
import { AngledWoodPiece } from './AngledWoodPiece';
import { getWoodTexture, getWoodNormalMap, generateTexturesAsync, PINE_COLORS } from '../utils/woodTexture';

interface TreePiece3DProps {
  piece: TreePiece;
  position: [number, number, number];
  rotation: number; // rotation in degrees
  onHover: (piece: TreePiece | null) => void;
}

export function TreePiece3D({ piece, position, rotation, onHover }: TreePiece3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);

  // Start generating textures asynchronously on mount
  useEffect(() => {
    generateTexturesAsync(() => {
      setTexturesReady(true);
    });
  }, []);

  // Get textures (will be null initially, then populated once ready)
  const woodTexture = texturesReady ? getWoodTexture() : null;
  const normalMap = texturesReady ? getWoodNormalMap() : null;

  const rotationRadians = (rotation * Math.PI) / 180;

  // Convert dimensions from mm to scene units (divide by 100 for better scale)
  const scaleLength = piece.length / 100;
  const scaleDepth = piece.depth / 100;
  const scaleHeight = piece.height / 100;

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, rotationRadians, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(piece);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
      }}
    >
      <AngledWoodPiece
        length={scaleLength}
        depth={scaleDepth}
        height={scaleHeight}
        cutAngle={piece.cutAngle}
      />
      <meshStandardMaterial
        color={hovered ? PINE_COLORS.hover : PINE_COLORS.base}
        map={woodTexture || undefined}
        normalMap={normalMap || undefined}
        normalScale={texturesReady ? [0.3, 0.3] : undefined}
        roughness={0.8}
        metalness={0.0}
      />
    </mesh>
  );
}
