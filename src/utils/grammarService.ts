// Free grammar checking using LanguageTool API
const LANGUAGETOOL_API = 'https://api.languagetool.org/v2/check';

export interface GrammarError {
  message: string;
  offset: number;
  length: number;
  replacements: string[];
  context: string;
}

export async function checkGrammar(
  text: string,
  language: string = 'en-US'
): Promise<GrammarError[]> {
  try {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('language', language);
    
    const response = await fetch(LANGUAGETOOL_API, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    return data.matches.map((match: any) => ({
      message: match.message,
      offset: match.offset,
      length: match.length,
      replacements: match.replacements.map((r: any) => r.value).slice(0, 3),
      context: match.context.text,
    }));
  } catch (error) {
    console.error('Grammar check error:', error);
    throw error;
  }
}

export function applyCorrection(
  text: string,
  error: GrammarError,
  replacement: string
): string {
  return (
    text.substring(0, error.offset) +
    replacement +
    text.substring(error.offset + error.length)
  );
}
