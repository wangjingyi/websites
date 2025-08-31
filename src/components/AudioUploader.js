import React, { useState, useRef } from 'react';

const AudioUploader = ({ onAudioReady, disabled }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    // Check file size (limit to 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onAudioReady(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {!selectedFile ? (
        <div
          className={`upload-area ${dragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📁</div>
          <h3>Upload Audio File</h3>
          <p>Drag and drop an audio file here, or click to browse</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '12px' }}>
            Supported formats: MP3, WAV, M4A, FLAC (Max 25MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="file-input"
            disabled={disabled}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h4>Selected File</h4>
          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '8px', 
            padding: '16px', 
            margin: '16px 0' 
          }}>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
          </div>
          
          <audio controls className="audio-player">
            <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
            Your browser does not support the audio element.
          </audio>

          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleUpload} 
              className="btn btn-primary"
              disabled={disabled}
            >
              ✨ Process with AI
            </button>
            <button 
              onClick={handleRemoveFile} 
              className="btn btn-secondary"
              disabled={disabled}
            >
              🗑️ Remove File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
