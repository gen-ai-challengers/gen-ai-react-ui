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

    const handleStartCall = async () => {
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

        // Create offer and send to signaling server (implementation needed)
        // await pc.setLocalDescription(offer);
        // console.log('Created offer:', offer);
        const offer = await pc.createOffer().then((offer) => {
            // console.log("2 Setting local description", new Date().getTime() - startTime);
            return pc.setLocalDescription(offer);
          })
          .then(() => {
            // console.log("2 Negotiation complete", new Date().getTime() - startTime);
            var offer = pc.localDescription;
            var codec;
            
            // console.log("2 Sending offer to server", new Date().getTime() - startTime);
            return fetch("https://genai-vm.amprajin.in/api/offer-fr/", {
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
            // console.log("2 Got answer from server", new Date().getTime() - startTime);
            return response.json();
          })
          .then((answer) => {
            console.log("Setting remote description");
            // return pc.setRemoteDescription(answer);
          })
          .catch((e) => {
            alert(e);
          });


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
            {isCalling ? (
                <button onClick={handleStopCall}>Stop Call</button>
            ) : (
                <button onClick={handleStartCall}>Start Call</button>
            )}
        </div>
    );
}

export default WebRTCVideoChat;