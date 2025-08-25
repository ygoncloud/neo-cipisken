
'use client';

import React from 'react';

interface ScoreProps {
  score: number | null;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  if (score === null) {
    return null;
  }

  return (
    <div className="container feedback-section">
      <h2>ATS Compatibility Score: {score}/100</h2>
    </div>
  );
};

export default Score;
