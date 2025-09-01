class ContentService {
  static async generateContent(transcription) {
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: transcription
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `Content generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Content generation error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}

export default ContentService;
