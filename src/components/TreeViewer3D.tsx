import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { TreePiece3D } from './TreePiece3D';
import { TreeCalculation, TreePiece } from '../utils/treeCalculations';
import { generateTexturesAsync } from '../utils/woodTexture';

interface TreeViewer3DProps {
  calculation: TreeCalculation | null;
  rotationAngle: number; // degrees of rotation between pieces
  viewMode: 'flat' | 'rotated';
}

export function TreeViewer3D({ calculation, rotationAngle, viewMode }: TreeViewer3DProps) {
  const [hoveredPiece, setHoveredPiece] = useState<TreePiece | null>(null);
  const [texturesReady, setTexturesReady] = useState(false);
  const controlsRef = useRef<any>(null);

  // Start loading textures immediately when component mounts
  useEffect(() => {
    generateTexturesAsync(() => {
      setTexturesReady(true);
    });
  }, []);

  // Calculate the midpoint height of the tree in scene units
  const treeHeightSceneUnits = calculation ? (calculation.actualHeight / 100) : 0;
  const midHeight = treeHeightSceneUnits / 2;

  // Update camera target when calculation changes
  useEffect(() => {
    if (controlsRef.current && calculation) {
      controlsRef.current.target.set(0, midHeight, 0);
      controlsRef.current.update();
    }
  }, [calculation, midHeight]);

  if (!calculation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Enter dimensions to see your tree</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [15, midHeight + 5, 15], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Tree pieces */}
        {calculation.pieces.map((piece, index) => {
          // Add 1% gap between layers for better visibility
          const gapPerLayer = (piece.height * 0.01) / 100; // 1% of height in scene units
          const yPosition = (index * piece.height) / 100 + (index * gapPerLayer); // Convert to scene units with gap
          const rotation = viewMode === 'rotated' ? index * rotationAngle : 0;
          
          return (
            <TreePiece3D
              key={index}
              piece={piece}
              position={[0, yPosition, 0]}
              rotation={rotation}
              onHover={setHoveredPiece}
              texturesReady={texturesReady}
            />
          );
        })}

        {/* Grid for reference */}
        <Grid
          args={[20, 20]}
          position={[0, -0.01, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#4b5563"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />

        <OrbitControls 
          ref={controlsRef}
          target={[0, midHeight, 0]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>

      {/* Hover tooltip */}
      {hoveredPiece && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-800">Layer {hoveredPiece.layerNumber + 1}</p>
          <p className="text-gray-600">Length: {hoveredPiece.length.toFixed(1)} mm</p>
          <p className="text-gray-600">Width: {hoveredPiece.depth.toFixed(1)} mm</p>
          <p className="text-gray-600">Height: {hoveredPiece.height.toFixed(1)} mm</p>
          <p className="text-gray-600">Cut Angle: {hoveredPiece.cutAngle.toFixed(2)}°</p>
        </div>
      )}
    </div>
  );
}
