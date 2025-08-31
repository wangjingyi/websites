import React, { useState, useRef } from 'react';

const AudioRecorder = ({ onAudioReady, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setRecordedAudio(audioFile);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const useRecording = () => {
    if (recordedAudio) {
      onAudioReady(recordedAudio);
    }
  };

  const discardRecording = () => {
    setRecordedAudio(null);
    audioChunksRef.current = [];
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {!recordedAudio ? (
        <div>
          {!isRecording ? (
            <button 
              onClick={startRecording} 
              className="btn btn-primary"
              disabled={disabled}
              style={{ fontSize: '1.2rem', padding: '16px 32px' }}
            >
              🎤 Start Recording
            </button>
          ) : (
            <div>
              <div className="recording-indicator">
                <div className="recording-dot"></div>
                Recording in progress...
              </div>
              <button 
                onClick={stopRecording} 
                className="btn btn-danger"
                style={{ fontSize: '1.2rem', padding: '16px 32px', marginTop: '16px' }}
              >
                ⏹️ Stop Recording
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h4>Recording Complete</h4>
          <audio controls className="audio-player">
            <source src={URL.createObjectURL(recordedAudio)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={useRecording} 
              className="btn btn-primary"
              disabled={disabled}
            >
              ✨ Process with AI
            </button>
            <button 
              onClick={discardRecording} 
              className="btn btn-secondary"
              disabled={disabled}
            >
              🗑️ Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
