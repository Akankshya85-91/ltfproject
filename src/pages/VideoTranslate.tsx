import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { LANGUAGES } from '@/utils/languages';
import { translateText } from '@/utils/translationService';
import { Upload, Loader2, Copy, Video, Trash2, Volume2, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { speakText, stopSpeech } from '@/utils/translationService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { transcribeVideoAudio } from '@/utils/audioTranscriptionService';
import { useNavigate } from 'react-router-dom';

export default function VideoTranslate() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [subtitles, setSubtitles] = useState('');
  const [translatedSubtitles, setTranslatedSubtitles] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractStage, setExtractStage] = useState('');
  const [showInvalidError, setShowInvalidError] = useState(false);
  const [isSpeakingSubtitles, setIsSpeakingSubtitles] = useState(false);
  const [isSpeakingTranslated, setIsSpeakingTranslated] = useState(false);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.mpeg']
    },
    maxFiles: 1,
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
        setShowInvalidError(false);

        // Automatically extract, transcribe, and translate
        await handleAutoExtractAndTranslate(file);
      }
    }
  });
  const handleRemoveFile = () => {
    setVideoFile(null);
    setVideoUrl('');
    setSubtitles('');
    setTranslatedSubtitles('');
    setShowInvalidError(false);
    setExtractProgress(0);
    setExtractStage('');
    setExtracting(false);
    setLoading(false);
  };
  const handleAutoExtractAndTranslate = async (file: File) => {
    setExtracting(true);
    setExtractProgress(0);
    try {
      // Step 1: Extract and transcribe
      const transcription = await transcribeVideoAudio(file, (stage, progress) => {
        setExtractStage(stage);
        setExtractProgress(progress);
      });
      setSubtitles(transcription);
      setExtracting(false);
      if (!transcription.trim()) {
        toast.error('No audio found in video');
        return;
      }

      // Step 2: Translate automatically
      setLoading(true);
      console.log('Translating to:', targetLang);
      const result = await translateText(transcription, 'auto', targetLang);
      console.log('Translation result:', result);
      setTranslatedSubtitles(result);

      // Step 3: Save to history
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        // @ts-ignore - translation_history table exists but types not updated
        await supabase.from('translation_history').insert([{
          user_id: user.id,
          source_text: transcription,
          translated_text: result,
          source_language: 'en',
          target_language: targetLang,
          translation_type: 'video'
        }]);
      }
      toast.success('Video transcribed and translated successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process video');
    } finally {
      setExtracting(false);
      setLoading(false);
      setExtractProgress(0);
      setExtractStage('');
    }
  };
  const handleTranslateSubtitles = async () => {
    if (!subtitles.trim()) {
      setShowInvalidError(true);
      toast.error('Please enter subtitles to translate');
      return;
    }
    setLoading(true);
    setShowInvalidError(false);
    try {
      const result = await translateText(subtitles, 'en', targetLang);
      setTranslatedSubtitles(result);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        // @ts-ignore - translation_history table exists but types not updated
        await supabase.from('translation_history').insert([{
          user_id: user.id,
          source_text: subtitles,
          translated_text: result,
          source_language: 'en',
          target_language: targetLang,
          translation_type: 'video'
        }]);
      }
      toast.success('Subtitles translated successfully');
    } catch (error) {
      console.error('Video translation error:', error);
      toast.error(error instanceof Error ? error.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };
  const handleSpeak = (text: string, isSubtitles: boolean) => {
    try {
      const isSpeaking = isSubtitles ? isSpeakingSubtitles : isSpeakingTranslated;
      if (isSpeaking) {
        stopSpeech();
        if (isSubtitles) {
          setIsSpeakingSubtitles(false);
        } else {
          setIsSpeakingTranslated(false);
        }
      } else {
        speakText(text, targetLang);
        if (isSubtitles) {
          setIsSpeakingSubtitles(true);
        } else {
          setIsSpeakingTranslated(true);
        }

        // Reset state when speech ends
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          if (isSubtitles) {
            setIsSpeakingSubtitles(false);
          } else {
            setIsSpeakingTranslated(false);
          }
        };
      }
    } catch {
      toast.error('Text-to-speech not supported');
    }
  };
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  const downloadSubtitles = (text: string, filename: string) => {
    const blob = new Blob([text], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully');
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col bg-background">
          <header className="h-16 flex items-center gap-2 border-b border-border sticky top-0 bg-background/80 backdrop-blur-lg z-50">
            <SidebarTrigger className="ml-4" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Video Translation</h1>
          </header>
          <div className="container mx-auto px-4 py-12 relative z-10 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-6">
              {showInvalidError && <Alert variant="destructive" className="animate-scale-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Invalid Input: Please provide subtitles/transcript to translate.</span>
                    <Button variant="outline" size="sm" onClick={handleRemoveFile}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </AlertDescription>
                </Alert>}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Video Upload */}
                <Card className="p-6 space-y-4 hover-lift animate-slide-up">
                  <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <input {...getInputProps()} />
                    {videoUrl ? <div className="relative">
                        <video src={videoUrl} controls className="max-h-64 mx-auto rounded-lg w-full" />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={e => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div> : <div className="space-y-4">
                        <Video className="h-16 w-16 mx-auto text-muted-foreground" />
                        
                        
                      </div>}
                  </div>

                  {(extracting || loading) && <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {extracting ? extractStage : 'Translating...'}
                        </span>
                      </div>
                      {extracting && <Progress value={extractProgress} />}
                    </div>}

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Extracted Text
                      {subtitles && !extracting && !loading && <span className="text-xs text-muted-foreground">({subtitles.length} characters)</span>}
                    </label>
                    <Textarea value={subtitles} onChange={e => setSubtitles(e.target.value)} placeholder="Upload a video to automatically extract and translate... The first time may take longer as the AI model loads." className="min-h-[200px] transition-all font-mono text-sm" readOnly={extracting || loading} />
                  </div>

                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>

                  {subtitles && !extracting && !loading && <Button onClick={handleTranslateSubtitles} disabled={loading} className="w-full" variant="outline">
                      <Upload className="mr-2" />
                      Re-translate
                    </Button>}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(subtitles)} disabled={!subtitles}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant={isSpeakingSubtitles ? "default" : "outline"} size="sm" onClick={() => handleSpeak(subtitles, true)} disabled={!subtitles}>
                      <Volume2 className="h-4 w-4 mr-2" />
                      {isSpeakingSubtitles ? 'Stop' : 'Speak'}
                    </Button>
                  </div>
                </Card>

                {/* Translated Results */}
                <Card className="p-6 space-y-4 hover-lift animate-slide-up">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Translated Subtitles</label>
                    <Textarea value={translatedSubtitles} readOnly placeholder="Translated subtitles will appear here..." className="min-h-[300px] bg-secondary/50" />
                  </div>

                  {translatedSubtitles && <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleCopy(translatedSubtitles)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant={isSpeakingTranslated ? "default" : "outline"} onClick={() => handleSpeak(translatedSubtitles, false)}>
                        <Volume2 className="h-4 w-4 mr-2" />
                        {isSpeakingTranslated ? 'Stop' : 'Speak'}
                      </Button>
                      <Button variant="outline" onClick={() => downloadSubtitles(translatedSubtitles, `subtitles_${targetLang}.srt`)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>}

                  
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>;
}