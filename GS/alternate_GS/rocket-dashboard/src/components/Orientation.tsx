import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";

// Rocket model that accepts quaternion for rotation
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
      initialRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2); // Y/Z axis adjustment
      model.quaternion.copy(initialRotation).multiply(quaternionRef.current);
    }
  });

  if (!model) return null;

  return <primitive object={model} />;
}

const Orientation = ({ websocket }) => {
  const [quaternion, setQuaternion] = useState({ x: 0, y: 0, z: 0, w: 1 });

  useEffect(() => {
    if (!websocket) return;

    const handleData = (data) => {
      const sensorValues = data.split(",").map(parseFloat);

      if (sensorValues.length < 19) {
        console.error("Invalid data received:", data);
        return;
      }

      const q1 = sensorValues[15]; // w
      const q2 = sensorValues[16]; // x
      const q3 = sensorValues[17]; // y
      const q4 = sensorValues[18]; // z

      console.log("Quaternion Received:", q1, q2, q3, q4);

      setQuaternion({ x: q2, y: q3, z: q4, w: q1 });
    };

    websocket.addListener(handleData);

    return () => {
      websocket.removeListener(handleData); // clean up
    };
  }, [websocket]);

  return (
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 10], fov: 75 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
      <axesHelper args={[5]} />
      <Rocket quaternion={quaternion} />
    </Canvas>
  );
};

export default Orientation;