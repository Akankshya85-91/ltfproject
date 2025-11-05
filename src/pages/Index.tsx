import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Languages, Image, Mic, Video, CheckCircle2, Zap, Globe, ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
export default function Index() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      // User is logged in, stay on home page
    }
  }, [user]);
  const features = [{
    icon: Languages,
    title: 'Text Translation',
    description: '50+ languages with real-time translation'
  }, {
    icon: Image,
    title: 'Image to Text',
    description: 'Extract and translate text from images'
  }, {
    icon: Mic,
    title: 'Speech Recognition',
    description: 'Speak and get instant translations'
  }, {
    icon: Video,
    title: 'Video Translation',
    description: 'Translate audio and text from videos'
  }];
  const benefits = ['Support for 50+ global and Indian languages', 'Automatic language detection', 'Text-to-speech for translations', 'Translation history and favorites', 'Grammar correction', 'Free and unlimited usage'];
  return <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-cover bg-center" style={{
      backgroundImage: `url(${heroBg})`
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Break Language
              </span>
              <br />
              <span className="text-foreground">Barriers Instantly</span>
            </h1>

            

            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            
            
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <div key={index} className="group p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              </div>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          
        </div>
      </footer>
    </div>;
}