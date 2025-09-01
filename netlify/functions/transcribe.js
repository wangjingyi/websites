const FormData = require('form-data');
const fetch = require('node-fetch');

// API Keys from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Retry function with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' })
      };
    }

    // Parse multipart form data from base64
    const body = event.isBase64Encoded ? 
      Buffer.from(event.body, 'base64') : 
      Buffer.from(event.body);

    if (!body || body.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No audio file provided' })
      };
    }

    const transcribeRequest = async () => {
      const formData = new FormData();
      formData.append('file', body, {
        filename: 'audio.webm',
        contentType: 'audio/webm'
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
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    };

    const result = await retryWithBackoff(transcribeRequest);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ transcript: result.text })
    };

  } catch (error) {
    console.error('Transcription error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to transcribe audio',
        details: error.message 
      })
    };
  }
};
