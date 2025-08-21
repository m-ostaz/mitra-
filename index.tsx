import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('persian-stt-root');
if (!rootElement) {
  console.error("Persian STT extension: Could not find root element to mount to.");
} else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      // StrictMode is disabled because it can cause double-invocation of
      // `useEffect` hooks on mount, which is problematic for listeners.
      <App />
    );
}
