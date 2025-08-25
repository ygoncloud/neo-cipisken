
'use client';

import React, { useCallback } from 'react';

interface FileUploadProps {
  cvFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ cvFile, onFileChange, onDrop, error }) => {
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={onFileChange}
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
    </>
  );
};

export default FileUpload;
