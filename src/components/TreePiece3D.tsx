import { useRef, useState, useMemo, useEffect } from 'react';
import { Mesh } from 'three';
import { TreePiece } from '../utils/treeCalculations';
import { AngledWoodPiece } from './AngledWoodPiece';
import { getWoodTexture, getWoodNormalMap, PINE_COLORS } from '../utils/woodTexture';

interface TreePiece3DProps {
  piece: TreePiece;
  position: [number, number, number];
  rotation: number; // rotation in degrees
  onHover: (piece: TreePiece | null) => void;
  texturesReady: boolean; // Passed from parent to ensure all pieces update together
}

export function TreePiece3D({ piece, position, rotation, onHover, texturesReady }: TreePiece3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Get textures (memoized to ensure we get fresh references when ready)
  const woodTexture = useMemo(() => texturesReady ? getWoodTexture() : null, [texturesReady]);
  const normalMap = useMemo(() => texturesReady ? getWoodNormalMap() : null, [texturesReady]);

  // Update material when textures become ready
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as any;
      if (texturesReady && woodTexture && normalMap) {
        material.map = woodTexture;
        material.normalMap = normalMap;
        material.normalScale.set(0.3, 0.3);
        // Use white color when textured so texture shows at full brightness
        // (color and map multiply together in Three.js)
        material.color.setHex(hovered ? 0x10b981 : 0xffffff);
        material.needsUpdate = true;
      }
    }
  }, [texturesReady, woodTexture, normalMap, hovered]);

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
        key={texturesReady ? 'textured' : 'solid'}
        color={texturesReady ? (hovered ? PINE_COLORS.hover : 0xffffff) : (hovered ? PINE_COLORS.hover : PINE_COLORS.base)}
        map={woodTexture || undefined}
        normalMap={normalMap || undefined}
        normalScale={texturesReady ? [0.3, 0.3] : undefined}
        roughness={0.8}
        metalness={0.0}
      />
    </mesh>
  );
}
