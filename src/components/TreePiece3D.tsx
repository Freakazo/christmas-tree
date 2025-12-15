import { useRef, useState, useMemo, useEffect } from 'react';
import { Mesh, DoubleSide, MultiplyBlending, Texture } from 'three';
import { TreePiece } from '../utils/treeCalculations';
import { AngledWoodPiece } from './AngledWoodPiece';
import { getWoodTexture, getWoodNormalMap, PINE_COLORS, generateRandomEngravingTexture } from '../utils/woodTexture';
import { EngravingConfig } from '../types/engraving';

interface TreePiece3DProps {
  piece: TreePiece;
  position: [number, number, number];
  rotation: number; // rotation in degrees
  onHover: (piece: TreePiece | null) => void;
  texturesReady: boolean; // Passed from parent to ensure all pieces update together
  engravingConfig: EngravingConfig;
}

export function TreePiece3D({ piece, position, rotation, onHover, texturesReady, engravingConfig }: TreePiece3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [engravingTextures, setEngravingTextures] = useState<Map<string, Texture>>(new Map());

  // Get textures (memoized to ensure we get fresh references when ready)
  const woodTexture = useMemo(() => texturesReady ? getWoodTexture() : null, [texturesReady]);
  const normalMap = useMemo(() => texturesReady ? getWoodNormalMap() : null, [texturesReady]);

  // Clear engraving textures when config changes
  useEffect(() => {
    setEngravingTextures(new Map());
  }, [engravingConfig.enabled, engravingConfig.density, engravingConfig.itemSize]);

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

  // Generate engraving texture for a specific face
  const getEngravingTextureForFace = (
    faceType: string,
    faceWidth: number,
    faceHeight: number
  ): Texture | null => {
    const key = `${faceType}-${faceWidth}-${faceHeight}-${engravingConfig.density}-${engravingConfig.itemSize}`;
    
    if (engravingTextures.has(key)) {
      return engravingTextures.get(key)!;
    }

    // Generate texture asynchronously with higher resolution for sharper images
    // Use 200 pixels per scene unit for high quality
    const textureWidth = Math.max(1024, Math.min(4096, Math.floor(faceWidth * 200)));
    const textureHeight = Math.max(1024, Math.min(4096, Math.floor(faceHeight * 200)));
    
    generateRandomEngravingTexture(
      textureWidth,
      textureHeight,
      engravingConfig.density,
      engravingConfig.itemSize,
      (texture) => {
        setEngravingTextures(prev => new Map(prev).set(key, texture));
      },
      (error) => {
        console.error(`Failed to generate engraving for ${faceType}:`, error);
      }
    );

    return null; // Will be available after async generation
  };

  // Helper to create overlay mesh for a specific face
  const createEngravingOverlay = (
    faceType: 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right',
    facePosition: [number, number, number],
    faceRotation: [number, number, number],
    faceSize: [number, number]
  ) => {
    if (!engravingConfig.enabled || !engravingConfig.targets[faceType]) {
      return null;
    }

    const [faceWidth, faceHeight] = faceSize;
    const texture = getEngravingTextureForFace(faceType, faceWidth, faceHeight);
    
    if (!texture) {
      return null; // Texture not ready yet
    }

    return (
      <mesh
        key={`engraving-${faceType}`}
        position={facePosition}
        rotation={faceRotation}
      >
        <planeGeometry args={[faceWidth, faceHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          opacity={0.7}
          blending={MultiplyBlending}
          side={DoubleSide}
          polygonOffset={true}
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    );
  };

  const rotationRadians = (rotation * Math.PI) / 180;

  // Convert dimensions from mm to scene units (divide by 100 for better scale)
  const scaleLength = piece.length / 100;
  const scaleDepth = piece.depth / 100;
  const scaleHeight = piece.height / 100;

  // Calculate top length (shorter due to angled cuts)
  const angleRad = (piece.cutAngle * Math.PI) / 180;
  const offset = scaleHeight / Math.tan(angleRad);
  const topLength = scaleLength - 2 * offset;

  const halfDepth = scaleDepth / 2;
  const halfHeight = scaleHeight / 2;

  return (
    <group position={position} rotation={[0, rotationRadians, 0]}>
      {/* Main wood piece */}
      <mesh
        ref={meshRef}
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
          side={DoubleSide}
        />
      </mesh>

      {/* Engraving overlays */}
      {engravingConfig.enabled && (
        <>
          {/* Top face */}
          {createEngravingOverlay(
            'top',
            [0, halfHeight + 0.001, 0],
            [-Math.PI / 2, 0, 0],
            [topLength, scaleDepth]
          )}
          
          {/* Bottom face */}
          {createEngravingOverlay(
            'bottom',
            [0, -halfHeight - 0.001, 0],
            [Math.PI / 2, 0, 0],
            [scaleLength, scaleDepth]
          )}
          
          {/* Front face (Z+) */}
          {createEngravingOverlay(
            'front',
            [0, 0, halfDepth + 0.001],
            [0, 0, 0],
            [scaleLength, scaleHeight]
          )}
          
          {/* Back face (Z-) */}
          {createEngravingOverlay(
            'back',
            [0, 0, -halfDepth - 0.001],
            [0, Math.PI, 0],
            [scaleLength, scaleHeight]
          )}
          
          {/* Left face (X-) - angled */}
          {createEngravingOverlay(
            'left',
            [-(scaleLength / 2 + topLength / 2) / 2, 0, 0],
            [0, Math.PI / 2, 0],
            [scaleDepth, scaleHeight]
          )}
          
          {/* Right face (X+) - angled */}
          {createEngravingOverlay(
            'right',
            [(scaleLength / 2 + topLength / 2) / 2, 0, 0],
            [0, -Math.PI / 2, 0],
            [scaleDepth, scaleHeight]
          )}
        </>
      )}
    </group>
  );
}
