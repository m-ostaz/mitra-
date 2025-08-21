// This script runs in the main page context.
// It sets up the environment for our React app to run.

// 1. Create the import map so the browser knows where to find "react" and "react-dom".
const importMap = {
  "imports": {
    "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
    "react/": "https://esm.sh/react@^19.1.1/",
    "react": "https://esm.sh/react@^19.1.1"
  }
};

const im = document.createElement('script');
im.type = 'importmap';
im.textContent = JSON.stringify(importMap);
// Append to head to ensure it's processed before other modules.
document.head.appendChild(im);

// 2. Now that the import map is ready, load the main application script.
const mainScript = document.createElement('script');
mainScript.src = chrome.runtime.getURL('index.tsx');
mainScript.type = 'module';
document.head.appendChild(mainScript);
