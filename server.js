require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Keys from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Retry function with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error('Error in retryWithBackoff:', error);
      if (attempt === maxRetries - 1) throw error;
      
      // Check if it's a rate limit error
      if (error.status === 429 || error.message.includes('Too Many Requests')) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry for non-rate-limit errors
      }
    }
  }
};

// Transcription endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Received file:', req.file.originalname, 'Size:', req.file.size);
    console.log('Using OpenAI API Key:', OPENAI_API_KEY ? `Present (${OPENAI_API_KEY.substring(0, 20)}...)` : 'Missing');

    const transcribeRequest = async () => {
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API Error - Status: ${response.status}, StatusText: ${response.statusText}`);
        console.error('Error Response Body:', errorText);
        const error = new Error(`Transcription failed: ${response.statusText}`);
        error.status = response.status;
        error.details = errorText;
        throw error;
      }

      return await response.json();
    };

    const result = await retryWithBackoff(transcribeRequest, 3, 2000);
    console.log('Transcription successful');
    res.json({ text: result.text });

  } catch (error) {
    console.error('Transcription error:', error);
    
    if (error.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        details: 'OpenAI API rate limit reached. Consider upgrading your plan for higher limits.'
      });
    } else {
      res.status(error.status || 500).json({ 
        error: error.message || 'Internal server error during transcription',
        details: error.details || error.message
      });
    }
  }
});

// Content generation endpoint
app.post('/api/generate-content', async (req, res) => {
  try {
    const { transcription } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: 'No transcription provided' });
    }

    const generateRequest = async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional summarizer. Create a clear, concise summary of the provided audio transcription. Focus on the main points, key insights, and important details while maintaining the original meaning.'
            },
            {
              role: 'user',
              content: `Please provide a summary of this audio transcription:\n\n${transcription}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`Content generation failed: ${response.statusText}`);
        error.status = response.status;
        error.details = errorText;
        throw error;
      }

      return await response.json();
    };

    const result = await retryWithBackoff(generateRequest, 3, 2000);
    console.log('Content generation successful');
    res.json({ content: result.choices[0].message.content });

  } catch (error) {
    console.error('Content generation error:', error);
    
    if (error.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        details: 'OpenAI API rate limit reached. Consider upgrading your plan for higher limits.'
      });
    } else {
      res.status(error.status || 500).json({ 
        error: error.message || 'Internal server error during content generation',
        details: error.details || error.message
      });
    }
  }
});

// Test OpenAI API key endpoint
app.get('/api/test-openai', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `OpenAI API Error: ${response.statusText}`,
        details: errorText,
        keyStatus: OPENAI_API_KEY ? 'Present' : 'Missing'
      });
    }

    const data = await response.json();
    res.json({ 
      status: 'OpenAI API Key Working',
      modelsCount: data.data?.length || 0,
      keyStatus: 'Valid'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to test OpenAI API',
      details: error.message,
      keyStatus: OPENAI_API_KEY ? 'Present but Error' : 'Missing'
    });
  }
});

// Test Whisper API specifically
app.get('/api/test-whisper', async (req, res) => {
  try {
    // Create a minimal test audio file (silence)
    const testAudio = Buffer.from('UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=', 'base64');
    
    const formData = new FormData();
    formData.append('file', testAudio, {
      filename: 'test.wav',
      contentType: 'audio/wav'
    });
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Whisper API Error: ${response.statusText}`,
        details: errorText,
        whisperStatus: 'Failed'
      });
    }

    const data = await response.json();
    res.json({ 
      status: 'Whisper API Working',
      transcription: data.text,
      whisperStatus: 'Valid'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to test Whisper API',
      details: error.message,
      whisperStatus: 'Error'
    });
  }
});

// Google OAuth config endpoint
app.get('/api/google-config', (req, res) => {
  res.json({ 
    client_id: GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Content Creator API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
