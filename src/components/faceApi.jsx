import * as faceapi from 'face-api.js';
import React from 'react';
import Button from '@mui/material/Button';
import LocalSeeIcon from '@mui/icons-material/LocalSee';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
function FaceApi() {

  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const videoRef = React.useRef();
  const videoHeight = 200;
  const videoWidth = 400;
  const canvasRef = React.useRef();

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    }
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  const handleVideoOnPlay = () => { 
    setInterval(async () => {
      if (canvasRef && canvasRef.current && videoRef && videoRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        if (!canvasRef.current || !videoRef.current) {
          return;
        }
        if (detections) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        // canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        // canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      
          const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
          const resizeResults = faceapi.resizeResults(detections, dims);
      
          const facesWithHighScore = resizeResults.filter(
            (data) => data.detection.score > 0.7
          );
      
          if (facesWithHighScore.length > 0) {
            if (facesWithHighScore.length > 1) {
              console.log("multipleFacesDetected");
            } else {
              const faceData = JSON.parse(JSON.stringify(facesWithHighScore[0]));
              faceData.score = facesWithHighScore[0].detection.score;
              delete faceData.detection;
              faceData.videoRef = videoRef;
              faceData.canvasRef = canvasRef;
              console.log("faceDetected", faceData);
            }
          }
          faceapi.draw.drawDetections(canvasRef.current, facesWithHighScore);
        }
      }
    }, 100)
  }

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2px' }}>
        {
          captureVideo && modelsLoaded ?<Button onClick={closeWebcam} variant="outlined" startIcon={<NoPhotographyIcon/>}>
          </Button>:<Button onClick={startVideo} variant="outlined" startIcon={< LocalSeeIcon/>}></Button>
        }
      </div>
      {
        captureVideo ?
          modelsLoaded ?
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
              <Button onClick={startVideo} variant="outlined" startIcon={< CenterFocusStrongIcon/>}>Capture</Button>
              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
    </div>
  );
}

export default FaceApi;