import React, { useRef, useEffect } from 'react';
import { Engine, Scene, FreeCamera, HemisphericLight, Mesh, StandardMaterial,Vector3 } from 'babylonjs';

import '@babylonjs/loaders'; // Register loaders
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Animations/animatable"
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
const CatelogueHome = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Create Babylon.js engine and scene
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);
        scene.onPointerDown = (evt) => {
            if (evt.button === 0) engine.enterPointerlock();
            if (evt.button === 1) engine.exitPointerlock();
          };
      
          const framesPerSecond = 60;
          const gravity = -9.81;
          scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
          scene.collisionsEnabled = true;
        CreateEnvironment(scene);
        // ... (Add your Babylon.js logic here)
        const camera = new FreeCamera('camera1', new Vector3(10, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl();

        // Create a hemispheric light
        const light = new HemisphericLight('light1', new Vector3(1, 1, 2), scene);
        light.intensity = 1;

        // Run the render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Clean up on unmount
        return () => {
            engine.dispose();
        };
    }, []);
    const CreateEnvironment=async(scene)=>{
        const importPromise = SceneLoader.ImportMeshAsync(null, "./models/babylon/", "Prototype_Level.glb", scene);
            importPromise.then((result) => {
            //// Result has meshes, particleSystems, skeletons, animationGroups and transformNodes
            });
           

    }
    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '600px' }} />
    );
};

export default CatelogueHome;