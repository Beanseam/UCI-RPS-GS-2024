import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export default function ThreeScene() {
  useEffect(() => {
    const container = document.getElementById("three-container");
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(25, 25, 100);

    scene.background = new THREE.Color(0x1f2937);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1000, 500);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load("/rocket.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.25, 0.25, 0.25);
      model.rotation.x = Math.PI / 2;
      const axesHelper = new THREE.AxesHelper(100);
      scene.add( axesHelper );
      scene.add(model);
      animate();
    });

    function animate() {
      requestAnimationFrame(animate);
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
  }, []);

  return <div id="three-container" />;
}
