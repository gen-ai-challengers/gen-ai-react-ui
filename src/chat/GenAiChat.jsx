import { useState } from 'react';
// import './spinner.css';
import Spinner from './Spinner';
function GenAiChat() {
  const [isLoading, setIsLoading] = useState(true);
  const handleLoad = () => {
    setTimeout(setIsLoading(false), 2000);
    // setIsLoading(false)
  };

  return (
    <>
      <div style={{ backgroundColor: 'white', width: '100%', height: '400px', overflow: 'auto' }}>
        {isLoading && <div style={{ width: '100%', height:'400px', textAlign: 'center' }}><Spinner /><br/>Hey there ! Would you like to know more about the product?</div>}
        <iframe width={600} height={600} src="https://genai-2jxxgvah6q-uc.a.run.app/" frameborder="0"
          onLoad={handleLoad}
        ></iframe>
      </div>
    </>
  );
}

export default GenAiChat;