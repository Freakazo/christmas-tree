import { useMemo } from 'react';
import * as THREE from 'three';

interface AngledWoodPieceProps {
  length: number;    // Length along X-axis (in scene units)
  depth: number;     // Depth along Z-axis (in scene units)
  height: number;    // Height along Y-axis (in scene units)
  cutAngle: number;  // Cut angle in degrees
}

/**
 * Creates a custom geometry for a wooden piece with angled cuts on both ends
 * The piece tapers from bottom to top due to the angled cuts
 * The bottom is at the full length, top is shorter by 2 * offset
 */
export function AngledWoodPiece({ length, depth, height, cutAngle }: AngledWoodPieceProps) {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    
    // Convert angle to radians
    const angleRad = (cutAngle * Math.PI) / 180;
    
    // Calculate how much to taper on each side
    // The offset is how much shorter the top is on EACH side
    // tan(angle) = height / offset
    const offset = height / Math.tan(angleRad);
    
    const halfDepth = depth / 2;
    const halfHeight = height / 2;
    
    // Define vertices for the angled piece
    // The piece is centered at origin, extends along X-axis (length)
    // Bottom face vertices (y = -halfHeight) - at full length
    const bottomHalfLength = length / 2;
    const v0 = new THREE.Vector3(-bottomHalfLength, -halfHeight, -halfDepth);
    const v1 = new THREE.Vector3(bottomHalfLength, -halfHeight, -halfDepth);
    const v2 = new THREE.Vector3(bottomHalfLength, -halfHeight, halfDepth);
    const v3 = new THREE.Vector3(-bottomHalfLength, -halfHeight, halfDepth);
    
    // Top face vertices (y = halfHeight) - shorter by offset on each side
    const topHalfLength = bottomHalfLength - offset;
    const v4 = new THREE.Vector3(-topHalfLength, halfHeight, -halfDepth);
    const v5 = new THREE.Vector3(topHalfLength, halfHeight, -halfDepth);
    const v6 = new THREE.Vector3(topHalfLength, halfHeight, halfDepth);
    const v7 = new THREE.Vector3(-topHalfLength, halfHeight, halfDepth);
    
    // Create vertices array
    const vertices = new Float32Array([
      // Bottom face (2 triangles)
      v0.x, v0.y, v0.z,
      v1.x, v1.y, v1.z,
      v2.x, v2.y, v2.z,
      
      v0.x, v0.y, v0.z,
      v2.x, v2.y, v2.z,
      v3.x, v3.y, v3.z,
      
      // Top face (2 triangles)
      v4.x, v4.y, v4.z,
      v6.x, v6.y, v6.z,
      v5.x, v5.y, v5.z,
      
      v4.x, v4.y, v4.z,
      v7.x, v7.y, v7.z,
      v6.x, v6.y, v6.z,
      
      // Front face (Z+) (2 triangles)
      v3.x, v3.y, v3.z,
      v2.x, v2.y, v2.z,
      v6.x, v6.y, v6.z,
      
      v3.x, v3.y, v3.z,
      v6.x, v6.y, v6.z,
      v7.x, v7.y, v7.z,
      
      // Back face (Z-) (2 triangles)
      v0.x, v0.y, v0.z,
      v5.x, v5.y, v5.z,
      v1.x, v1.y, v1.z,
      
      v0.x, v0.y, v0.z,
      v4.x, v4.y, v4.z,
      v5.x, v5.y, v5.z,
      
      // Right angled face (X+) (2 triangles)
      v1.x, v1.y, v1.z,
      v5.x, v5.y, v5.z,
      v6.x, v6.y, v6.z,
      
      v1.x, v1.y, v1.z,
      v6.x, v6.y, v6.z,
      v2.x, v2.y, v2.z,
      
      // Left angled face (X-) (2 triangles)
      v0.x, v0.y, v0.z,
      v3.x, v3.y, v3.z,
      v7.x, v7.y, v7.z,
      
      v0.x, v0.y, v0.z,
      v7.x, v7.y, v7.z,
      v4.x, v4.y, v4.z,
    ]);
    
    // Set vertices
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Create UV coordinates for texture mapping
    // Wood grain runs along the length (X-axis)
    const uvs = new Float32Array([
      // Bottom face (wood grain runs along length)
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
      
      // Top face (wood grain runs along length)
      0, 0,  1, 1,  1, 0,
      0, 0,  0, 1,  1, 1,
      
      // Front face (Z+) - wood grain vertical along piece
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
      
      // Back face (Z-) - wood grain vertical along piece
      0, 0,  1, 1,  1, 0,
      0, 0,  0, 1,  1, 1,
      
      // Right angled face (X+) - wood grain along height
      0, 0,  0, 1,  1, 1,
      0, 0,  1, 1,  1, 0,
      
      // Left angled face (X-) - wood grain along height
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1,
    ]);
    
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    
    // Compute normals for proper lighting
    geom.computeVertexNormals();
    
    return geom;
  }, [length, depth, height, cutAngle]);
  
  return <primitive object={geometry} />;
}
