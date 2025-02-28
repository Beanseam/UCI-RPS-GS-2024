import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export default function ThreeScene({ quaternion: parentQuaternion = { x: 0, y: 0, z: 0, w: 1 } }) {
  const [quaternion, setQuaternion] = useState(parentQuaternion); // ✅ Local state initialized with parent value

  // ✅ Sync parent quaternion with local state when it changes
  useEffect(() => {
    setQuaternion(parentQuaternion);
  }, [parentQuaternion]);

  useEffect(() => {
    const container = document.getElementById("three-container");
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(25, 25, 100);
    scene.background = new THREE.Color(0x1f2937);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 500);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // ✅ Add AxesHelper
    const axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);

    let model = null;

    const loader = new GLTFLoader();
    loader.load("/rocket.glb", (gltf) => {
      model = gltf.scene;
      model.scale.set(0.20, 0.20, 0.20);
      scene.add(model);

      // ✅ Apply initial rotation correction (90° on X-axis)
      const initialRotation = new THREE.Quaternion();
      initialRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      model.quaternion.copy(initialRotation);

      animate();
    });

    function animate() {
      requestAnimationFrame(animate);

      if (model) {
        const initialRotation = new THREE.Quaternion();
        initialRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

        const userQuaternion = new THREE.Quaternion(
          quaternion.x || 0,
          quaternion.y || 0,
          quaternion.z || 0,
          quaternion.w || 1
        );

        model.quaternion.copy(initialRotation).multiply(userQuaternion);
      }

      renderer.render(scene, camera);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      container.removeChild(renderer.domElement);
    };
  }, [quaternion]); // ✅ Ensures quaternion changes update the model

  return (
    <div>
      <div id="three-container" />

      {/* ✅ UI for users to change quaternion */}
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
        <p>X: {quaternion.x.toFixed(2)}</p>
        <p>Y: {quaternion.y.toFixed(2)}</p>
        <p>Z: {quaternion.z.toFixed(2)}</p>
        <p>W: {quaternion.w.toFixed(2)}</p>
      </div>
    </div>
  );
}
