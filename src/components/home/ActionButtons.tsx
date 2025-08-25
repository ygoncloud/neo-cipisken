
'use client';

import React from 'react';

interface ActionButtonsProps {
  feedback: any;
  handleAnalyzeClick: () => void;
  handleClear: () => void;
  cvFile: File | null;
  loading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ feedback, handleAnalyzeClick, handleClear, cvFile, loading }) => {
  return (
    <div className="button-container">
      {!feedback ? (
        <button className="button" onClick={handleAnalyzeClick} disabled={!cvFile || loading}>
          {loading ? 'Analyzing...' : 'Analyze CV'}
        </button>
      ) : (
        <button className="button" onClick={handleClear}>
          Start New Analysis
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
