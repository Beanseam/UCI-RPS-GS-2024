import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
// IMPORTANTTTTTTTTTTT
//after testing, z and y axis swapped due to initial positioning
//Y axis(actual y axis not reversed) may be negative


function Rocket({ quaternion }) {
  const modelRef = useRef();
  const quaternionRef = useRef(new THREE.Quaternion());
  const [model, setModel] = useState(null);

  useEffect(() => {
    quaternionRef.current.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }, [quaternion]);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/rocket.glb", (gltf) => {
      if (gltf.scene) {
        setModel(gltf.scene);
        gltf.scene.scale.set(0.2, 0.2, 0.15);
      }
    });
  }, []);

  useFrame(() => {
    if (model) {
      const initialRotation = new THREE.Quaternion();
      initialRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      model.quaternion.copy(initialRotation).multiply(quaternionRef.current);
    }
  });

  if (!model) return null;

  return <primitive object={model} />;
}

export default function ThreeScene({ quaternion: parentQuaternion = { x: 0, y: 0, z: 0, w: 1 } }) {
  const [quaternion, setQuaternion] = useState(parentQuaternion);

  useEffect(() => {
    setQuaternion(parentQuaternion);
  }, [parentQuaternion]);

  return (
    <div>
      <Canvas style={{ width: '50vw', height: '50vh' }} camera={{ position: [25, 30, 100], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <axesHelper args={[50]} />
        <Rocket quaternion={quaternion} />
      </Canvas>
      
      <div className="controls">
        <h3>Update Quaternion Values:</h3>
        <label>
          X: <input type="number" step="0.01" value={quaternion.x} 
            onChange={(e) => setQuaternion(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))} />
        </label>
        <label>
          Y: <input type="number" step="0.01" value={quaternion.y} 
            onChange={(e) => setQuaternion(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))} />
        </label>
        <label>
          Z: <input type="number" step="0.01" value={quaternion.z} 
            onChange={(e) => setQuaternion(prev => ({ ...prev, z: parseFloat(e.target.value) || 0 }))} />
        </label>
        <label>
          W: <input type="number" step="0.01" value={quaternion.w} 
            onChange={(e) => setQuaternion(prev => ({ ...prev, w: parseFloat(e.target.value) || 1 }))} />
        </label>
      </div>

      {/* Display quaternion values */}
      <div className="quaternion-display">
        <h3>Current Quaternion Values:</h3>
        <p>X: {quaternion.x.toFixed(4)}</p>
        <p>Y: {quaternion.y.toFixed(4)}</p>
        <p>Z: {quaternion.z.toFixed(4)}</p>
        <p>W: {quaternion.w.toFixed(4)}</p>
      </div>
    </div>
  );
}
