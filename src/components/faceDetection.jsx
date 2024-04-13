import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [facesDetected, setFacesDetected] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('../models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('../models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('../models');
      await faceapi.nets.faceExpressionNet.loadFromUri('../models');
    };

    loadModels();
  }, []);

  const detectFaces = async () => { debugger;
    if (webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video;
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      setFacesDetected(detections);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    }
  };

  const captureScreenshot = () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const screenshotUrl = canvas.toDataURL();
      console.log(screenshotUrl); // Do something with the screenshot, like saving it or displaying it.
    }
  };

  return (
    <div>
      <Webcam ref={webcamRef} width={640} height={480} onUserMedia={() => detectFaces()} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      <button onClick={() => captureScreenshot()}>Take Screenshot</button>
      {facesDetected.map((face, index) => (
        <div key={index}>{/* Render information about each detected face */}</div>
      ))}
    </div>
  );
};

export default FaceDetection;
