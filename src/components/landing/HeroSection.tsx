import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow delay-1000" />
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-bengali">বাংলাদেশের প্রথম AI কোডিং প্ল্যাটফর্ম</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground">Build Apps with</span>
            <span className="block text-gradient-bengal">AI in বাংলা</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up font-bengali" style={{ animationDelay: '0.2s' }}>
            আপনার আইডিয়া বলুন, AI তৈরি করবে। কোনো কোডিং অভিজ্ঞতা ছাড়াই সম্পূর্ণ ওয়েব অ্যাপ্লিকেশন তৈরি করুন।
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.25s' }}>
            Describe your idea, AI builds it. Create complete web applications without any coding experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg glow-green group">
              <Zap className="w-5 h-5 mr-2" />
              <span className="font-bengali">শুরু করুন বিনামূল্যে</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-border hover:bg-secondary">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">১০০+</div>
              <div className="text-sm text-muted-foreground font-bengali">প্রজেক্ট টেমপ্লেট</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">৫০K+</div>
              <div className="text-sm text-muted-foreground font-bengali">সক্রিয় ব্যবহারকারী</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">বাংলা</div>
              <div className="text-sm text-muted-foreground font-bengali">সম্পূর্ণ সাপোর্ট</div>
            </div>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="glass rounded-2xl p-2 glow-green">
            <div className="bg-card rounded-xl overflow-hidden border border-border">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-bengal-gold" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-4 py-1.5 text-sm text-muted-foreground text-center">
                    buildbengal.ai
                  </div>
                </div>
              </div>
              {/* Content area */}
              <div className="aspect-video bg-gradient-to-br from-background to-muted flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-bengal flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-muted-foreground font-bengali">AI দিয়ে আপনার স্বপ্নের অ্যাপ তৈরি করুন</p>
                  <p className="text-sm text-muted-foreground">Build your dream app with AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
