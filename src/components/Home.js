import React from 'react';

const Home = () => {
  return (
    <div className="card">
      <h2>Welcome to AI Content Creator</h2>
      <p>
        Transform your audio recordings into engaging, professional content using the power of AI.
        Our platform leverages OpenAI's cutting-edge Whisper and GPT technologies to help you create
        high-quality written content from your spoken ideas.
      </p>
      
      <h3>How It Works</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎤</div>
          <h4>Record or Upload</h4>
          <p>Record audio directly in your browser or upload existing audio files</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
          <h4>AI Transcription</h4>
          <p>OpenAI Whisper converts your audio into accurate text transcription</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✨</div>
          <h4>Content Generation</h4>
          <p>GPT transforms your transcription into polished, engaging content</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📄</div>
          <h4>Download PDF</h4>
          <p>Export your generated content as a professional PDF document</p>
        </div>
      </div>

      <h3>Features</h3>
      <ul style={{ lineHeight: '1.8' }}>
        <li><strong>Google Authentication</strong> - Secure login with your Google account</li>
        <li><strong>Audio Recording</strong> - Record directly in your browser with high quality</li>
        <li><strong>File Upload</strong> - Support for various audio formats</li>
        <li><strong>AI Transcription</strong> - Powered by OpenAI Whisper for accurate speech-to-text</li>
        <li><strong>Content Summarization</strong> - GPT-powered content generation and summarization</li>
        <li><strong>PDF Export</strong> - Download your content as a formatted PDF</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Ready to transform your ideas into content? Sign in with Google to get started!
        </p>
      </div>
    </div>
  );
};

export default Home;
