import React, { useState, useEffect, useRef } from 'react';

const configuration = {
    iceServers: [
        {
            urls: "turn:turn.genai-vm.amprajin.in:3478",
            username: "genai",
            credential: "genai",
        }
    ],
};

function WebRTCVideoChat() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [isCalling, setIsCalling] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    var dcInterval = null;
    var pc = null;
    var startTime;
    var iceGatheringLog;
    var iceConnectionLog;
    var signalingLog;
    var dataChannelLog;
    var offer_sdp;
    var answer_sdp;
    useEffect(() => {
        const startStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setLocalStream(stream);
                localVideoRef.current.srcObject = stream;
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        startStream();
    }, []);
    const createPeerConnection = () => {
        setIsCalling(true);
        try {
            pc = new RTCPeerConnection(configuration);
        } catch (e) {
            console.error("Error creating RTCPeerConnection", e);
            alert("Error creating RTCPeerConnection" + e);
            return;
        }
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // Send ICE candidate to signaling server (implementation needed)
                console.log('Sending ICE candidate:', event.candidate);
            }
        };

        pc.onaddstream = (event) => {
            setRemoteStream(event.stream);
            remoteVideoRef.current.srcObject = event.stream;
        };
        // register some listeners to help debugging
        pc.addEventListener(
            "icegatheringstatechange",
            () => {
                console.log(" -> ICE gathering state change to:", pc.iceGatheringState, new Date().getTime() - startTime);
                iceGatheringLog = " -> " + pc.iceGatheringState;
            },
            false
        );
        iceGatheringLog = pc.iceGatheringState;

        pc.addEventListener(
            "iceconnectionstatechange",
            () => {
                console.log(" -> ICE connection state change to:", pc.iceConnectionState, new Date().getTime() - startTime);
                iceConnectionLog= " -> " + pc.iceConnectionState;
            },
            false
        );
        iceConnectionLog= pc.iceConnectionState;

        pc.addEventListener(
            "signalingstatechange",
            () => {
                console.log(" -> Signaling state change to:", pc.signalingState, new Date().getTime() - startTime);
                signalingLog= " -> " + pc.signalingState;
            },
            false
        );
        signalingLog = pc.signalingState;

        // connect audio / video
        pc.addEventListener("track", (evt) => {
            console.log("Got MediaStreamTrack:", evt.track, "from receiver:", evt.receiver, new Date().getTime() - startTime);
            if (evt.track.kind == "video")
                localVideoRef.current.srcObject = evt.streams[0];
        });
        return pc;
    }
    function negotiate() {
        console.log("2 Negotiating", new Date().getTime() - startTime);
        return pc
          .createOffer()
          .then((offer) => {
            console.log("2 Setting local description", new Date().getTime() - startTime);
            return pc.setLocalDescription(offer);
          })
          .then(() => {
            console.log("2 Negotiation complete", new Date().getTime() - startTime);
            var offer = pc.localDescription;
      
            offer_sdp = offer.sdp;
            console.log("2 Sending offer to server", new Date().getTime() - startTime);
            return fetch("http://localhost:8080/api/offer-fr/", {
              body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                action: 'edges',
              }),
              headers: {
                "Content-Type": "application/json",
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
            answer_sdp = answer.sdp;
            return pc.setRemoteDescription(answer);
          })
          .catch((e) => {
            alert(e);
          });
      }
    const handleStartCall = async () => {

        startTime = new Date().getTime();
        // document.getElementById("start").style.display = "none";
      
        console.log("1 Starting call", new Date().getTime() - startTime);
        const pc = createPeerConnection();
        console.log("1.1 Peer connection created", new Date().getTime() - startTime);
        console.log("pc.iceConnectionState",pc.iceConnectionState, new Date().getTime() - startTime);
        console.log("pc.iceGatheringState",pc.iceGatheringState, new Date().getTime() - startTime);
        console.log("pc.signalingState",pc.signalingState, new Date().getTime() - startTime);
      
        var time_start = null;
      
        const current_stamp = () => {
          if (time_start === null) {
            time_start = new Date().getTime();
            return 0;
          } else {
            return new Date().getTime() - time_start;
          }
        };
      

          var parameters = {"ordered": true};
      
         const  dc = pc.createDataChannel("chat", parameters);
          dc.addEventListener("close", () => {
            clearInterval(dcInterval);
            dataChannelLog= "- close\n";
          });
          dc.addEventListener("open", () => {
            dataChannelLog= "- open\n";
            dcInterval = setInterval(() => {
              var message = "ping " + current_stamp();
              dataChannelLog= "> " + message + "\n";
              dc.send(message);
            }, 1000);
          });
          dc.addEventListener("message", (evt) => {
            dataChannelLog= "< " + evt.data + "\n";
      
            if (evt.data.substring(0, 4) === "pong") {
              var elapsed_ms = current_stamp() - parseInt(evt.data.substring(5), 10);
              dataChannelLog= " RTT " + elapsed_ms + " ms\n";
            }
          });
        
      
        // Build media constraints.
      
        const constraints = {
          audio: false,
          video: false,
        };
      
       
          const videoConstraints = {};
    
          videoConstraints.frameRate = 10;
      
          constraints.video = Object.keys(videoConstraints).length
            ? videoConstraints
            : true;
        
      
        // Acquire media and start negociation.
      
        if (constraints.audio || constraints.video) {
          if (constraints.video) {
            // document.getElementById("media").style.display = "block";
          }
          navigator.mediaDevices.getUserMedia(constraints).then(
            
            (stream) => {
              console.log("pc.iceConnectionState",pc.iceConnectionState, new Date().getTime() - startTime);
              console.log("pc.iceGatheringState",pc.iceGatheringState, new Date().getTime() - startTime);
              console.log("pc.signalingState",pc.signalingState, new Date().getTime() - startTime);
              stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
              });
              console.log("1.1 Media acquired", new Date().getTime() - startTime);
              return negotiate();
            },
            (err) => {
              alert("Could not acquire media: " + err);
            }
          );
        } else {
          console.log("1.1 No media selected", new Date().getTime() - startTime);
          negotiate();
        }
        console.log("Call started", new Date().getTime() - startTime);
        // document.getElementById("stop").style.display = "inline-block";
    };

    const handleAnswerCall = async (sdp) => {
        setIsCalling(true);

        const pc = new RTCPeerConnection(configuration);
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // Send ICE candidate to signaling server (implementation needed)
                console.log('Sending ICE candidate:', event.candidate);
            }
        };

        pc.onaddstream = (event) => {
            setRemoteStream(event.stream);
            remoteVideoRef.current.srcObject = event.stream;
        };

        await pc.setRemoteDescription(sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Send answer to signaling server (implementation needed)
        console.log('Created answer:', answer);
    };

    const handleStopCall = async () => {
        setIsCalling(false);

        localStream.getTracks().forEach((track) => track.stop());
        remoteStream?.getTracks().forEach((track) => track.stop());

        peerConnection?.close();
        setPeerConnection(null);
        setRemoteStream(null);
    };

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted width={320} height={240} />
            <video ref={remoteVideoRef} autoPlay width={320} height={240} />
            <div id='textContent'></div>
            <div id='iceConnectionLog'>{iceConnectionLog}</div>
            <div id='iceGatheringLog'>{iceGatheringLog}</div>
            <div id=''>{signalingLog}</div>
            <div id=''>{dataChannelLog}</div>
            <div id=''>{offer_sdp}</div>
            <div id=''>{answer_sdp}</div>
            {isCalling ? (
                <button onClick={handleStopCall}>Stop Call</button>
            ) : (
                <button onClick={handleStartCall}>Start Call</button>
            )}
        </div>
    );
}

export default WebRTCVideoChat;