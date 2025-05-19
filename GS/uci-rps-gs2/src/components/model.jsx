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
    const initialRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      Math.PI / 2
    );

    const finalQuaternion = new THREE.Quaternion()
      .copy(initialRotation)
      .multiply(quaternionRef.current);

    model.quaternion.copy(finalQuaternion);
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
      <Canvas style={{ width: '30vw', height: '40vh' }} camera={{ position: [25, 30, 100], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <axesHelper args={[50]} />
        <Rocket quaternion={quaternion} />
      </Canvas>
    </div>
  );
}
