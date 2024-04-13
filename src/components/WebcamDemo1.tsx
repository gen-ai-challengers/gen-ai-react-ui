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
import { Grid, Skeleton, Container } from '@mantine/core';
import { Card, Image, Text } from '@mantine/core';

const child = <Skeleton height={140} radius="md" animate={false} />;

const width = 500;
const height = 500;

const WebcamDemo = (): JSX.Element => {
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
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      console.log(webcamRef);
      await faceMesh.send({ image: webcamRef.current.video });
    }
  }
  return (

    <div>
      <Container my="md">
        <Grid>
          <Grid.Col span={{ base: 12, xs: 12 }}>
            <Card
              shadow="sm"
              padding="xl"
              component="a"
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
            >
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
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );

};

export default WebcamDemo;
