import React, { useRef, useEffect } from 'react';
import { Engine, Scene, FreeCamera, HemisphericLight, Mesh, StandardMaterial, Vector3, Matrix, GUI, AxesViewer,CreateScreenshot } from 'babylonjs';

import '@babylonjs/loaders'; // Register loaders
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Animations/animatable"
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import MediaPipe1 from '../components/mediaPipe1';
import ModalPreview from './modal';
import axios from 'axios';
import { Box, Grid } from '@mui/material';
import  GenAiChat from '../chat/GenAiChat';
import './Chat.css';
const CatelogueHome = () => {
  const canvasRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const [chatWindow, setChatWindow] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(false);
  const handleOpen = (key) =>{
    setOpen(true);
  } 
  const handleClose = () => setOpen(false);
  var catalogueMeshes = [ 
    { key: 'converse__free', position: { x: 2.25, y: 0, z: 0 }, scaling: { x: .06, y: .06, z: .06 }, rotation: 100, name: 'Converse Shoe', price: '1000' },
    { key: 'converse__free', position: { x: 2, y: 0, z: 0 }, scaling: { x: .06, y: .06, z: .06 }, rotation: 100, name: 'Converse Shoe', price: '1000' },
    { key: 'converse__free', position: { x: 1.6, y: 0, z: 0 }, scaling: { x: .06, y: .06, z: .06 }, rotation: 100, name: 'Converse Shoe', price: '1000' },
    { key: 'converse__free', position: { x: 1.4, y: 0, z: 0 }, scaling: { x: .06, y: .06, z: .06 }, rotation: 100, name: 'Converse Shoe', price: '1000' },
    { key: 'teddy_bear', position: { x: 2.25, y: .2, z: 0 }, scaling: { x: .2, y:.2, z: .2 }, rotation: 0, name: 'Teddy', price: '1000' },
    { key: 'teddy_bear', position: { x: 2, y: .2, z: 0 }, scaling: { x: .2, y:.2, z: .2 }, rotation: 0, name: 'Teddy', price: '1000' },
    { key: 'teddy_bear', position: { x: 1.6, y: .2, z: 0 }, scaling: { x: .2, y:.2, z: .2 }, rotation: 0, name: 'Teddy', price: '1000' },
    { key: 'teddy_bear', position: { x: 1.4, y: .2, z: 0 }, scaling: { x: .2, y:.2, z: .2 }, rotation: 0, name: 'Teddy', price: '1000' },
    
    { key: 'dior_bolso_saddle_con_bandolera_rojo', position: { x: -1.3, y: 0, z: 0 }, scaling: { x: .2, y: .2, z: .2 }, rotation: 50, name: 'Red Bag 1', price: '1000' },
    { key: 'dior_bolso_saddle_con_bandolera_rojo', position: { x: -1.6, y: 0, z: 0 }, scaling: { x: .2, y: .2, z: .2 }, rotation: 50, name: 'Red Bag 2', price: '1000' },
    { key: 'dior_bolso_saddle_con_bandolera_rojo', position: { x: -1.9, y: 0, z: 0 }, scaling: { x: .2, y: .2, z: .2 }, rotation: 50, name: 'Red Bag 3', price: '1000' },
    { key: 'dior_bolso_saddle_con_bandolera_rojo', position: { x: -2.3, y: 0, z: 0 }, scaling: { x: .2, y: .2, z: .2 }, rotation: 50, name: 'Red Bag 4', price: '1000' },
    // { key: 'helmet', position: { x: .6, y: .4, z: 0 }, scaling: { x: .3, y: .3, z: .3 }, rotation: 50, name: 'Helmet', price: '1000' },
    // { key: 'cap', position: { x: .1, y: .4, z: 0 }, scaling: { x: .1, y: .1, z: .1 }, rotation: 10, name: 'Helmet', price: '1000' },
   
    { key: 'leather_bag_v2_pbr_material', position: { x: -1.3, y: .4, z: .1 }, scaling: { x: .3, y:.3, z: .3 }, rotation: 50, name: 'Leather Bag', price: '6999' },
    { key: 'leather_bag_v2_pbr_material', position: { x: -1.6, y: .4, z: .1 }, scaling: { x: .3, y:.3, z: .3 }, rotation: 50, name: 'Leather Bag', price: '265' },
    { key: 'leather_bag_v2_pbr_material', position: { x: -1.9, y: .4, z: .1 }, scaling: { x: .3, y:.3, z: .3 }, rotation: 50, name: 'Leather Bag', price: '256' },
    { key: 'leather_bag_v2_pbr_material', position: { x: -2.3, y: .4, z: .1 }, scaling: { x: .3, y:.3, z: .3 }, rotation: 50, name: 'Leather Bag', price: '1256' },
    // { key: 'table_mirror', position: { x: -.2, y: .1, z: .1 }, scaling: { x: .5, y:.5, z: .5 }, rotation: 50, name: 'Helmet', price: '1000' }
  ];
  useEffect(() => {
    // Create Babylon.js engine and scene
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
   
    // var axes = new AxesViewer(scene, 2);
    scene.onPointerDown = (evt) => {
      if (evt.button === 0) engine.enterPointerlock();
      if (evt.button === 1) engine.exitPointerlock();
    };

    const framesPerSecond = 60;
    const gravity = -9.81;
    scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    scene.collisionsEnabled = true;
    const camera = new FreeCamera('camera1', new Vector3(1, 1, 3), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl();
    camera.speed = 0.1;
    CreateEnvironment(scene, camera);
    // ... (Add your Babylon.js logic here)


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
  const CreateEnvironment = async (scene, camera) => {
    const importPromise = SceneLoader.ImportMeshAsync(null, "./models/store/", "dotumal_womens_clothing.glb", scene);
    // // const importPromise = SceneLoader.ImportMeshAsync(null, "./models/babylon/", "Prototype_Level.glb", scene);
    // importPromise.then((result) => {
    //   //// Result has meshes, particleSystems, skeletons, animationGroups and transformNodes
    // });
    const shelf1 = SceneLoader.ImportMesh(null, "./models/store/", "kallax_shelf.glb", scene, function (newMeshes) {
      newMeshes[0].getChildMeshes()[0].metadata = "cannon";
      const importedMesh = newMeshes[0];
      importedMesh.position.set(-1.8, 0, 0);
      importedMesh.rotation.x = 100;
      console.log(newMeshes)
      scene.onPointerDown = function castRay() {
        var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera);
        var hit = scene.pickWithRay(ray);
      }
    });
    const shelf2 = SceneLoader.ImportMesh(null, "./models/store/", "kallax_shelf.glb", scene, function (newMeshes) {
      newMeshes[0].getChildMeshes()[0].metadata = "cannon";
      const importedMesh = newMeshes[0];
      importedMesh.position.set(1.8, 0, 0);
      importedMesh.rotation.x = 100;
      console.log(newMeshes)
      scene.onPointerDown = function castRay() {
        var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera);
        var hit = scene.pickWithRay(ray);
      }
    });
    catalogueMeshes.forEach((mesh) => {
      const bag2 = SceneLoader.ImportMesh(null, "./models/store/", mesh.key + ".glb", scene, function (newMeshes) {
        newMeshes[0].getChildMeshes()[0].metadata = mesh.key;
        // newMeshes[0].metadata=mesh.key;
        console.log( mesh.key,newMeshes[0])
        const importedMesh = newMeshes[0];
        importedMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
        importedMesh.rotation.x = mesh.rotation;
        importedMesh.scaling = new Vector3(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z);
        scene.onPointerDown = function castRay() {
          var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera);
          var hit = scene.pickWithRay(ray);
          console.log(hit,newMeshes,mesh.key)
          // if (hit.pickedMesh && newMeshes.find((f) => f.id == hit.pickedMesh.id)) {
            if (hit.pickedMesh && hit.pickedMesh.metadata == mesh.key) {
            handleOpen(mesh.key);
            setSelectedProduct(mesh)
            console.log(hit.pickedMesh);
            return;
          } else {
            handleClose();
          }
          handleClose();
        }
      });
    })

  }

  function createGUIButton() {
    handleOpen();
  }
  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '900px' }} />
      {/* {chatWindow(
      <div className='chat-window'>
        <GenAiChat/>
      </div>)
      }  */}
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 900,height:400 }}>
          <ModalPreview product={selectedProduct}/>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CatelogueHome;

const Backdrop = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ 'base-Backdrop-open': open }, className)}
      ref={ref}
      {...other}
    />
  );
});

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Modal = styled(BaseModal)`
    position: fixed;
    z-index: 1300;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
  `;

const ModalContent = styled('div')(
  ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      text-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
        ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  
      & .modal-title {
        margin: 0;
        line-height: 1.5rem;
        margin-bottom: 8px;
      }
  
      & .modal-description {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 400;
        color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
        margin-bottom: 4px;
      }
    `,
);

const TriggerButton = styled('button')(
  ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 150ms ease;
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
      &:hover {
        background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
        border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      }
  
      &:active {
        background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
      }
  
      &:focus-visible {
        box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
        outline: none;
      }
    `,
);