// Imports
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { WebSocketService } from '../services/websocket.ts'; // Custom websocket
import * as THREE from 'three';

const DATA_POINTS = 20;

// const RocketModel = ({ quaternion }: { quaternion: THREE.Quaternion }) => {
//   const { scene } = useGLTF('../../public/Rocket.glb'); // Path to your model in public folder
//   const modelRef = useRef<THREE.Group>(null);

//   useFrame(() => {
//     if (modelRef.current) {
//       modelRef.current.setRotationFromQuaternion(quaternion);
//     }
//   });

//   return <primitive ref={modelRef} object={scene} scale={0.05} />;
// };
const RocketModel = ({ quaternion }: { quaternion: THREE.Quaternion }) => {
  const { scene } = useGLTF('../../public/Rocket.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      console.log(quaternion);
      quaternion.x *= 10;
      quaternion.y *= 10;
      quaternion.z *= 10;
      quaternion.normalize(); // Normalize the quaternion to avoid scaling issues
      //const currentQuaternion = modelRef.current.quaternion;
      //const deltaTime = state.clock.getDelta(); // Time between frames (in seconds)

    // Scale interpolation based on delta time for smooth and consistent speed
    //const speedFactor = 10;  // Adjust this for faster/slower rotation
    //currentQuaternion.slerp(currentQuaternion, deltaTime * speedFactor);

      modelRef.current.setRotationFromQuaternion(quaternion);
      
    }

    
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}> {/* Rotate parent once */}
      <primitive ref={modelRef} object={scene} scale={0.05} position={[0, -2, 5]} />
    </group>
  );
};

const Orientation3D = () => {
  const [quaternion, setQuaternion] = useState(new THREE.Quaternion());
  const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null);

  useEffect(() => {
    const wsService = new WebSocketService("ws://localhost:8765");
    setWebSocketService(wsService);
    wsService.connect();

    wsService.addListener((message) => {
      const values = message.split(",").map(Number);
      if (values.length === DATA_POINTS) {
        const qx = values[18]*10; //16
        const qy = values[16]*10; //17
        const qz = values[17]*10; //18
        const qw = values[15]; //15
        setQuaternion(new THREE.Quaternion(qx, qy, qz, qw));
      }
    });

    return () => wsService.close();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Rocket 3D Orientation</h2>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }} // Move camera down (Y = -2), and a bit back on Z
        style={{ height: 400 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <RocketModel quaternion={quaternion} />
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
};

export default Orientation3D;