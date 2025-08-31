# AI Content Creator

## Project Overview

This React application transforms audio recordings into engaging, professional content using AI. It leverages OpenAI's Whisper API for accurate speech-to-text transcription and GPT for intelligent content generation and summarization.

## Features

- **Google Authentication** - Secure login with Google OAuth
- **Audio Recording** - Record directly in the browser with high-quality audio capture
- **File Upload** - Support for various audio formats (MP3, WAV, M4A, FLAC)
- **AI Transcription** - Powered by OpenAI Whisper for accurate speech-to-text
- **Content Generation** - GPT-powered content creation and summarization
- **PDF Export** - Download generated content as formatted PDF documents
- **Modern UI** - Beautiful, responsive design with intuitive user experience

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Google OAuth credentials (already configured)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Getting OpenAI API Key

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the key and add it to your `.env` file

### Google Authentication

The Google OAuth is already configured with:
- **Client ID:** Set in environment variables (see .env.example)
- **Redirect URI:** `http://localhost:3000/oauth2callback`
- **JavaScript Origins:** `http://localhost:3000`

For production deployment, add `REACT_APP_GOOGLE_CLIENT_ID` to your hosting platform's environment variables.

## Usage

1. **Sign In:** Click "Sign in with Google" to authenticate
2. **Record or Upload:** Choose to record audio directly or upload an audio file
3. **AI Processing:** The app will automatically transcribe and generate content
4. **Download:** Export your generated content as a PDF

## Technology Stack

- **Frontend:** React 18, React Router
- **Authentication:** Google OAuth 2.0
- **AI Services:** OpenAI Whisper (transcription), OpenAI GPT (content generation)
- **PDF Generation:** jsPDF
- **Styling:** Custom CSS with modern design patterns

## Project Structure

```
src/
├── components/
│   ├── AudioRecorder.js      # Browser-based audio recording
│   ├── AudioUploader.js      # File upload functionality
│   ├── ContentCreator.js     # Main content creation interface
│   ├── GoogleAuth.js         # Google OAuth integration
│   ├── Home.js              # Landing page
│   └── PDFGenerator.js      # PDF export functionality
├── services/
│   ├── ContentService.js    # OpenAI GPT integration
│   └── TranscriptionService.js # OpenAI Whisper integration
├── App.js                   # Main application component
├── App.css                  # Application styles
├── index.js                 # Application entry point
└── index.css               # Global styles
```

## API Integration

### OpenAI Whisper (Transcription)
- Endpoint: `https://api.openai.com/v1/audio/transcriptions`
- Model: `whisper-1`
- Supports multiple audio formats

### OpenAI GPT (Content Generation)
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-3.5-turbo`
- Optimized for content creation and summarization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
