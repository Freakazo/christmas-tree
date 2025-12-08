import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { TreePiece } from '../utils/treeCalculations';
import { AngledWoodPiece } from './AngledWoodPiece';

interface TreePiece3DProps {
  piece: TreePiece;
  position: [number, number, number];
  rotation: number; // rotation in degrees
  onHover: (piece: TreePiece | null) => void;
}

export function TreePiece3D({ piece, position, rotation, onHover }: TreePiece3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

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
        color={hovered ? '#10b981' : '#8b4513'}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}
