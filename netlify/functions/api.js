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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;

  try {
    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'OK', message: 'AI Content Creator API is running' })
      };
    }

    // Generate content endpoint
    if (path === '/generate' && method === 'POST') {
      const { transcript } = JSON.parse(event.body);

      if (!transcript) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No transcript provided' })
        };
      }

      if (!OPENAI_API_KEY) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'OpenAI API key not configured' })
        };
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
                content: `Please summarize this transcript: ${transcript}`
              }
            ],
            max_tokens: 1000,
            temperature: 0.3
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        return await response.json();
      };

      const result = await retryWithBackoff(generateRequest);
      const summary = result.choices[0].message.content;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ summary })
      };
    }

    // Google OAuth config endpoint
    if (path === '/auth/google/config' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          project_id: process.env.GOOGLE_PROJECT_ID
        })
      };
    }

    // 404 for unmatched routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};
