import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { faceAddSuccess } from '../auth/authSlice';
import './loader.css';
import * as faceapi from 'face-api.js';
const WEBRTC_CONFIG = {
  sdpSemantics: "unified-plan",
  iceServers: [
    {
      urls: "turn:turn.genai-vm.amprajin.in:3478",
      username: "genai",
      credential: "genai",
    }
  ],
};

function WebRtcAuth(props) {
  const navigate = useNavigate();
  const [localConnection, setLocalConnection] = useState(null);
  const [remoteConnection, setRemoteConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  var pc = null;
  var startTime;
  var dc = null;
  var dcInterval = null;
  var dcInterval2 = null;
  var stopped = false;
  var action = props.action;
  console.log(props)
  const myStyle = {
    width: '48px',
    height: ' 48px',
    display: 'inline-block',
    position: 'relative',
    color: 'red',
    border: '1px solid',
    boxSizing: 'border-box',
    animation: 'fill 2s linear infinite alternate'
  };
  useEffect(() => {
    start();
    setIsPlaying(true);
  }, []);

  const createPeerConnection = () => {
    // create an RTCPeerConnection
    console.log("1.1 Creating RTCPeerConnection", new Date().getTime() - startTime);
    var config = {
      sdpSemantics: "unified-plan",
      iceServers: [{
        urls: "turn:turn.genai.amprajin.in:3478",
        username: "genai",
        credential: "genai",
      }],
    };

    console.log("RTCPeerConnection configuration:", config);
    try {
      pc = new RTCPeerConnection(config);
    } catch (e) {
      setLoader(false)
      console.error("Error creating RTCPeerConnection", e);
      alert("Error creating RTCPeerConnection" + e);
      //document.getElementById("start").style.display = "inline-block";
      return;
    }
    if (!pc) {
      setLoader(false)
      console.error("Failed to create RTCPeerConnection");
      alert("Failed to create RTCPeerConnection");
      //document.getElementById("start").style.display = "inline-block";
      return;
    }
    console.log("RTCPeerConnection created", new Date().getTime() - startTime);

    // register some listeners to help debugging
    pc.addEventListener(
      "icegatheringstatechange",
      () => {
        console.log(" -> ICE gathering state change to:", pc.iceGatheringState, new Date().getTime() - startTime);
      },
      false
    );

    pc.addEventListener(
      "iceconnectionstatechange",
      () => {
        console.log(" -> ICE connection state change to:", pc.iceConnectionState, new Date().getTime() - startTime);
      },
      false
    );

    pc.addEventListener(
      "signalingstatechange",
      () => {
        console.log(" -> Signaling state change to:", pc.signalingState, new Date().getTime() - startTime);
      },
      false
    );

    pc.addEventListener("connectionstatechange", () => {
      console.log(" -> Connection state change to:", pc.connectionState, new Date().getTime() - startTime);
      if (pc.connectionState === "disconnected") {
        //document.getElementById("media").style.display = "none";
        if (!stopped) {
          pc = createPeerConnection();
        }
      }
    })

    // not required 
    // connect audio / video
    pc.addEventListener("track", (evt) => {

      console.log("Got MediaStreamTrack:", evt.track, "from receiver:", evt.receiver, new Date().getTime() - startTime);
    });
    // responce from server
    pc.addEventListener("datachannel", (evt) => {
      console.log("Got DataChannel:", evt.channel, new Date().getTime() - startTime);
      dc = evt.channel;
      dc.addEventListener("close", () => {
        clearInterval(dcInterval2);
        console.log("DataChannel closed", new Date().getTime() - startTime);
      });
      dc.addEventListener("open", () => {
        console.log("DataChannel opened", new Date().getTime() - startTime);
        dcInterval2 = setInterval(() => {
          var message = "ping data 2";
          console.log("Sending DataChannel message:", message, new Date().getTime() - startTime);
          dc.send(message);
        }, 10000);
      });
      dc.addEventListener("message", (evt) => {
        if (evt.data == "User face addedd" || evt.data == "identified") {
          dispatch(faceAddSuccess(true))
          navigate('/catalogue');
        }
        console.log("Got DataChannel message:", evt.data, new Date().getTime() - startTime);
        if (evt.data.trim() === "stop") {
          console.log("Stopping", new Date().getTime() - startTime);
          stop()
        }
      });
    });
    pc.createDataChannel("events");
    console.log("DataChannel created", new Date().getTime() - startTime);

    return pc;
  }

  const negotiate = () => {
    console.log("2 Negotiating", new Date().getTime() - startTime);
    return pc
      .createOffer()
      .then((offer) => {
        console.log("2 Setting local description", new Date().getTime() - startTime);
        return pc.setLocalDescription(offer);
      })
      .then(() => {
        // wait for ICE gathering to complete
        return new Promise((resolve) => {
          if (pc.iceGatheringState === "complete") {
            resolve();
          } else {
            function checkState() {
              if (pc.iceGatheringState === "complete") {
                pc.removeEventListener("icegatheringstatechange", checkState);
                resolve();
              }
            }
            pc.addEventListener("icegatheringstatechange", checkState);
          }
        });
      })

      .then(() => {
        console.log("2 Negotiation complete", new Date().getTime() - startTime);
        var offer = pc.localDescription;
        offer.sdp = sdpFilterCodec("video", "H264", offer.sdp);
        console.log("2 Sending offer to server", new Date().getTime() - startTime);
        console.log("action", action);
        const url = action == 'face_recognition' ? "/api/offer-fr/" : "/api/v1/users/me/add-face-offer/";
        console.log("url", url);
        return fetch(url, {
          body: JSON.stringify({
            sdp: offer.sdp,
            type: offer.type,
            action: action,
          }),
          headers: {
            "Content-Type": "application/json",
            'credentials': 'include'
          },
          method: "POST",
        });
      })
      .then((response) => {
        console.log("2 Got answer from server", new Date().getTime() - startTime);
        return response.json();
      })
      .then((answer) => {
        console.log("Setting remote description");
        console.log("answer", answer);
        //document.getElementById("media").style.display = "block";
        //document.getElementById("loading").style.display = "none";
        console.log("2 Setting remote description", new Date().getTime() - startTime);
        console.log("showing video", new Date().getTime() - startTime);
        return pc.setRemoteDescription(answer);
      })
      .catch((e) => {
        alert(e);
      });
  }

  const start = () => {
    setLoader(true);
    //document.getElementById("loading").style.display = "block";
    stopped = false;
    startTime = new Date().getTime();
    //document.getElementById("start").style.display = "none";
    pc = createPeerConnection();

    console.log("1 Starting call", new Date().getTime() - startTime);

    console.log("1.1 Peer connection created", new Date().getTime() - startTime);
    console.log("pc.iceConnectionState", pc.iceConnectionState, new Date().getTime() - startTime);
    console.log("pc.iceGatheringState", pc.iceGatheringState, new Date().getTime() - startTime);
    console.log("pc.signalingState", pc.signalingState, new Date().getTime() - startTime);


    // Build media constraints.

    const constraints = {
      audio: false,
      video: {
        width: {
          min: 120,
          ideal: 320,
          max: 1024,
        },
        height: {
          min: 120,
          ideal: 240,
          max: 720,
        },
        frameRate: {
          min: 10,
          ideal: 15,
          max: 30,
        },
        facingMode: "user",
      }
    };


    // Acquire media and start negociation.

    navigator.mediaDevices.getUserMedia(constraints).then(

      (stream) => {
        console.log("pc.iceConnectionState", pc.iceConnectionState, new Date().getTime() - startTime);
        console.log("pc.iceGatheringState", pc.iceGatheringState, new Date().getTime() - startTime);
        console.log("pc.signalingState", pc.signalingState, new Date().getTime() - startTime);
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
          if (track.kind == "video") {
            // document.getElementById("video").srcObject = stream;
            localVideoRef.current.stream = stream;
          }
        });
        console.log("1.1 Media acquired", new Date().getTime() - startTime);
        return negotiate();
      },
      (err) => {
        setLoader(false)
        console.error("Error acquiring media:", err);
        //document.getElementById("loading").style.display = "none";
        //document.getElementById("start").style.display = "inline-block";

        alert("Could not acquire media: " + err);
      }
    );
    setLoader(false)
    console.log("Call started", new Date().getTime() - startTime);
    //document.getElementById("stop").style.display = "inline-block";
  }

  const stop = () => {
    stopped = true;
    //document.getElementById("stop").style.display = "none";
    //document.getElementById("start").style.display = "inline-block";
    //document.getElementById("loading").style.display = "block";

    // close data channel
    if (dc) {
      dc.close();
    }

    // close transceivers
    if (pc.getTransceivers) {
      pc.getTransceivers().forEach((transceiver) => {
        if (transceiver.stop) {
          transceiver.stop();
        }
      });
    }

    // close local audio / video
    pc.getSenders().forEach((sender) => {
      sender.track.stop();
    });

    // close peer connection
    setTimeout(() => {
      pc.close();
      //document.getElementById("loading").style.display = "none";
    }, 500);
  }

  const sdpFilterCodec = (kind, codec, realSdp) => {
    var allowed = [];
    var rtxRegex = new RegExp("a=fmtp:(\\d+) apt=(\\d+)\r$");
    var codecRegex = new RegExp("a=rtpmap:([0-9]+) " + escapeRegExp(codec));
    var videoRegex = new RegExp("(m=" + kind + " .*?)( ([0-9]+))*\\s*$");

    var lines = realSdp.split("\n");

    var isKind = false;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("m=" + kind + " ")) {
        isKind = true;
      } else if (lines[i].startsWith("m=")) {
        isKind = false;
      }

      if (isKind) {
        var match = lines[i].match(codecRegex);
        if (match) {
          allowed.push(parseInt(match[1]));
        }

        match = lines[i].match(rtxRegex);
        if (match && allowed.includes(parseInt(match[2]))) {
          allowed.push(parseInt(match[1]));
        }
      }
    }

    var skipRegex = "a=(fmtp|rtcp-fb|rtpmap):([0-9]+)";
    var sdp = "";

    isKind = false;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("m=" + kind + " ")) {
        isKind = true;
      } else if (lines[i].startsWith("m=")) {
        isKind = false;
      }

      if (isKind) {
        var skipMatch = lines[i].match(skipRegex);
        if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
          continue;
        } else if (lines[i].match(videoRegex)) {
          sdp += lines[i].replace(videoRegex, "$1 " + allowed.join(" ")) + "\n";
        } else {
          sdp += lines[i] + "\n";
        }
      } else {
        sdp += lines[i] + "\n";
      }
    }

    return sdp;
  }

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }
  // Add functions for handling media streams (optional)
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
  return (
    <div>
      {/* <div style={{textAlign:'center',width:'100%',paddingTop:'80px'}}>
      <span className='loader'></span>
      </div> */}
      <video ref={localVideoRef} autoPlay muted />
      <canvas
        ref={canvasRef}
        className="output_canvas"
        style={{
          position: "relative",
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
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

    </div>
  );

}

export default WebRtcAuth;