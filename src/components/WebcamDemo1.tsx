import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { useEffect, useRef } from 'react';
import React from 'react';
import { sendToDetectionEndpoint } from './shared/services/faceService';
import { FaceMesh } from '@mediapipe/face_mesh';
import './WebcamDemo1.css';
import Loader from './loader/loader';
const width = 500;
const height = 500;

const WebcamDemo = (): JSX.Element => {
  var camera = null;
  const [capturedImage, setCapturedImage] = React.useState(null);
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
  const capture = (webcamRef: any) => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Do something with the imageSrc, such as displaying it or saving it.
    // console.log(imageSrc);
    setCapturedImage(imageSrc);
    fetchDataAsync(imageSrc);

  };
  const fetchDataAsync = async (imageSrc: any) => {
    try {
      debugger;

      const imageBlob = new Blob([imageSrc], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      const formData = new FormData();

      formData.append("file", imageUrl);
      const result = await sendToDetectionEndpoint(formData);
    } catch (error) {
      // Handle error
    }
  };
  useEffect(() => {
    console.log("Face changed", facesDetected, detected);


    // faceMesh.onResults(onResults);

    // This function will be c alled whenever myVariable changes
    // if(facesDetected==1){ 
    // capture(webcamRef)
    // ff(webcamRef)
    // }{
    setCapturedImage(null);
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
    // faceMesh.onResults(onResults);
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      console.log(webcamRef);
      await faceMesh.send({ image: webcamRef.current.video });
    }
  }
  function onResults(results:any) {
    console.log(results)
    // // const video = webcamRef.current.video;
    // const videoWidth = webcamRef.current.video.videoWidth;
    // const videoHeight = webcamRef.current.video.videoHeight;

    // // Set canvas width
    // canvasRef.current.width = videoWidth;
    // canvasRef.current.height = videoHeight;

    // const canvasElement = canvasRef.current;
    // const canvasCtx = canvasElement.getContext("2d");
    // canvasCtx.save();
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(
    //   results.image,
    //   0,
    //   0,
    //   canvasElement.width,
    //   canvasElement.height
    // );

    // if (results.multiFaceLandmarks) {
    //   for (const landmarks of results.multiFaceLandmarks) {
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
    //       color: "#C0C0C070",
    //       lineWidth: 1,
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
    //       color: "#808080",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
    //       color: "#808080",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
    //       color: "#808080",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
    //       color: "#808080",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
    //       color: "#E0E0E0",
    //     });
    //     connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
    //       color: "#E0E0E0",
    //     });
    //   }
    //   // if (results.multiFaceLandmarks.length > 0) {
    //   //   console.log('Face detected', results)
    //   // }
    // }
    // canvasCtx.restore();
  }
  return (
    <div>
      {/* <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p> */}
      <div style={{ width, height, position: 'relative' }}>
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
          <span className="fingerprint scanning"></span>
          </div>
        ))}
        <div style={{ display: 'flex' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            forceScreenshotSourceSize
            style={{
              height,
              width,
              position: 'relative',
              // display: 'none'
            }}
          />
          {/* <button onClick={() => capture(webcamRef)}>Login</button> */}
          {/* <Loader/> */}
          {capturedImage && (
            <div>
              <h2>Captured Image</h2>
  
              <img src={capturedImage} alt="Captured" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default WebcamDemo;
