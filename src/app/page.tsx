
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Customizer from '../components/Customizer';
import Image from 'next/image';
import FileUpload from '../components/home/FileUpload';
import JobDescription from '../components/home/JobDescription';
import ActionButtons from '../components/home/ActionButtons';
import Score from '../components/home/Score';
import Feedback from '../components/home/Feedback';
import { backgroundColorMap } from '../lib/colors';

export default function Home() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState<{
    searchability: string | null;
    hardSkills: string | null;
    softSkills: string | null;
    recruiterTips: string | null;
    formatting: string | null;
    categoryScores?: {
      searchability: number | null;
      hardSkills: number | null;
      softSkills: number | null;
      recruiterTips: number | null;
      formatting: number | null;
    };
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
    setError(null);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }

      setScore(data.score);
      setFeedback({
        ...data.feedback,
        categoryScores: data.categoryScores
      });

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
    setError(null);
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
      <header className="main-header">
        <div className="website-logo-container">
          <Image
            src="/logo.jpeg"
            alt="Website Logo"
            width={80}
            height={80}
            className="website-logo"
          />
        </div>
        <h1>Cipisken AI CV Analyzer</h1>
      </header>
      <div className="container">
        <div
          className="card-corner-image"
        >
          <Image
            src="/anya.jpeg"
            alt="Anya"
            width={150}
            height={150}
            className="anya-image"
          />
        </div>
        
        <p>Upload your CV to get instant feedback from our AI assistant.</p>
        
        <FileUpload 
          cvFile={cvFile} 
          onFileChange={handleFileChange} 
          onDrop={onDrop} 
          error={error} 
        />

        <JobDescription 
          jobDescription={jobDescription} 
          onJobDescriptionChange={(e) => setJobDescription(e.target.value)} 
        />

        <ActionButtons 
          feedback={feedback} 
          handleAnalyzeClick={handleAnalyzeClick} 
          handleClear={handleClear} 
          cvFile={cvFile} 
          loading={loading} 
        />

        </div>

      <Score categoryScores={feedback?.categoryScores} />

      <Feedback 
        feedback={feedback} 
        copiedSection={copiedSection} 
        handleCopy={handleCopy} 
      />

      <div className="customizer-container">
        <Image
          src={isCustomizerOpen ? "/logo.jpeg" : "/button.jpeg"}
          alt="Customizer"
          width={100}
          height={100}
          className="customizer-image"
          onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
        />
        <button
          className="customize-button"
          onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
        >
          {isCustomizerOpen ? 'Close' : 'Customize'}
        </button>
      </div>

      <Customizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        primaryColor={customStyles.primaryColor}
        borderRadius={customStyles.borderRadius}
        boxShadowHorizontal={customStyles.boxShadowHorizontal}
        boxShadowVertical={customStyles.boxShadowVertical}
        headingFontWeight={customStyles.headingFontWeight}
        baseFontWeight={customStyles.baseFontWeight}
        onStyleChange={handleStyleChange}
      />
    </div>
  );
}
