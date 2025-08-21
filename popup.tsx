import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import type { Shortcut } from './types';

const DEFAULT_SHORTCUT: Shortcut = { key: 'P', ctrlKey: true, shiftKey: true, altKey: false, metaKey: false };
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const NUMBERS = "0123456789".split('');

const Popup: React.FC = () => {
    const [shortcut, setShortcut] = useState<Shortcut>(DEFAULT_SHORTCUT);

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

    const handleShortcutChange = (part: keyof Shortcut, value: string | boolean) => {
        const newShortcut = { ...shortcut, [part]: value };
        setShortcut(newShortcut);
        try {
            localStorage.setItem('speechToTextShortcut', JSON.stringify(newShortcut));
        } catch (error) {
            console.error("Failed to save shortcut to localStorage", error);
        }
    };

    const formatShortcut = (s: Shortcut): string => {
        let parts = [];
        if (s.metaKey) parts.push('Cmd');
        if (s.ctrlKey) parts.push('Ctrl');
        if (s.altKey) parts.push('Alt');
        if (s.shiftKey) parts.push('Shift');
        parts.push(s.key.toUpperCase());
        return parts.join(' + ');
    }

    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-200 text-center mb-4">تنظیمات میانبر</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={shortcut.ctrlKey} onChange={(e) => handleShortcutChange('ctrlKey', e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-blue-500 rounded focus:ring-blue-500" />
                        Ctrl
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={shortcut.shiftKey} onChange={(e) => handleShortcutChange('shiftKey', e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-blue-500 rounded focus:ring-blue-500" />
                        Shift
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={shortcut.altKey} onChange={(e) => handleShortcutChange('altKey', e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-blue-500 rounded focus:ring-blue-500" />
                        Alt
                    </label>
                </div>
                <select 
                    value={shortcut.key.toUpperCase()} 
                    onChange={(e) => handleShortcutChange('key', e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="کلید اصلی میانبر"
                >
                    <optgroup label="حروف">
                        {ALPHABET.map(key => <option key={key} value={key}>{key}</option>)}
                    </optgroup>
                    <optgroup label="اعداد">
                        {NUMBERS.map(key => <option key={key} value={key}>{key}</option>)}
                    </optgroup>
                </select>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">میانبر فعلی: <strong className="text-cyan-400">{formatShortcut(shortcut)}</strong></p>
        </div>
    );
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount popup to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
