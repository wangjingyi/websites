# Smart Lecture Companion - Deployment Guide

## Quick Deployment Steps

### 1. Frontend Deployment (Netlify)
The React app will be deployed to Netlify for free hosting.
host url: https://lectureai.netlify.app

### 2. Backend Deployment Options
deploy to render.com
host url: https://ai-content-creator-api.onrender.com

### 3. Environment Variables Needed

**For Backend Service:**
```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production

```

**For Frontend (Netlify):**
```
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### 4. Post-Deployment Steps
1. Update the backend URL in netlify.toml
2. Test the application
3. Configure custom domain (optional)

## Important Notes
- Keep your OpenAI API key secure
- The frontend will be served from Netlify
- The backend will handle API requests
- CORS is already configured for cross-origin requests
