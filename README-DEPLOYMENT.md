# Smart Lecture Companion - Deployment Guide

## Quick Deployment Steps

### 1. Frontend Deployment (Netlify)
The React app will be deployed to Netlify for free hosting.

### 2. Backend Deployment Options
Choose one of these services for your Express server:

**Option A: Railway (Recommended)**
- Free tier available
- Easy deployment
- Built-in environment variables

**Option B: Render**
- Free tier available
- Automatic deployments from GitHub

**Option C: Heroku**
- Requires credit card for verification
- More complex setup

### 3. Environment Variables Needed

**For Backend Service:**
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

**For Frontend (Netlify):**
```
REACT_APP_API_URL=https://your-backend-url.railway.app
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
