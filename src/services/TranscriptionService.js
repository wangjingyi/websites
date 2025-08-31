class TranscriptionService {
  static async transcribeAudio(audioFile) {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      console.log('Starting transcription for file:', audioFile.name, 'Size:', audioFile.size);
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Transcription successful:', result);
      return result.text;
    } catch (error) {
      console.error('Transcription error details:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }
}

export default TranscriptionService;
