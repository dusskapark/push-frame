import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/ui.css';

function App() {
  
  const onClose = () => {
    parent.postMessage({ pluginMessage: { type: 'close' } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div>
      <img src={logo} />
      
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default App;
