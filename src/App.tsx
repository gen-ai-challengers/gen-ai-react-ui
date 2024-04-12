import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamDemo from './components/WebcamDemo';
import ImageDemo from './components/ImageDemo';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p> */}
        <WebcamDemo />
      </header>
    </div>
  );
}

export default App;
