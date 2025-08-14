'use client';

import React, { useState, useCallback } from 'react';
import Customizer from '../components/Customizer';

export default function Home() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState<{
    searchability: string | null;
    hardSkills: string | null;
    softSkills: string | null;
    recruiterTips: string | null;
    formatting: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customStyles, setCustomStyles] = useState({
    primaryColor: '#007bff',
    borderRadius: 8,
    boxShadowHorizontal: 0,
    boxShadowVertical: 4,
    headingFontWeight: 700,
    baseFontWeight: 400,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCvFile(event.target.files[0]);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!cvFile) {
      alert('Please upload a CV.');
      return;
    }

    setLoading(true);
    setFeedback(null);
    setScore(null);
    let accumulatedText = '';

    const formData = new FormData();
    formData.append('cv', cvFile);
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        accumulatedText += decoder.decode(value, { stream: true });

        const scoreMatch = accumulatedText.match(/(\d+)\/100/);
        if (scoreMatch) {
          setScore(parseInt(scoreMatch[1], 10));
        }

        const searchabilityMatch = accumulatedText.match(/\*\*Searchability:\*\*\n(.*?)(?=\*\*Hard Skills:\*\*|\*\*Soft Skills:\*\*|\*\*Recruiter Tips:\*\*|\*\*Formatting:\*\*|$)/s);
        const hardSkillsMatch = accumulatedText.match(/\*\*Hard Skills:\*\*\n(.*?)(?=\*\*Soft Skills:\*\*|\*\*Recruiter Tips:\*\*|\*\*Formatting:\*\*|$)/s);
        const softSkillsMatch = accumulatedText.match(/\*\*Soft Skills:\*\*\n(.*?)(?=\*\*Recruiter Tips:\*\*|\*\*Formatting:\*\*|$)/s);
        const recruiterTipsMatch = accumulatedText.match(/\*\*Recruiter Tips:\*\*\n(.*?)(?=\*\*Formatting:\*\*|$)/s);
        const formattingMatch = accumulatedText.match(/\*\*Formatting:\*\*\n(.*?)$/s);

        setFeedback({
          searchability: searchabilityMatch ? searchabilityMatch[1].trim() : '',
          hardSkills: hardSkillsMatch ? hardSkillsMatch[1].trim() : '',
          softSkills: softSkillsMatch ? softSkillsMatch[1].trim() : '',
          recruiterTips: recruiterTipsMatch ? recruiterTipsMatch[1].trim() : '',
          formatting: formattingMatch ? formattingMatch[1].trim() : '',
        });
      }

    } catch (error) {
      console.error(error);
      alert('Error uploading file or getting feedback.');
    }
    setLoading(false);
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setCvFile(event.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleStyleChange = (styleName: string, value: any) => {
    setCustomStyles(prevStyles => ({
      ...prevStyles,
      [styleName]: value,
    }));
  };

  const appStyle = {
    '--primary-color': customStyles.primaryColor,
    '--border-radius': `${customStyles.borderRadius}px`,
    '--box-shadow': `${customStyles.boxShadowHorizontal}px ${customStyles.boxShadowVertical}px 10px rgba(0, 0, 0, 0.1)`,
    '--heading-font-weight': customStyles.headingFontWeight,
    '--base-font-weight': customStyles.baseFontWeight,
  } as React.CSSProperties;

  return (
    <div className="App" style={appStyle}>
      <div className="container">
        <h1>AI CV Feedback</h1>
        <p>Upload your CV to get instant feedback from our AI assistant.</p>
        
        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept=".pdf"
        />
        
        <div 
          className="file-upload-area"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {cvFile ? `Selected File: ${cvFile.name}` : 'Drag & drop your CV here, or click to select a file'}
        </div>

        <textarea
          className="job-description-area"
          placeholder="Paste the job description here (optional)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button className="button" onClick={handleAnalyzeClick} disabled={!cvFile || loading}>
          {loading ? 'Analyzing...' : 'Analyze CV'}
        </button>
      </div>

      {score !== null && (
        <div className="container feedback-section">
          <h2>ATS Compatibility Score: {score}/100</h2>
        </div>
      )}

      {feedback && (
        <div className="container feedback-section">
          <h2>Feedback Analysis</h2>
          {feedback.searchability && (
            <div className="feedback-card">
              <h3>Searchability</h3>
              <p>{feedback.searchability}</p>
            </div>
          )}
          {feedback.hardSkills && (
            <div className="feedback-card">
              <h3>Hard Skills</h3>
              <p>{feedback.hardSkills}</p>
            </div>
          )}
          {feedback.softSkills && (
            <div className="feedback-card">
              <h3>Soft Skills</h3>
              <p>{feedback.softSkills}</p>
            </div>
          )}
          {feedback.recruiterTips && (
            <div className="feedback-card">
              <h3>Recruiter Tips</h3>
              <p>{feedback.recruiterTips}</p>
            </div>
          )}
          {feedback.formatting && (
            <div className="feedback-card">
              <h3>Formatting</h3>
              <p>{feedback.formatting}</p>
            </div>
          )}
        </div>
      )}

      <button
        className="customize-button"
        onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
      >
        {isCustomizerOpen ? 'Close Customizer' : 'Open Customizer'}
      </button>

      <Customizer 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
        styles={customStyles}
        onStyleChange={handleStyleChange}
      />
    </div>
  );
}