// This script runs in the content script context.
// Its goal is to create a root element on the page and inject our app loader.

// 1. Create a root element for the React app to mount to.
const root = document.createElement('div');
root.id = 'persian-stt-root';
document.body.appendChild(root);

// 2. Inject the loader script into the page's main context.
// This is necessary to use modern ES modules and import maps.
const script = document.createElement('script');
script.src = chrome.runtime.getURL('loader.js');
script.type = 'module';
(document.head || document.documentElement).appendChild(script);
