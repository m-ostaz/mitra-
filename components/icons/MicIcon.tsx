

import React from 'react';

interface MicIconProps {
  className?: string;
}

const MicIcon: React.FC<MicIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm0 12.5a3.5 3.5 0 0 1-3.5-3.5V5a3.5 3.5 0 0 1 7 0v6a3.5 3.5 0 0 1-3.5 3.5Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a8 8 0 0 0 7 7.93V22h2v-2.07A8 8 0 0 0 21 12v-2h-2Z" />
  </svg>
);

export default MicIcon;