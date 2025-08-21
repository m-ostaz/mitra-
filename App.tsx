import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PermissionState, SpeechRecognition, Shortcut } from './types';
import BubbleUI from './components/BubbleUI';

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const DEFAULT_SHORTCUT: Shortcut = { key: 'P', ctrlKey: true, shiftKey: true, altKey: false, metaKey: false };

const App: React.FC = () => {
  const [micPermission, setMicPermission] = useState<PermissionState>('prompt');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [activeField, setActiveField] = useState<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [shortcut, setShortcut] = useState<Shortcut>(DEFAULT_SHORTCUT);
  const [copySuccess, setCopySuccess] = useState<string>('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const activeFieldRef = useRef(activeField);

  useEffect(() => {
    activeFieldRef.current = activeField;
  }, [activeField]);
  
  useEffect(() => {
    try {
      const savedShortcut = localStorage.getItem('speechToTextShortcut');
      if (savedShortcut) {
        setShortcut(JSON.parse(savedShortcut));
      }
    } catch (error) {
      console.error("Failed to load shortcut from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setMicPermission('unavailable');
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fa-IR';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.trim();
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(interimTranscript);

      if (finalTranscript && activeFieldRef.current) {
         const element = activeFieldRef.current;
         const currentVal = element.value || '';
         const separator = currentVal.length > 0 && !/\s$/.test(currentVal) ? ' ' : '';
         element.value = currentVal + separator + finalTranscript;
         element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if(event.error === 'not-allowed' || event.error === 'service-not-allowed') setMicPermission('denied');
        setIsListening(false);
    }
    recognitionRef.current = recognition;

    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
        setMicPermission(permissionStatus.state as 'prompt' | 'granted' | 'denied');
        permissionStatus.onchange = () => setMicPermission(permissionStatus.state as 'prompt' | 'granted' | 'denied');
    });

  }, []);
  
  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    const wasListening = isListening;
    setIsListening(!wasListening);

    if (wasListening) {
      recognitionRef.current.stop();
    } else {
      if(micPermission !== 'granted') {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                setMicPermission('granted');
                if (recognitionRef.current) recognitionRef.current.start();
            })
            .catch(() => {
                setMicPermission('denied');
                setIsListening(false);
            });
      } else {
        recognitionRef.current.start();
      }
    }
  }, [isListening, micPermission]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toUpperCase() === shortcut.key.toUpperCase() &&
        event.ctrlKey === shortcut.ctrlKey &&
        event.shiftKey === shortcut.shiftKey &&
        event.altKey === shortcut.altKey &&
        event.metaKey === shortcut.metaKey
      ) {
        event.preventDefault();
        event.stopPropagation();
        handleToggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleToggleListening, shortcut]);
  
  // Listen for any input/textarea field being focused on the page
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            setActiveField(target as HTMLInputElement | HTMLTextAreaElement);
        }
    };
    // We don't use focusout because it makes clicking the bubble buttons difficult.
    // The bubble will remain active as long as some field was focused.
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  const handleCopy = () => {
    if (activeFieldRef.current && activeFieldRef.current.value) {
      navigator.clipboard.writeText(activeFieldRef.current.value)
        .then(() => {
          setCopySuccess('کپی شد!');
          setTimeout(() => setCopySuccess(''), 2000);
        });
    }
  };

  const handleClear = () => {
    if (activeFieldRef.current) {
      activeFieldRef.current.value = '';
      activeFieldRef.current.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      activeFieldRef.current.focus();
    }
  };
  
  return (
    <>
      <BubbleUI 
        isListening={isListening} 
        transcript={transcript}
        permission={micPermission}
        toggleListening={handleToggleListening}
        onCopy={handleCopy}
        onClear={handleClear}
        hasActiveField={!!activeField}
      />
      {copySuccess && (
        <div className="fixed bottom-28 left-8 z-[9999] bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-pulse">
            {copySuccess}
        </div>
      )}
    </>
  );
};

export default App;
