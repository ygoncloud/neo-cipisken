'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

interface FeedbackCardProps {
  title: string;
  content: string | null;
  sectionName: string;
  handleCopy: (text: string, sectionName: string) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ title, content, sectionName, handleCopy }) => {
  if (!content) {
    return null;
  }

  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <h3>{title}</h3>
        <button className="copy-button" onClick={() => handleCopy(content ?? '', sectionName)}>
          Copy
        </button>
      </div>
      <ReactMarkdown>{sanitizedContent}</ReactMarkdown>
    </div>
  );
};

export default React.memo(FeedbackCard);
