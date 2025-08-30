'use client';

import React from 'react';
import { Toast } from 'react-hot-toast';

interface NeobrutalismToastProps {
  t: Toast;
  message: string;
  type: 'success' | 'error' | 'default';
}

const NeobrutalismToast: React.FC<NeobrutalismToastProps> = ({ t, message, type }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4ade80'; // green-400
      case 'error':
        return '#f87171'; // red-400
      default:
        return '#facc15'; // yellow-400
    }
  };

  return (
    <div
      className={`neobrutalism-toast ${t.visible ? 'animate-enter' : 'animate-leave'}`}
      style={{
        backgroundColor: getBackgroundColor(),
        border: '2px solid black',
        boxShadow: '4px 4px 0px black',
        borderRadius: '8px',
        padding: '16px',
        color: 'black',
        fontWeight: 'bold',
      }}
    >
      {message}
    </div>
  );
};

export default NeobrutalismToast;
