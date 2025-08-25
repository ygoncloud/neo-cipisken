'use client';

import React from 'react';

interface ScoreProps {
  categoryScores: {
    searchability: number | null;
    hardSkills: number | null;
    softSkills: number | null;
    recruiterTips: number | null;
    formatting: number | null;
  } | null;
}

const Score: React.FC<ScoreProps> = ({ categoryScores }) => {
  if (!categoryScores) {
    return null;
  }

  const categories = [
    { name: 'Searchability', key: 'searchability' },
    { name: 'Hard Skills', key: 'hardSkills' },
    { name: 'Soft Skills', key: 'softSkills' },
    { name: 'Recruiter Tips', key: 'recruiterTips' },
    { name: 'Formatting', key: 'formatting' },
  ];

  return (
    <div className="container score-section">
      <div className="score-cards-container">
        {categories.map((category) => {
          const score = categoryScores[category.key as keyof typeof categoryScores];
          const percentage = score !== null ? score : 0;
          const radius = 50;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (percentage / 100) * circumference;

          return (
            <div key={category.key} className="score-card">
              <div className="progress-circle-container">
                <svg className="progress-circle" viewBox="0 0 120 120">
                  <circle
                    className="progress-circle-bg"
                    cx="60"
                    cy="60"
                    r={radius}
                  ></circle>
                  <circle
                    className="progress-circle-progress"
                    cx="60"
                    cy="60"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  ></circle>
                </svg>
                <div className="progress-circle-text">{percentage}%</div>
              </div>
              <p className="score-category-name">{category.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Score;