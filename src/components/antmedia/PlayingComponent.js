import React, { useState, useEffect, useRef } from 'react';
import { WebRTCAdaptor } from '@antmedia/webrtc_adaptor';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid  from '@mui/material/Grid';
const PlayingComponent = () => {
  const [playing, setPlaying] = useState(false);
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [streamId, setStreamId] = useState('stream123');
  const webRTCAdaptor = useRef(null);
  var playingStream = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    playingStream.current=streamId
    webRTCAdaptor.current.play(streamId);
  };

  const handleStopPlaying = () => {
    setPlaying(false);
    webRTCAdaptor.current.stop(playingStream.current);
  };

  const handleStreamIdChange = (event) => {
    setStreamId(event.target.value);
  };

  useEffect(() => {
    if(webRTCAdaptor.current === undefined || webRTCAdaptor.current === null){
      
    webRTCAdaptor.current = new WebRTCAdaptor({
      websocket_url: 'wss://test.antmedia.io:/WebRTCAppEE/websocket',
      mediaConstraints: {
        video: true,
        audio: true,
      },
      peerconnection_config: {
        iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
      },
      sdp_constraints: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true, // Set to true to receive video
      },
      remoteVideoId: 'remoteVideo',
      callback: (info, obj) => {
        if (info === 'initialized') {
          setWebsocketConnected(true);
        }
      },
      callbackError: function (error, message) {
        console.log(error, message);
        if (error === 'no_stream_exist'){
            handleStopPlaying();
            setPlaying(false);
            alert(error);
        }
      },
    });
  }
  }, []);

  return (
    <Container className="text-center">
      <h1>Play Page</h1>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <video
            id="remoteVideo"
            controls
            autoPlay
            muted="muted" playsinline="playsinline" 
            style={{
              width: '40vw',
              height: '60vh',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          ></video>
        </Grid>
      </Grid>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <div className="mb-3">
            <input
              className="form-control form-control-lg"
              type="text"
              defaultValue={streamId}
              onChange={handleStreamIdChange}
            />
            <label className="form-label" htmlFor="streamId">
              Enter Stream Id
            </label>
          </div>
        </Grid>
        <Grid item xs={6}>
          {!playing ? (
            <Button variant="primary" disabled={!websocketConnected} onClick={handlePlay}>
              Start Playing
            </Button>
          ) : (
            <Button variant="danger" onClick={handleStopPlaying}>
              Stop Playing
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlayingComponent;