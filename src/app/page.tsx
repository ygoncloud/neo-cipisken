'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Customizer from '../components/Customizer';
import ReactMarkdown from 'react-markdown';

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
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customStyles, setCustomStyles] = useState({
    primaryColor: 'oklch(72.27% 0.1894 50.19)', // Orange
    backgroundColor: 'oklch(95.38% 0.0357 72.89)', // Orange
    borderRadius: 8,
    boxShadowHorizontal: 4,
    boxShadowVertical: 4,
    headingFontWeight: 700,
    baseFontWeight: 400,
  });

  const backgroundColorMap: { [key: string]: string } = {
    'oklch(67.28% 0.2147 24.22)': 'oklch(93.3% 0.0339 17.77)', // Red
    'oklch(72.27% 0.1894 50.19)': 'oklch(95.38% 0.0357 72.89)', // Orange
    'oklch(84.08% 0.1725 84.2)': 'oklch(96.22% 0.0569 95.61)', // Amber
    'oklch(86.03% 0.176 92.36)': 'oklch(96.79% 0.0654 102.26)', // Yellow
    'oklch(83.29% 0.2331 132.51)': 'oklch(95.37% 0.0549 125.19)', // Lime
    'oklch(79.76% 0.2044 153.08)': 'oklch(96.47% 0.0401 157.79)', // Green
    'oklch(77.54% 0.1681 162.78)': 'oklch(95.31% 0.0496 169.04)', // Emerald
    'oklch(78.57% 0.1422 180.36)':'oklch(95.08% 0.0481 184.07)', // Teal
    'oklch(76.89% 0.139164 219.13)':'oklch(94.61% 0.043 211.12)', // Cyan
    'oklch(66.9% 0.18368 248.8066)':'oklch(94.27% 0.0268 242.57)', // Sky
    'oklch(67.47% 0.1726 259.49)':'oklch(93.46% 0.0305 255.11)', // Blue
    'oklch(66.34% 0.1806 277.2)':'oklch(92.13% 0.0388 282.36)', // Indigo
    'oklch(70.28% 0.1753 295.36)':'oklch(93.88% 0.033 300.19)', // Violet
    'oklch(71.9% 0.198 310.03)':'oklch(94.11% 0.036556 308.0303)', // Purple
    'oklch(73.43% 0.2332 321.41)':'oklch(94.79% 0.0407 320.6)', // Fuchsia
    'oklch(71.5% 0.197 354.23)':'oklch(95.16% 0.0242 343.23)', // Pink
    'oklch(70.79% 0.1862 16.25)':'oklch(93.37% 0.0339 12.05)', // Rose
    // Add other primary color to background color mappings here
  };

  useEffect(() => {
    const newBackgroundColor = backgroundColorMap[customStyles.primaryColor] || 'oklch(94.79% 0.0407 320.6)'; // Default color
    document.body.style.backgroundColor = newBackgroundColor;
  }, [customStyles.primaryColor]);

  

  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Invalid file type. Please upload a PDF file.');
        setCvFile(null);
      } else {
        setCvFile(file);
        setError(null);
      }
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
    n}

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

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

    } catch (error: any) {
      console.error('Error caught:', error);
      setError(error.message || 'Error uploading file or getting feedback.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    setCvFile(null);
    setJobDescription('');
    setFeedback(null);
    setScore(null);
  };

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(sectionName);
      setTimeout(() => {
        setCopiedSection(null);
      }, 2000);
    });
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        setError('Invalid file type. Please upload a PDF file.');
        setCvFile(null);
      } else {
        setCvFile(file);
        setError(null);
      }
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
        <div className="card-corner-image"></div>
        <h1>Cipisken AI CV Analyzer</h1>
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

        {error && <p className="error-message">{error}</p>}

        <textarea
          className="job-description-area"
          placeholder="Paste the job description here (optional)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

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
              <div className="feedback-card-header">
                <h3>Searchability</h3>
                <button className="copy-button" onClick={() => handleCopy(feedback.searchability ?? '', 'searchability')}>
                  {copiedSection === 'searchability' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ReactMarkdown>{feedback.searchability}</ReactMarkdown>
            </div>
          )}
          {feedback.hardSkills && (
            <div className="feedback-card">
              <div className="feedback-card-header">
                <h3>Hard Skills</h3>
                <button className="copy-button" onClick={() => handleCopy(feedback.hardSkills ?? '', 'hardSkills')}>
                  {copiedSection === 'hardSkills' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ReactMarkdown>{feedback.hardSkills}</ReactMarkdown>
            </div>
          )}
          {feedback.softSkills && (
            <div className="feedback-card">
              <div className="feedback-card-header">
                <h3>Soft Skills</h3>
                <button className="copy-button" onClick={() => handleCopy(feedback.softSkills ?? '', 'softSkills')}>
                  {copiedSection === 'softSkills' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ReactMarkdown>{feedback.softSkills}</ReactMarkdown>
            </div>
          )}
          {feedback.recruiterTips && (
            <div className="feedback-card">
              <div className="feedback-card-header">
                <h3>Recruiter Tips</h3>
                <button className="copy-button" onClick={() => handleCopy(feedback.recruiterTips ?? '', 'recruiterTips')}>
                  {copiedSection === 'recruiterTips' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ReactMarkdown>{feedback.recruiterTips}</ReactMarkdown>
            </div>
          )}
          {feedback.formatting && (
            <div className="feedback-card">
              <div className="feedback-card-header">
                <h3>Formatting</h3>
                <button className="copy-button" onClick={() => handleCopy(feedback.formatting ?? '', 'formatting')}>
                  {copiedSection === 'formatting' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ReactMarkdown>{feedback.formatting}</ReactMarkdown>
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
