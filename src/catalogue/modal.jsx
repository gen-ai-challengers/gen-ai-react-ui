import React, { useRef, useEffect } from 'react';
import { Engine, Scene, FreeCamera, HemisphericLight, Mesh, StandardMaterial, Vector3, Matrix, GUI, AxesViewer,CreateScreenshot } from 'babylonjs';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import '@babylonjs/loaders'; // Register loaders
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Animations/animatable";
import Rating from '@mui/material/Rating';
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { useNavigate } from 'react-router-dom';
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import axios from 'axios';
import  GenAiChat from '../chat/GenAiChat';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const NumberInput = React.forwardRef(function CustomNumberInput(
  props,
  ref,
) {
  return (
    <BaseNumberInput
      slots={{
        root: InputRoot,
        input: InputElement,
        incrementButton: Button,
        decrementButton: Button,
      }}
      slotProps={{
        incrementButton: {
          children: <span className="arrow">▴</span>,
        },
        decrementButton: {
          children: <span className="arrow">▾</span>,
        },
      }}
      {...props}
      ref={ref}
    />
  );
});
export default function ModalPreview(props) {
  const [starValue, setStarValue] = React.useState(4);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedProduct, setSelectedProduct] = React.useState(false);
  const canvasPreviewRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    // const getImageData=()=>{
    //   var formData = new FormData(this);
    //   var fileInput = file;
    //   formData.append("user_image", fileInput);
    //   axios.post('/chat',formData)
    // }
  },[]);
  useEffect(() => {
    // console.log('props', props)
    if (props.product) {
      setSelectedProduct(props.product);
    }
    // // Create Babylon.js engine and scene
    // const engine = new Engine(canvasPreviewRef.current, true, { preserveDrawingBuffer: true, stencil: true });
    // const scene = new Scene(engine);
    // // var axes = new AxesViewer(scene, 2); 
    // scene.onPointerDown = (evt) => {
    //   if (evt.button === 0) engine.enterPointerlock();
    //   if (evt.button === 1) engine.exitPointerlock();
    // };

    // const framesPerSecond = 60;
    // const gravity = -9.81;
    // scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    // scene.collisionsEnabled = true;
    // const camera = new FreeCamera('camera1', new Vector3(8, 5, 20), scene);
    // camera.setTarget(Vector3.Zero());
    // camera.attachControl();
    // camera.speed = 0.1;
    // // CreateEnvironment(scene, camera);
    // const light = new HemisphericLight('light1', new Vector3(1, 1, 2), scene);
    // light.intensity = 1;
    // if (selectedProduct) {
    //   const bag2 = SceneLoader.ImportMesh(null, "./models/store/", selectedProduct.key + ".glb", scene, function (newMeshes) {
    //     newMeshes[0].getChildMeshes()[0].metadata = selectedProduct.key;
    //     const importedMesh = newMeshes[0];
    //     importedMesh.position.set(selectedProduct.position.x - 2, selectedProduct.position.y - 8, selectedProduct.position.z - 2);
    //     importedMesh.rotation.x = selectedProduct.rotation;
    //     // importedMesh.scaling = new Vector3(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z);
    //     importedMesh.scaling = new Vector3(10, 10, 10);
    //     CreateScreenshot(engine, camera, { width: 1024, height: 768 }, function(data) {
    //             // data is a base64 encoded image
    //       console.log(data);
    //           });
    //   });
    // }
    // engine.runRenderLoop(() => {
    //   scene.render();
    // });
    // return () => {
    //   engine.dispose();
    // };
  }, [props, selectedProduct]);
  const handleCheckout=()=>{
    navigate('/checkout');
  }
  return (
    <div>
      <span> </span>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <h3>{selectedProduct.name}</h3>
            <h2>${selectedProduct.price}</h2>
            <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Rating name="read-only" value={starValue} readOnly />
              {/* <NumberInput
                startAdornment={
                  <InputAdornment>
                  </InputAdornment>
                }
              /> */}
            </Box>
            <Box   sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}>
            Indulge in timeless elegance with our Luxury Leather Shoulder Bag, meticulously crafted to complement your style and lifestyle. Handmade by skilled artisans, this bag exudes sophistication and durability, making it a staple accessory for any occasion.
            </Box>
            <Box
              sx={{
                display: 'flex',
                textAlign:'center',
                gap: 2,
                paddingTop:'10px'
              }}
            >
              <Button   onClick={handleCheckout} variant="contained">Checkout</Button>
              </Box>
          </Grid>
          </Grid>
          <Grid item xs={8}>
            {/* <img src='blackbag1.png'></img> */}
            <GenAiChat/>
            {/* <canvas ref={canvasPreviewRef} style={{ width: '100%', height: '300px' }} /> */}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
const InputAdornment = styled('div')(
  ({ theme }) => `
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[500] : grey[700]};
`,
);

const blue = {
  100: '#DAECFF',
  200: '#B6DAFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
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

const InputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
  display: grid;
  grid-template-columns: auto 1fr auto 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const InputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);
