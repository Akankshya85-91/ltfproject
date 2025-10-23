import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LANGUAGES } from '@/utils/languages';
import { translateText, speakText, startSpeechRecognition, stopSpeech } from '@/utils/translationService';
import { checkGrammar, applyCorrection, GrammarError } from '@/utils/grammarService';
import { Copy, Volume2, Mic, Loader2, ArrowLeftRight, CheckCircle2, ArrowRightLeft, Trash2, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import textBg from '@/assets/text-bg.jpg';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export default function Translate() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([]);
  const [checkingGrammar, setCheckingGrammar] = useState(false);

  // Word counter
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;

  const swapLanguages = () => {
    const tempLang = sourceLang;
    const tempText = sourceText;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  // Clear all text
  const handleClearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setGrammarErrors([]);
    toast.success('All cleared');
  };

  // Share translation
  const handleShare = async () => {
    if (!translatedText) return;
    
    const shareData = {
      title: 'Translation',
      text: `${sourceText}\n\n→ ${translatedText}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text);
        toast.success('Translation copied to clipboard');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };

  // Download translation
  const handleDownload = () => {
    if (!translatedText) return;
    
    const content = `Original (${sourceLang}):\n${sourceText}\n\nTranslation (${targetLang}):\n${translatedText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Translation downloaded');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setLoading(true);
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // @ts-ignore - translation_history table exists but types not updated
        await supabase.from('translation_history').insert([{
          user_id: user.id,
          source_text: sourceText,
          translated_text: result,
          source_language: sourceLang,
          target_language: targetLang,
          translation_type: 'text'
        }]);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error instanceof Error ? error.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSpeak = (text: string, lang: string) => {
    try {
      speakText(text, lang);
    } catch {
      toast.error('Text-to-speech not supported');
    }
  };

  const handleListen = () => {
    if (listening) {
      stopSpeech();
      setListening(false);
      return;
    }

    setListening(true);
    startSpeechRecognition(
      sourceLang,
      (text) => {
        setSourceText(text);
        setListening(false);
      },
      () => {
        toast.error('Speech recognition failed');
        setListening(false);
      }
    );
  };

  const handleGrammarCheck = async () => {
    if (!sourceText.trim()) return;
    
    setCheckingGrammar(true);
    try {
      const errors = await checkGrammar(sourceText, sourceLang);
      setGrammarErrors(errors);
      if (errors.length === 0) {
        toast.success('No grammar errors found!');
      } else {
        toast.info(`Found ${errors.length} potential issue(s)`);
      }
    } catch (error) {
      toast.error('Grammar check failed');
    } finally {
      setCheckingGrammar(false);
    }
  };

  const handleApplyCorrection = (error: GrammarError, replacement: string) => {
    const correctedText = applyCorrection(sourceText, error, replacement);
    setSourceText(correctedText);
    setGrammarErrors(prev => prev.filter(e => e !== error));
    toast.success('Correction applied');
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col" style={{ backgroundImage: `url(${textBg})`, backgroundSize: 'cover' }}>
            <div className="absolute inset-0 bg-background/95" />
            <header className="h-16 flex items-center border-b border-border sticky top-0 bg-background/80 backdrop-blur-lg z-50">
              <SidebarTrigger className="ml-4" />
              <h1 className="text-2xl font-bold ml-4">Text Translation</h1>
            </header>
            <div className="container mx-auto px-4 py-12 relative z-10 animate-fade-in">
              <div className="max-w-6xl mx-auto space-y-6">
          
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" onClick={swapLanguages} className="rounded-xl">
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Swap languages</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={handleListen} className="rounded-xl">
                        <Mic className={listening ? 'text-destructive animate-pulse' : ''} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{listening ? 'Stop listening' : 'Voice input'}</TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  value={sourceText}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSourceText(newValue);
                    if (newValue === '') {
                      setTranslatedText('');
                    }
                    setGrammarErrors([]);
                  }}
                  placeholder="Enter text to translate..."
                  className="min-h-[250px] text-lg rounded-xl shadow-inner"
                />
                
                {/* Word Counter */}
                <div className="text-sm text-muted-foreground">
                  Words: {wordCount}
                </div>
              
              {grammarErrors.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {grammarErrors.map((error, idx) => (
                    <div key={idx} className="text-sm p-2 bg-destructive/10 rounded-md">
                      <p className="font-medium text-destructive">{error.message}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {error.replacements.map((replacement, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleApplyCorrection(error, replacement)}
                          >
                            {replacement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleTranslate} disabled={loading} className="flex-1 rounded-xl shadow-md">
                        {loading ? <Loader2 className="animate-spin" /> : <ArrowLeftRight />}
                        Translate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Translate text</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleGrammarCheck} 
                        disabled={checkingGrammar || !sourceText.trim()}
                        variant="outline"
                        className="rounded-xl"
                      >
                        {checkingGrammar ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Check grammar</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleClearAll} 
                        disabled={!sourceText && !translatedText}
                        variant="outline"
                        className="rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear all</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(sourceText)} disabled={!sourceText} className="rounded-xl">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy text</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleSpeak(sourceText, sourceLang)} disabled={!sourceText} className="rounded-xl">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Speak
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Listen to text</TooltipContent>
                  </Tooltip>
                </div>
              </Card>

              <Card className="p-6 space-y-4 rounded-2xl shadow-lg">
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="min-h-[300px] text-lg bg-secondary/50 rounded-xl shadow-inner"
                />
                <div className="flex gap-2 flex-wrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => handleCopy(translatedText)} disabled={!translatedText} className="rounded-xl">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy translation</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => handleSpeak(translatedText, targetLang)} disabled={!translatedText} className="rounded-xl">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Speak
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Listen to translation</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleShare} disabled={!translatedText} className="rounded-xl">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share translation</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleDownload} disabled={!translatedText} className="rounded-xl">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download as .txt file</TooltipContent>
                  </Tooltip>
                </div>
              </Card>
            </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}