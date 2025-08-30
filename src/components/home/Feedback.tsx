'use client';

import React from 'react';
import FeedbackCard from './FeedbackCard';

interface FeedbackProps {
  feedback: {
    searchability: string | null;
    hardSkills: string | null;
    softSkills: string | null;
    recruiterTips: string | null;
    formatting: string | null;
  } | null;
  handleCopy: (text: string, sectionName: string) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback, handleCopy }) => {
  if (!feedback) {
    return null;
  }

  return (
    <div className="container feedback-section">
      <h2>Feedback Analysis</h2>
      <FeedbackCard
        title="Searchability"
        content={feedback.searchability}
        sectionName="searchability"
        handleCopy={handleCopy}
      />
      <FeedbackCard
        title="Hard Skills"
        content={feedback.hardSkills}
        sectionName="hardSkills"
        handleCopy={handleCopy}
      />
      <FeedbackCard
        title="Soft Skills"
        content={feedback.softSkills}
        sectionName="softSkills"
        handleCopy={handleCopy}
      />
      <FeedbackCard
        title="Recruiter Tips"
        content={feedback.recruiterTips}
        sectionName="recruiterTips"
        handleCopy={handleCopy}
      />
      <FeedbackCard
        title="Formatting"
        content={feedback.formatting}
        sectionName="formatting"
        handleCopy={handleCopy}
      />
    </div>
  );
};

export default Feedback;
