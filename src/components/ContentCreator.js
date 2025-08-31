import React, { useState, useRef } from 'react';
import AudioRecorder from './AudioRecorder';
import AudioUploader from './AudioUploader';
import TranscriptionService from '../services/TranscriptionService';
import ContentService from '../services/ContentService';
import PDFGenerator from './PDFGenerator';

const ContentCreator = ({ user }) => {
  const [activeTab, setActiveTab] = useState('record');
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleAudioReady = async (file) => {
    setAudioFile(file);
    setError('');
    setIsProcessing(true);
    setProgress(25);

    try {
      // Step 1: Transcribe audio
      setProgress(50);
      const transcriptionResult = await TranscriptionService.transcribeAudio(file);
      setTranscription(transcriptionResult);
      setProgress(75);

      // Step 2: Generate content
      const contentResult = await ContentService.generateContent(transcriptionResult);
      setGeneratedContent(contentResult);
      setProgress(100);
    } catch (err) {
      setError(`Error processing audio: ${err.message}`);
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setTranscription('');
    setGeneratedContent('');
    setError('');
    setProgress(0);
  };

  return (
    <div className="content-creator">
      <div className="card">
        <h2>Create Content from Audio</h2>
        <p>Welcome, {user?.name}! Choose how you'd like to provide your audio:</p>

        <div className="nav" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
          <button 
            className={activeTab === 'record' ? 'active' : ''}
            onClick={() => setActiveTab('record')}
          >
            Record Audio
          </button>
          <button 
            className={activeTab === 'upload' ? 'active' : ''}
            onClick={() => setActiveTab('upload')}
          >
            Upload File
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {isProcessing && (
          <div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p style={{ textAlign: 'center' }}>
              {progress <= 25 && 'Preparing audio...'}
              {progress > 25 && progress <= 50 && 'Transcribing with AI...'}
              {progress > 50 && progress <= 75 && 'Creating summary...'}
              {progress > 75 && 'Finalizing...'}
            </p>
          </div>
        )}

        <div className="audio-controls">
          {activeTab === 'record' ? (
            <AudioRecorder 
              onAudioReady={handleAudioReady}
              onDiscard={handleReset}
              disabled={isProcessing}
            />
          ) : (
            <AudioUploader 
              onAudioReady={handleAudioReady}
              onDiscard={handleReset}
              disabled={isProcessing}
            />
          )}
        </div>


        {transcription && (
          <div className="card">
            <h3>Transcription</h3>
            <div className="transcription-box">
              {transcription}
            </div>
          </div>
        )}

        {generatedContent && (
          <div className="card">
            <h3>Audio Summary</h3>
            <div className="content-preview">
              {generatedContent}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <PDFGenerator content={generatedContent} title="Audio Summary" />
              <button onClick={handleReset} className="btn btn-secondary">
                Create New Summary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCreator;
