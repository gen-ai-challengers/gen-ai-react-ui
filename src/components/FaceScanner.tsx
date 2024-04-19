import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { useEffect, useRef } from 'react';
import React from 'react';
import { sendToDetectionEndpoint } from './shared/services/faceService';
import { FaceMesh } from '@mediapipe/face_mesh';
import './FaceScanner.css';
import Loader from './loader/loader';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { signUpSuccess, selectSignUpSuccess, selectUser } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const width = 500;
const height = 400;

const FaceScanner = (props: any): JSX.Element => {
  //central store
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const isSignUpInProgress = useSelector(selectSignUpSuccess);
  const dispatch = useDispatch();
  // ============
  const message = props;
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [cameraOutput, setCameraOutput] = React.useState<null | Blob>(null);
  const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }: CameraOptions) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });
  useEffect(() => {
    if(capturedImage){
      fetchDataAsync();
    }
  }, [capturedImage]);
  const convertBase64ToFile = (base64String: any) => {
    // Check if the input is a valid base64 string
    const isValidBase64 = /^data:[a-zA-Z0-9\/\+]+;base64,/.test(base64String);
    if (!isValidBase64) {
      console.error('Invalid base64 string');
      return;
    }

    // Extract the base64 string (remove data URI prefix)
    const base64Content = base64String.split(';base64,')[1];

    // Convert base64 string to Blob
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // Create a file from Blob
    const convertedFile = new File([blob], 'filename.jpg');
    setCameraOutput(convertedFile);
  };
  const capture = (webcamRef: any) => {
    const imageSrc = webcamRef.current.getScreenshot();
    convertBase64ToFile(imageSrc);
    setCapturedImage(imageSrc);
  };

  const fetchDataAsync = async () => {
    try {
      debugger;
      const fileurl = "";
      const formData = new FormData();
      if (capturedImage !== null) {
        formData.append("file", capturedImage);
      }
      setCameraOutput(null);
      // const result = await sendToDetectionEndpoint(formData);
      if (isSignUpInProgress) {
        axios.post(process.env.REACT_APP_API_URL + '/v1/users/21/add-face', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(function (response) {
            // handle success
            console.log(response);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
      } else {
        axios.post(process.env.REACT_APP_API_URL + '/recognize', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(function (response) {
            // handle success
            console.log(response);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
      }
    } catch (error) {
      // Handle error
    }

  };
  useEffect(() => {
    // if(facesDetected==1 && !isSignUpInProgress){ 
    // capture(webcamRef)
    // // ff(webcamRef)
    // }{
    // setCapturedImage(null);
    // }
  }, [facesDetected]);
  async function ff(webcamRef: any) {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      console.log(webcamRef);
      await faceMesh.send({ image: webcamRef.current.video });
    }
  }
  useEffect(() => {
    // Check if the props have changed
    // The effect runs every time 'someProp' changes
    console.log('Props have changed!', message);
    if (message.confirmScanAction) {
      capture(webcamRef);
    }
  }, [message, webcamRef]);
  return (

    <div>
      {/* <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p> */}
      <div style={{ width: '100%', height, position: 'relative' }}>
        {boundingBox.map((box, index) => (
          <div
            key={`${index + 1}`}
            style={{
              border: '4px solid red',
              position: 'absolute',
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          >
            {/* <span className="fingerprint scanning"></span> */}
          </div>
        ))}
        <div style={{ display: 'flex' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            forceScreenshotSourceSize
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              // display: 'none'
            }}
          />
          {message.addAction}
          {/* <button onClick={() => capture(webcamRef)}>Login</button> */}
          {/* <Loader/> */}
          {/* {capturedImage && (
            <div>
              <h2>Captured Image</h2>

              <img src={capturedImage} id="screen" alt="Captured" />
            </div>
          )} */}
        </div>
      </div>

    </div>
  );

};

export default FaceScanner;
