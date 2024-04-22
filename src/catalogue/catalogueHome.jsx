import React, { useRef, useEffect } from 'react';
import { Engine, Scene, FreeCamera, HemisphericLight, Mesh, StandardMaterial,Vector3 } from 'babylonjs';
import '@babylonjs/loaders'; // Register loaders

const CatelogueHome = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Create Babylon.js engine and scene
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        // ... (Add your Babylon.js logic here)
        const camera = new FreeCamera('camera1', new Vector3(10, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvasRef.current, true);

        // Create a hemispheric light
        const light = new HemisphericLight('light1', new Vector3(1, 1, 2), scene);
        light.intensity = 1;

        // Create a sphere mesh
        const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene);

        // Apply a standard material (optional)
        const material = new StandardMaterial('material1', scene);
        sphere.material = material;
        // Run the render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Clean up on unmount
        return () => {
            engine.dispose();
        };
    }, []);

    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '400px' }} />
    );
};

export default CatelogueHome;