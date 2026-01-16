import { MessageSquare, Code2, Rocket } from "lucide-react";

const steps = [
  {
    number: "০১",
    icon: MessageSquare,
    title: "আইডিয়া বলুন",
    titleEn: "Describe",
    description: "বাংলায় বা ইংরেজিতে আপনার অ্যাপের আইডিয়া বলুন। যেমন: 'আমার জন্য একটি রেস্টুরেন্ট ওয়েবসাইট বানাও'",
    descriptionEn: "Tell us your app idea in Bengali or English",
  },
  {
    number: "০২",
    icon: Code2,
    title: "AI তৈরি করে",
    titleEn: "AI Builds",
    description: "আমাদের AI আপনার বর্ণনা থেকে কোড জেনারেট করে এবং রিয়েল-টাইমে দেখায়।",
    descriptionEn: "Our AI generates code from your description in real-time",
  },
  {
    number: "০৩",
    icon: Rocket,
    title: "লঞ্চ করুন",
    titleEn: "Launch",
    description: "এক ক্লিকে আপনার অ্যাপ লাইভ করুন এবং শেয়ার করুন সবার সাথে।",
    descriptionEn: "Go live with one click and share with everyone",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24">
      <div className="container px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="font-bengali">কিভাবে কাজ করে?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            How It Works
          </p>
          <p className="text-muted-foreground mt-4 font-bengali">
            মাত্র ৩টি সহজ ধাপে আপনার অ্যাপ তৈরি করুন
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-bengal-gold to-accent" />

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <div className="relative z-10 mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-bengal flex items-center justify-center glow-green">
                      <step.icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold font-bengali">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-1 font-bengali">{step.title}</h3>
                  <p className="text-primary font-medium mb-3">{step.titleEn}</p>
                  <p className="text-muted-foreground font-bengali">{step.description}</p>
                  <p className="text-muted-foreground text-sm mt-2">{step.descriptionEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
