import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Orientation = ({ websocket }) => {
    const canvasRef = useRef(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [rocketMesh, setRocketMesh] = useState(null);

    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create a simple rocket model (cone)
        const geometry = new THREE.ConeGeometry(1, 4, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const rocketMesh = new THREE.Mesh(geometry, material);
        scene.add(rocketMesh);

        camera.position.z = 10;

        // Set state
        setScene(scene);
        setCamera(camera);
        setRenderer(renderer);
        setRocketMesh(rocketMesh);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!websocket) return;

        websocket.addListener((data) => {
            // Split the incoming string data into an array
            const sensorValues = data.split(",").map(parseFloat);

            // Ensure there are enough values
            if (sensorValues.length < 19) {
                console.error("Invalid data received:", data);
                return;
            }

            // Extract quaternion values from the correct positions
            const q1 = sensorValues[15]; // Quaternion_1
            const q2 = sensorValues[16]; // Quaternion_2
            const q3 = sensorValues[17]; // Quaternion_3
            const q4 = sensorValues[18]; // Quaternion_4

            console.log("Quaternion Received:", q1, q2, q3, q4);

            // Create a quaternion from the received data
            const quaternion = new THREE.Quaternion(q2, q3, q4, q1); // Adjusting to Three.js format

            // Apply the quaternion rotation to the rocket model
            if (rocketMesh) {
                rocketMesh.setRotationFromQuaternion(quaternion);
            }
        });
    }, [websocket, rocketMesh]);

    return <canvas ref={canvasRef}></canvas>;
};

export default Orientation;
