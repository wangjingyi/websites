import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ContentCreator from './components/ContentCreator';
import GoogleAuth from './components/GoogleAuth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    window.google?.accounts?.id?.disableAutoSelect();
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>AI Content Creator</h1>
            <p>Transform your audio into engaging content with AI</p>
            
            <nav className="nav">
              <button 
                className={window.location.pathname === '/' ? 'active' : ''}
                onClick={() => window.location.href = '/'}
              >
                Home
              </button>
              {isAuthenticated && (
                <button 
                  className={window.location.pathname === '/create' ? 'active' : ''}
                  onClick={() => window.location.href = '/create'}
                >
                  Create Content
                </button>
              )}
            </nav>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                  <img 
                    src={user?.picture} 
                    alt={user?.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                  <span style={{ color: 'white', fontSize: '1.1rem' }}>Welcome, {user?.name}!</span>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'white', marginBottom: '16px', fontSize: '1.1rem' }}>
                    Sign in to start creating content from your audio
                  </p>
                  <GoogleAuth onLogin={handleLogin} />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/create" 
              element={
                isAuthenticated ? (
                  <ContentCreator user={user} />
                ) : (
                  <div className="card">
                    <h2>Authentication Required</h2>
                    <p>Please log in with Google to access the content creation features.</p>
                  </div>
                )
              } 
            />
            <Route path="/oauth2callback" element={<div>Processing authentication...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
