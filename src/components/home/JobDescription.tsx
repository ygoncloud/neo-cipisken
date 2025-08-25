
'use client';

import React from 'react';

interface JobDescriptionProps {
  jobDescription: string;
  onJobDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ jobDescription, onJobDescriptionChange }) => {
  return (
    <textarea
      className="job-description-area"
      placeholder="Paste the job description here (optional)"
      value={jobDescription}
      onChange={onJobDescriptionChange}
    />
  );
};

export default JobDescription;
