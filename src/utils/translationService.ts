// Manual translation dictionary for common words and phrases
const translationDictionary: Record<string, Record<string, string>> = {
  // English to Spanish
  'en-es': {
    'hello': 'hola',
    'goodbye': 'adiós',
    'thank you': 'gracias',
    'please': 'por favor',
    'yes': 'sí',
    'no': 'no',
    'good morning': 'buenos días',
    'good night': 'buenas noches',
    'how are you': 'cómo estás',
    'i love you': 'te amo',
    'welcome': 'bienvenido',
    'friend': 'amigo',
    'family': 'familia',
    'water': 'agua',
    'food': 'comida',
    'book': 'libro',
    'house': 'casa',
    'car': 'coche',
    'time': 'tiempo',
    'day': 'día',
    'night': 'noche',
    'week': 'semana',
    'month': 'mes',
    'year': 'año'
  },
  // Spanish to English
  'es-en': {
    'hola': 'hello',
    'adiós': 'goodbye',
    'gracias': 'thank you',
    'por favor': 'please',
    'sí': 'yes',
    'no': 'no',
    'buenos días': 'good morning',
    'buenas noches': 'good night',
    'cómo estás': 'how are you',
    'te amo': 'i love you',
    'bienvenido': 'welcome',
    'amigo': 'friend',
    'familia': 'family',
    'agua': 'water',
    'comida': 'food',
    'libro': 'book',
    'casa': 'house',
    'coche': 'car',
    'tiempo': 'time',
    'día': 'day',
    'noche': 'night',
    'semana': 'week',
    'mes': 'month',
    'año': 'year'
  },
  // English to French
  'en-fr': {
    'hello': 'bonjour',
    'goodbye': 'au revoir',
    'thank you': 'merci',
    'please': 's\'il vous plaît',
    'yes': 'oui',
    'no': 'non',
    'good morning': 'bonjour',
    'good night': 'bonne nuit',
    'how are you': 'comment allez-vous',
    'i love you': 'je t\'aime',
    'welcome': 'bienvenue',
    'friend': 'ami',
    'family': 'famille',
    'water': 'eau',
    'food': 'nourriture',
    'book': 'livre',
    'house': 'maison',
    'car': 'voiture',
    'time': 'temps',
    'day': 'jour',
    'night': 'nuit',
    'week': 'semaine',
    'month': 'mois',
    'year': 'année'
  },
  // French to English
  'fr-en': {
    'bonjour': 'hello',
    'au revoir': 'goodbye',
    'merci': 'thank you',
    's\'il vous plaît': 'please',
    'oui': 'yes',
    'non': 'no',
    'bonne nuit': 'good night',
    'comment allez-vous': 'how are you',
    'je t\'aime': 'i love you',
    'bienvenue': 'welcome',
    'ami': 'friend',
    'famille': 'family',
    'eau': 'water',
    'nourriture': 'food',
    'livre': 'book',
    'maison': 'house',
    'voiture': 'car',
    'temps': 'time',
    'jour': 'day',
    'nuit': 'night',
    'semaine': 'week',
    'mois': 'month',
    'année': 'year'
  },
  // English to German
  'en-de': {
    'hello': 'hallo',
    'goodbye': 'auf wiedersehen',
    'thank you': 'danke',
    'please': 'bitte',
    'yes': 'ja',
    'no': 'nein',
    'good morning': 'guten morgen',
    'good night': 'gute nacht',
    'how are you': 'wie geht es dir',
    'i love you': 'ich liebe dich',
    'welcome': 'willkommen',
    'friend': 'freund',
    'family': 'familie',
    'water': 'wasser',
    'food': 'essen',
    'book': 'buch',
    'house': 'haus',
    'car': 'auto',
    'time': 'zeit',
    'day': 'tag',
    'night': 'nacht',
    'week': 'woche',
    'month': 'monat',
    'year': 'jahr'
  },
  // German to English
  'de-en': {
    'hallo': 'hello',
    'auf wiedersehen': 'goodbye',
    'danke': 'thank you',
    'bitte': 'please',
    'ja': 'yes',
    'nein': 'no',
    'guten morgen': 'good morning',
    'gute nacht': 'good night',
    'wie geht es dir': 'how are you',
    'ich liebe dich': 'i love you',
    'willkommen': 'welcome',
    'freund': 'friend',
    'familie': 'family',
    'wasser': 'water',
    'essen': 'food',
    'buch': 'book',
    'haus': 'house',
    'auto': 'car',
    'zeit': 'time',
    'tag': 'day',
    'nacht': 'night',
    'woche': 'week',
    'monat': 'month',
    'jahr': 'year'
  }
};

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    const langPair = `${sourceLang}-${targetLang}`;
    const dictionary = translationDictionary[langPair];

    if (!dictionary) {
      throw new Error(`Translation from ${sourceLang} to ${targetLang} is not supported`);
    }

    const lowerText = text.toLowerCase().trim();
    
    // Try exact match first
    if (dictionary[lowerText]) {
      return dictionary[lowerText];
    }

    // Try word-by-word translation
    const words = lowerText.split(/\s+/);
    const translatedWords = words.map(word => {
      const cleaned = word.replace(/[.,!?;:]$/, '');
      const punctuation = word.match(/[.,!?;:]$/) ? word.slice(-1) : '';
      return (dictionary[cleaned] || word) + punctuation;
    });

    const result = translatedWords.join(' ');
    
    // If nothing was translated, throw error
    if (result === lowerText) {
      throw new Error('Translation not available for this text');
    }

    return result;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to translate text');
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const lowerText = text.toLowerCase();
    
    // Simple language detection based on common words
    const spanishWords = ['hola', 'gracias', 'por favor', 'buenos', 'adiós', 'sí', 'cómo', 'estás'];
    const frenchWords = ['bonjour', 'merci', 'oui', 'non', 'comment', 'vous', 'bonne', 'nuit'];
    const germanWords = ['hallo', 'danke', 'bitte', 'guten', 'morgen', 'wie', 'geht'];
    
    let spanishCount = 0;
    let frenchCount = 0;
    let germanCount = 0;
    
    spanishWords.forEach(word => {
      if (lowerText.includes(word)) spanishCount++;
    });
    
    frenchWords.forEach(word => {
      if (lowerText.includes(word)) frenchCount++;
    });
    
    germanWords.forEach(word => {
      if (lowerText.includes(word)) germanCount++;
    });
    
    if (spanishCount > frenchCount && spanishCount > germanCount) return 'es';
    if (frenchCount > spanishCount && frenchCount > germanCount) return 'fr';
    if (germanCount > spanishCount && germanCount > frenchCount) return 'de';
    
    return 'en'; // Default to English
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