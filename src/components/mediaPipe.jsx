import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { FaceDetection } from '@mediapipe/face_detection';
import Button from '@mui/material/Button';
import axios, { Axios } from "axios";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {  addToTrainer,clearModel,selectModel } from '../auth/trainer/trainerSlice';
function MediaPipe() {
  const modelData = useSelector(selectModel);
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  // var freeze=false;
  var camera = null;
  // TEXT TO SPEECH
  const [freeze, setFreeze] = useState(false);
  const [text, setText] = useState('');
  const [letter, setLetter] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trainedmodel, setTrainedModel] = useState([]);
  //===============
  //SPEECH RECGNITION
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //=================
  function onResults(results) { console.log(results)

    // const video = webcamRef.current.video;
    // const videoWidth = webcamRef.current.video.videoWidth;
    // const videoHeight = webcamRef.current.video.videoHeight;
    const videoWidth = 500;
    const videoHeight = 500;
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
    if (results) {
      for (const landmarks of results) {
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

  const playHandler = () => {
    text.split('').map((letter, index) => {
      setLetter(letter);
      // console.log('playyyyy',letter)
    })

    // setCurrentIndex(0)
    // const stringArray = text.split('');
    // onResults(modelData['blank'])
    // stringArray.map((m)=>{ 
    //   if(m=="a"||m=="e"||m=="i"){
    //     onResults(modelData['aei'])
    //   }else if(m==" "){
    //     onResults(modelData['blank'])
    //   }
    // })
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(letter);
    }, 300);
    return () => clearTimeout(timer);
  },[letter])
  useEffect(() => {

    if (webcamRef) {
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

      // Cleanup function to release resources

      //====================0
      // if (
      //   typeof webcamRef.current !== "undefined" &&
      //   webcamRef.current !== null
      // ) {
      //   camera = new cam.Camera(webcamRef.current.video, {
      //     onFrame: async () => {
      //       if(!freeze){ 
      //       await faceMesh.send({ image: webcamRef.current.video });
      //       }else{

      //       }
      //       // await faceDetection.send({ image: webcamRef});
      //       // console.log(typeof webcamRef.current.video)
      //     },
      //     width: 640,
      //     height: 480,
      //   });
      //   camera.start();
      // }
    }
  }, [webcamRef]);
  const synthesizeAudio = async () => {
    const response = await axios.post('http://localhost:3001/tts', { text })
    const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
    // console.log(audioSrc);
    setAudioSrc(audioSrc);
    setIsPlaying(true);
  }

  const gotoTrainer = () => {
    navigate('/model-trainer');
  }
  return (
    <center>
      <div className="MediaPipe">
        <div className="textarea-cintainer" style={{ marginLeft: '100px;', display: 'flex' }}>
          <textarea value={text} onChange={e => { setText(e.target.value) }} />
          <br />
        </div>
        <div className="button-cintainer" style={{ marginLeft: '100px;', display: 'flex' }}>
          {/* <Button onClick={synthesizeAudio}>Synthesize Audio</Button>
          <Button className="mrgl10" color="red" onClick={gotoTrainer}>Train Model</Button> */}
          <br />
          {/* style={{display:'none'}}  */}
          {audioSrc && <audio onPlay={playHandler}  autoPlay={isPlaying} controls src={audioSrc} />}
        </div>
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

      </div>

    </center>
  );
}

export default MediaPipe;