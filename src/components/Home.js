import React from 'react';
import Logo from './Logo';

const Home = () => {
  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Logo size={100} />
        <h2 style={{ marginTop: '20px' }}>📚 Smart Lecture Companion</h2>
      </div>
      <p>
        Never miss important details from your classes again! Transform your lecture recordings 
        into organized study materials with AI-powered transcription and intelligent summaries. 
        Perfect for students who want to focus on learning while capturing every key point.
      </p>
      
      <h3>How It Works</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎤</div>
          <h4>Record Lectures</h4>
          <p>Capture your teacher's lectures directly or upload existing recordings</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
          <h4>Auto Transcription</h4>
          <p>Convert speech to text with high accuracy, even with technical terms</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✨</div>
          <h4>Smart Summaries</h4>
          <p>Generate organized notes highlighting key concepts and important points</p>
        </div>
        
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📄</div>
          <h4>Study Materials</h4>
          <p>Download professional PDF notes ready for studying and sharing</p>
        </div>
      </div>

      <h3>Perfect for Students</h3>
      <ul style={{ lineHeight: '1.8' }}>
        <li><strong>Focus on Learning</strong> - Listen actively without worrying about missing notes</li>
        <li><strong>High-Quality Recording</strong> - Capture lectures with crystal clear audio</li>
        <li><strong>Multiple Formats</strong> - Upload recordings from any device or app</li>
        <li><strong>Accurate Transcripts</strong> - Get every word, including technical vocabulary</li>
        <li><strong>Organized Summaries</strong> - Key points structured for easy review</li>
        <li><strong>Portable Notes</strong> - Download and access your study materials anywhere</li>
        <li><strong>Secure Access</strong> - Your recordings and notes stay private and secure</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Ready to revolutionize your study routine? Sign in to start creating better notes from your lectures!
        </p>
      </div>
    </div>
  );
};

export default Home;
