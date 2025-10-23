// Free MyMemory Translation API
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    // Split long text into chunks to avoid API limits (500 char limit)
    const maxChunkSize = 500;
    const chunks: string[] = [];
    
    if (text.length <= maxChunkSize) {
      chunks.push(text);
    } else {
      // Split by sentences to maintain context
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      let currentChunk = '';
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxChunkSize) {
          currentChunk += sentence;
        } else {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        }
      }
      if (currentChunk) chunks.push(currentChunk.trim());
    }
    
    // Translate each chunk with delay to avoid rate limits
    const translatedChunks: string[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const langPair = `${sourceLang}|${targetLang}`;
      
      try {
        const response = await fetch(
          `${MYMEMORY_API}?q=${encodeURIComponent(chunk)}&langpair=${langPair}`
        );
        
        if (!response.ok) {
          console.error('Translation API error:', response.status, response.statusText);
          throw new Error(`Translation request failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.responseData?.translatedText) {
          translatedChunks.push(data.responseData.translatedText);
        } else if (data.responseStatus === 403) {
          throw new Error('Translation API limit reached. Please try again later.');
        } else {
          console.error('Invalid API response:', data);
          // Fallback: return original text if translation fails
          translatedChunks.push(chunk);
        }
        
        // Add small delay between requests to avoid rate limiting
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (err) {
        console.error('Translation chunk error:', err);
        // Fallback: use original text for failed chunks
        translatedChunks.push(chunk);
      }
    }
    
    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text. Please try again.');
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch(
      `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=en|es`
    );
    
    const data = await response.json();
    
    // MyMemory doesn't provide language detection directly
    // This is a simplified approach - in production, you'd use a dedicated API
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
}

// Text-to-Speech using Web Speech API
export function speakText(text: string, lang: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } else {
    throw new Error('Text-to-speech not supported');
  }
}

// Stop speech
export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speech-to-Text using Web Speech API
export function startSpeechRecognition(
  lang: string,
  onResult: (text: string) => void,
  onError?: (error: string) => void
): any {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError?.('Speech recognition not supported');
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError?.(event.error);
  };

  recognition.start();
  return recognition;
}