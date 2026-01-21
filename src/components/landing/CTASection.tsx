import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section id="pricing" ref={ref} className="py-24 relative overflow-hidden scroll-mt-16" {...props}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-bengal opacity-10" />
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-bengal flex items-center justify-center mb-8 glow-green">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            <span className="font-bengali">আজই শুরু করুন</span>
          </h2>
          <p className="text-xl text-primary mb-2">Start Building Today</p>
          
          <p className="text-lg text-muted-foreground mb-8 font-bengali">
            কোনো ক্রেডিট কার্ড লাগবে না। আজই বিনামূল্যে আপনার প্রথম প্রজেক্ট তৈরি করুন।
          </p>
          <p className="text-muted-foreground mb-8">
            No credit card required. Build your first project free today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg glow-green group">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="font-bengali">বিনামূল্যে শুরু করুন</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              <span className="font-bengali">ডেমো দেখুন</span>
              <span className="mx-2">•</span>
              <span>Watch Demo</span>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-bengali">ফ্রি ফরেভার প্ল্যান</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-bengali">কোনো সেটআপ নেই</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-bengali">বাংলায় সাপোর্ট</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
