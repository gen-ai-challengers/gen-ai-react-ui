
import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useNavigate } from 'react-router-dom';
import { Checkbox, Button, Group, Box, Card, Select , Container, Grid, } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {  addToTrainer,clearModel,selectModel } from './trainerSlice';
const ModelTrainer = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [value, setValue] = useState(null);
    const [freeze,setFreeze]=useState(false);
    const [freezedata,setFreezeata]=useState(false);
    const connect = window.drawConnectors;
    var camera = null;
    // var freeze = false;
    const dispatch = useDispatch();
    const modelData = useSelector(selectModel);
    var lipmaster = [
         {
        "value": "blank",
        "label": "Initial pose"
    },
    {
        "value": "aei",
        "label": "a e i"
    },
    {
        "value": "chjash",
        "label": "ch,j,sh"
    },
    {
        "value": "i",
        "label": "i"
    },
    {
        "value": "fv",
        "label": "f,v"
    },
    {
        "value": "bmp",
        "label": "b,m,p"
    },
    {
        "value": "u",
        "label": "u"
    },
    {
        "value": "th",
        "label": "th"
    },
    {
        "value": "r",
        "label": "r"
    },
    {
        "value": "o",
        "label": "o"
    },
    {
        "value": "wq",
        "label": "w,q"
    },
    {
        "value": "cdghknxtxyz",
        "label": "c,d,g.h.k.n.x.t.x.y.z"
    }
    ];
    const freezeAction = () => {
        // freeze = !freeze;
        setFreeze(!freeze);
        // setTrainedModel([...trainedmodel,freeze]);
        console.log('freeze action', freezedata)
        //  console.log(freezedata);
    }
    const gotoAvatar = () => {
        navigate('/');
    }
    const confirmAction = () => { 
        if(value && freezedata){
        const obj = {};
        obj['value'] = freezedata;
        obj['key'] = value.value;
        dispatch(addToTrainer(obj));
        console.log(modelData);
        }
    }
    const clearModelAction=()=>{
        dispatch(clearModel());
        console.log(modelData);
    }
    // const [freeze,setFreeze]=useState(false);
    function onResults(results) { console.log(results)
        setFreezeata(results.multiFaceLandmarks);
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
            // console.log('freeze in landmark', freeze)
            for (const landmarks of results.multiFaceLandmarks) {
                // setTrainedModel([...trainedmodel,landmarks]);
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
        }
        canvasCtx.restore();
    }
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
            if (
                typeof webcamRef.current !== "undefined" &&
                webcamRef.current !== null
            ) {
                camera = new cam.Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        // if (!freeze) {
                            await faceMesh.send({ image: webcamRef.current.video });
                        // } else {

                        // }
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            }
        }
    }, [freeze, webcamRef]);
   
    return (
        <center>
            <Container my="md">
                <Grid>
                    <Grid.Col span={{ base: 12, xs: 12 }}>
                          <div className="button-cintainer">
                             <Select
                                    label="Select lip"
                                    placeholder="Select value"
                                    data={lipmaster}
                                    value={value ? value.value : null}
                                    onChange={(_value, option) => setValue(option)}
                                    />
                             </div>
                            <div className="button-cintainer">
                                <Button variant="filled" onClick={freezeAction}>Freeze</Button>
                                <Button className="mrgl10" variant="filled" color="cyan" onClick={confirmAction}>Confirm</Button>
                                <Button className="mrgl10" onClick={gotoAvatar} color="green">Go to Avatar</Button>
                                <Button className="mrgl10" onClick={clearModelAction} color="red">Clear Model</Button>
                            </div>
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
                            {/* <Button variant="filled" onClick={showTrainedModel}>Show Model</Button> */}
                            {/* <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={synthesizeAudio}>Synthesize Audio</button>
          <audio controls src={audio} /> */}

                        </div>
                    </Grid.Col>
                </Grid>
            </Container>

        </center>
    );
};

export default ModelTrainer;