
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
import { Toaster, toast } from 'react-hot-toast';
import NeobrutalismToast from '../components/NeobrutalismToast';

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
    const savedStyles = localStorage.getItem('customStyles');
    if (savedStyles) {
      setCustomStyles(JSON.parse(savedStyles));
    }
  }, []);

  useEffect(() => {
    const newBackgroundColor = backgroundColorMap[customStyles.primaryColor] || 'oklch(94.79% 0.0407 320.6)'; // Default color
    document.body.style.backgroundColor = newBackgroundColor;
  }, [customStyles.primaryColor]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.custom((t) => (
          <NeobrutalismToast t={t} message="Invalid file type. Please upload a PDF file." type="error" />
        ));
        setCvFile(null);
      } else {
        setCvFile(file);
        setError(null);
      }
    }
  };

  const handleAnalyzeClick = async () => {
    if (!cvFile) {
      toast.custom((t) => (
        <NeobrutalismToast t={t} message="Please upload a CV." type="error" />
      ));
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

      if (response.status === 413) {
        throw new Error("File size exceeds the server's limit. Please upload a smaller file.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }

      setScore(data.score);
      setFeedback({
        ...data.feedback,
        categoryScores: data.categoryScores
      });
      toast.custom((t) => (
        <NeobrutalismToast t={t} message="Analysis complete!" type="success" />
      ));

    } catch (error: any) {
      console.error('Error caught:', error);
      if (error instanceof SyntaxError) {
          toast.custom((t) => (
              <NeobrutalismToast t={t} message="The server returned an unexpected response. Please try again." type="error" />
          ));
      } else {
          toast.custom((t) => (
              <NeobrutalismToast t={t} message={error.message || 'Error uploading file or getting feedback.'} type="error" />
          ));
      }
    }
    setLoading(false);
  };

  const handleClear = () => {
    setCvFile(null);
    setJobDescription('');
    setFeedback(null);
    setScore(null);
    setError(null);
    toast.custom((t) => (
      <NeobrutalismToast t={t} message="Analysis cleared." type="default" />
    ));
  };

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.custom((t) => (
        <NeobrutalismToast t={t} message={`Copied ${sectionName} to clipboard!`} type="success" />
      ));
    });
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        toast.custom((t) => (
          <NeobrutalismToast t={t} message="Invalid file type. Please upload a PDF file." type="error" />
        ));
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

  const handleResetStyles = () => {
    setCustomStyles(DEFAULT_STYLES);
    toast.custom((t) => (
      <NeobrutalismToast t={t} message="Styles reset to default." type="default" />
    ));
  };

  const handleSaveStyles = () => {
    localStorage.setItem('customStyles', JSON.stringify(customStyles));
    toast.custom((t) => (
      <NeobrutalismToast t={t} message="Styles saved!" type="success" />
    ));
  };

  const appStyle = {
    '--primary-color': customStyles.primaryColor,
    '--border-radius': `${customStyles.borderRadius}px`,
    '--box-shadow': `${customStyles.boxShadowHorizontal}px ${customStyles.boxShadowVertical}px 10px rgba(0, 0, 0, 0.1)`,
    '--heading-font-weight': customStyles.headingFontWeight,
    '--base-font-weight': customStyles.baseFontWeight,
  } as React.CSSProperties;

  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('/api/carousel');
        const data = await response.json();
        if (data.images) {
          setCarouselImages(data.images);
        }
      } catch (error) {
        console.error('Failed to fetch carousel images:', error);
      }
    };

    fetchCarouselImages();
  }, []);

  useEffect(() => {
    if (carouselImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  return (
    <div className="App" style={appStyle}>
      <Toaster />
      <header className="main-header">
        <div className="website-logo-container">
          <Image
            src="/logo.png"
            alt="Website Logo"
            width={80}
            height={80}
            className="website-logo"
          />
        </div>
        <h1>Cipisken AI CV Analyzer</h1>
        <div className="header-buttons">
          <a href="https://github.com/ygoncloud/neo-cipisken" target="_blank" rel="noopener noreferrer" className="header-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://twitter.com/ygoncloud" target="_blank" rel="noopener noreferrer" className="header-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
        </div>
      </header>
      <div className="container">
        <div
          className="card-corner-image"
        >
          {carouselImages.length > 0 && (
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
              <Image
                src={carouselImages[currentImageIndex]}
                alt="Decorative image"
                width={150}
                height={150}
                className="anya-image"
                priority={currentImageIndex === 0}
              />
            </a>
          )}
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

      <Score categoryScores={feedback?.categoryScores || null} />

      <Feedback 
        feedback={feedback} 
        handleCopy={handleCopy} 
      />

      <div className="customizer-container">
        <button className="button" onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}>
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
        onReset={handleResetStyles}
        onSave={handleSaveStyles}
      />
    </div>
  );
}

const DEFAULT_STYLES = {
  primaryColor: 'oklch(72.27% 0.1894 50.19)', // Orange
  backgroundColor: 'oklch(95.38% 0.0357 72.89)', // Orange
  borderRadius: 8,
  boxShadowHorizontal: 4,
  boxShadowVertical: 4,
  headingFontWeight: 700,
  baseFontWeight: 400,
};
