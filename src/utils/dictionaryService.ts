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

// Local dictionary database
const localDictionary: Record<string, DictionaryDefinition> = {
  hello: {
    word: "hello",
    phonetic: "/həˈləʊ/",
    phonetics: [{ text: "/həˈləʊ/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "exclamation",
        definitions: [
          {
            definition: "Used as a greeting or to begin a phone conversation.",
            example: "hello there, Katie!",
            synonyms: ["hi", "hey", "greetings"],
            antonyms: ["goodbye", "bye"]
          }
        ]
      }
    ]
  },
  world: {
    word: "world",
    phonetic: "/wɜːld/",
    phonetics: [{ text: "/wɜːld/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The earth, together with all of its countries and peoples.",
            example: "he was doing his bit to save the world",
            synonyms: ["earth", "globe", "planet"],
            antonyms: []
          }
        ]
      }
    ]
  },
  translate: {
    word: "translate",
    phonetic: "/trænsˈleɪt/",
    phonetics: [{ text: "/trænsˈleɪt/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            definition: "Express the sense of words or text in another language.",
            example: "the book has been translated into English",
            synonyms: ["interpret", "convert", "transcribe"],
            antonyms: []
          }
        ]
      }
    ]
  },
  language: {
    word: "language",
    phonetic: "/ˈlæŋɡwɪdʒ/",
    phonetics: [{ text: "/ˈlæŋɡwɪdʒ/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "The method of human communication, either spoken or written.",
            example: "a study of the way children learn language",
            synonyms: ["speech", "tongue", "dialect"],
            antonyms: []
          }
        ]
      }
    ]
  },
  book: {
    word: "book",
    phonetic: "/bʊk/",
    phonetics: [{ text: "/bʊk/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "A written or printed work consisting of pages glued or sewn together along one side.",
            example: "a book of selected poems",
            synonyms: ["volume", "tome", "publication"],
            antonyms: []
          }
        ]
      }
    ]
  },
  love: {
    word: "love",
    phonetic: "/lʌv/",
    phonetics: [{ text: "/lʌv/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition: "An intense feeling of deep affection.",
            example: "babies fill parents with feelings of love",
            synonyms: ["affection", "fondness", "devotion"],
            antonyms: ["hate", "hatred", "dislike"]
          }
        ]
      },
      {
        partOfSpeech: "verb",
        definitions: [
          {
            definition: "Feel deep affection for someone.",
            example: "he loved his wife deeply",
            synonyms: ["adore", "cherish", "treasure"],
            antonyms: ["hate", "detest", "loathe"]
          }
        ]
      }
    ]
  },
  happy: {
    word: "happy",
    phonetic: "/ˈhæpi/",
    phonetics: [{ text: "/ˈhæpi/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [
          {
            definition: "Feeling or showing pleasure or contentment.",
            example: "Melissa came in looking happy and excited",
            synonyms: ["cheerful", "joyful", "content"],
            antonyms: ["sad", "unhappy", "miserable"]
          }
        ]
      }
    ]
  },
  learn: {
    word: "learn",
    phonetic: "/lɜːn/",
    phonetics: [{ text: "/lɜːn/", audio: "" }],
    meanings: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            definition: "Gain or acquire knowledge of or skill in something by study, experience, or being taught.",
            example: "they'd started learning French",
            synonyms: ["study", "acquire", "master"],
            antonyms: ["forget", "unlearn"]
          }
        ]
      }
    ]
  }
};

export const searchDictionary = async (word: string): Promise<DictionaryDefinition[]> => {
  if (!word.trim()) {
    throw new Error('Please enter a word to search');
  }

  const searchWord = word.trim().toLowerCase();
  const result = localDictionary[searchWord];

  if (!result) {
    throw new Error('Word not found in dictionary');
  }

  return [result];
};
