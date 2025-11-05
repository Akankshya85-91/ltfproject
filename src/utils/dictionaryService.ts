export interface DictionaryDefinition {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
    synonyms?: string[];
    antonyms?: string[];
  }>;
  sourceUrls?: string[];
}

export const searchDictionary = async (word: string): Promise<DictionaryDefinition[]> => {
  if (!word.trim()) {
    throw new Error('Please enter a word to search');
  }

  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Word not found in dictionary');
    }
    throw new Error('Failed to fetch dictionary data');
  }

  return response.json();
};
