import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { FaceDetection } from '@mediapipe/face_detection';
import { TextInput, Checkbox, Button, Group, Box, Card, PasswordInput, Container, Grid, } from '@mantine/core';
function MediaPipe() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var freeze=false;
  var freezedata=false;
  var camera = null;
  const freezeAction=()=>{ 
    freeze=!freeze;
    console.log('freeze',freeze)
     console.log(freezedata);
  }
  function onResults(results) {
   
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const image = new Image();
    canvasCtx.drawImage(
      image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        freezedata=landmarks;
        // console.log( Facemesh.FACEMESH_LIPS);
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#808080",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#808080",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          color: "#808080",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#808080",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }
      // if (results.multiFaceLandmarks.length > 0) {
      //   console.log('Face detected', results)
      // }
    }
    canvasCtx.restore();
  }
  // }

  const handleFaceDetection = (results) => {
    // setFacesDetected(results.multiFaceLandmarks.map((landmarks) => landmarks.boundingBox));
  };
  useEffect(() => {
    //MESH===================================
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

    faceMesh.onResults(onResults);
   //====================
   // FACE DETECT
  //  const faceDetection = new FaceDetection({ locateFile: (file) => {
  //   console.log(file)
  //   return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
  // }});

  // Cleanup function to release resources

   //====================0
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if(!freeze){
          await faceMesh.send({ image: webcamRef.current.video });
          }else{
             
          }
          // await faceDetection.send({ image: webcamRef});
          // console.log(typeof webcamRef.current.video)
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);
  return (
    <center>
      <div className="MediaPipe">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            display: 'none'
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
          <Button variant="filled" onClick={freezeAction}>Freeze</Button>
      </div>
    </center>
  );
}

export default MediaPipe;