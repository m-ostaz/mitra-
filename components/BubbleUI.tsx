import React from 'react';
import MicIcon from './icons/MicIcon';
import CopyIcon from './icons/CopyIcon';
import TrashIcon from './icons/TrashIcon';
import type { PermissionState } from '../types';

interface BubbleUIProps {
  isListening: boolean;
  transcript: string;
  permission: PermissionState;
  toggleListening: () => void;
  onCopy: () => void;
  onClear: () => void;
  hasActiveField: boolean;
}

const BubbleUI: React.FC<BubbleUIProps> = ({ isListening, transcript, permission, toggleListening, onCopy, onClear, hasActiveField }) => {
  const isDisabled = permission !== 'granted';
  const showTranscript = isListening && transcript;
  const showActions = (isListening || transcript) && hasActiveField;

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start gap-3">
      {showTranscript && (
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl max-w-sm transition-all duration-300 ease-in-out">
          <p>{transcript}</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          disabled={isDisabled}
          className={`
            relative flex items-center justify-center 
            w-20 h-20 rounded-full 
            shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-75
            transition-all duration-300 ease-in-out
            ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-400'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'
            }
            ${isDisabled ? 'cursor-not-allowed bg-gray-600 opacity-50' : ''}
          `}
          aria-label={isListening ? 'توقف ضبط' : 'شروع ضبط'}
        >
          <MicIcon className={`w-10 h-10 text-white transition-transform duration-300 ${isListening ? 'scale-110' : ''}`} />
          {isListening && (
            <span className="absolute w-20 h-20 rounded-full bg-red-500 opacity-75 animate-ping"></span>
          )}
        </button>

        <div className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${showActions ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
            <button
              onClick={onCopy}
              className="w-12 h-12 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
              title="کپی کردن متن"
              aria-label="کپی کردن متن فیلد فعال"
            >
              <CopyIcon className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={onClear}
              className="w-12 h-12 bg-gray-700 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
              title="پاک کردن فیلد"
              aria-label="پاک کردن متن فیلد فعال"
            >
              <TrashIcon className="w-6 h-6 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default BubbleUI;
