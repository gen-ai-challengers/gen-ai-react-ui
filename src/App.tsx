import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamDemo from './components/WebcamDemo';
import WebcamDemo1 from './components/WebcamDemo1';
import ImageDemo from './components/ImageDemo';
import FaceDetection from "./components/faceDetection"
import MediaPipe from "./components/mediaPipe";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MediaPipe/>
        {/* <FaceDetection/> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p> */}
        {/* <WebcamDemo1 /> */}
      </header>
    </div>
  );
}

export default App;
