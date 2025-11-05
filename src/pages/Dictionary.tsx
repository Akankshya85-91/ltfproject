import { useState } from 'react';
import { Search, Volume2, BookOpen, Loader2 } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Navbar } from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { searchDictionary, DictionaryDefinition } from '@/utils/dictionaryService';
import { toast } from 'sonner';

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DictionaryDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await searchDictionary(searchTerm);
      setResults(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to search dictionary');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => toast.error('Failed to play audio'));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dictionary
                </h1>
                <p className="text-muted-foreground">
                  Look up word definitions, pronunciations, and examples
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      placeholder="Enter a word to search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {results.length > 0 && (
                <div className="space-y-6">
                  {results.map((result, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-3xl">{result.word}</CardTitle>
                            {result.phonetic && (
                              <CardDescription className="text-lg mt-1">
                                {result.phonetic}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {result.phonetics.map((phonetic, pIdx) => 
                              phonetic.audio && (
                                <Button
                                  key={pIdx}
                                  variant="outline"
                                  size="icon"
                                  onClick={() => playAudio(phonetic.audio!)}
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        {result.meanings.map((meaning, mIdx) => (
                          <div key={mIdx} className="space-y-4">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <Badge variant="secondary">{meaning.partOfSpeech}</Badge>
                            </div>
                            
                            <div className="space-y-3">
                              {meaning.definitions.map((def, dIdx) => (
                                <div key={dIdx} className="space-y-2 pl-6 border-l-2 border-primary/20">
                                  <p className="text-base">
                                    <span className="font-semibold">{dIdx + 1}.</span> {def.definition}
                                  </p>
                                  {def.example && (
                                    <p className="text-sm text-muted-foreground italic">
                                      "{def.example}"
                                    </p>
                                  )}
                                  {def.synonyms && def.synonyms.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center">
                                      <span className="text-xs font-semibold text-muted-foreground">Synonyms:</span>
                                      {def.synonyms.map((syn, sIdx) => (
                                        <Badge key={sIdx} variant="outline" className="text-xs">
                                          {syn}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  {def.antonyms && def.antonyms.length > 0 && (
                                    <div className="flex flex-wrap gap-1 items-center">
                                      <span className="text-xs font-semibold text-muted-foreground">Antonyms:</span>
                                      {def.antonyms.map((ant, aIdx) => (
                                        <Badge key={aIdx} variant="outline" className="text-xs">
                                          {ant}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {meaning.synonyms && meaning.synonyms.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center pt-2">
                                <span className="text-sm font-semibold">All Synonyms:</span>
                                {meaning.synonyms.map((syn, sIdx) => (
                                  <Badge key={sIdx} variant="secondary" className="text-xs">
                                    {syn}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {mIdx < result.meanings.length - 1 && <Separator />}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && results.length === 0 && searchTerm && (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No results found. Try searching for a different word.
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dictionary;
