import { Code2, Globe, Layout, Sparkles, Zap, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: MessageSquare,
    title: "চ্যাট করে কোড করুন",
    titleEn: "Chat to Code",
    description: "প্রাকৃতিক ভাষায় আপনার আইডিয়া বলুন, AI সেটি কোডে রূপান্তর করবে।",
    descriptionEn: "Describe your ideas in natural language, AI converts them to code.",
  },
  {
    icon: Globe,
    title: "বাংলা সাপোর্ট",
    titleEn: "Bengali Support",
    description: "সম্পূর্ণ বাংলায় কাজ করুন - UI, ডকুমেন্টেশন এবং AI রেসপন্স সবকিছু বাংলায়।",
    descriptionEn: "Work entirely in Bengali - UI, documentation, and AI responses.",
  },
  {
    icon: Layout,
    title: "রেডি টেমপ্লেট",
    titleEn: "Ready Templates",
    description: "পোর্টফোলিও, ই-কমার্স, ব্লগ সহ ১০০+ টেমপ্লেট থেকে শুরু করুন।",
    descriptionEn: "Start from 100+ templates including portfolio, e-commerce, blog.",
  },
  {
    icon: Code2,
    title: "রিয়েল-টাইম প্রিভিউ",
    titleEn: "Real-time Preview",
    description: "কোড জেনারেট হওয়ার সাথে সাথে লাইভ প্রিভিউ দেখুন।",
    descriptionEn: "See live preview as the code is being generated.",
  },
  {
    icon: Zap,
    title: "দ্রুত ডেপ্লয়",
    titleEn: "Fast Deploy",
    description: "এক ক্লিকে আপনার অ্যাপ পাবলিশ করুন, হোস্টিং আমাদের দায়িত্ব।",
    descriptionEn: "Publish your app with one click, hosting is our responsibility.",
  },
  {
    icon: Sparkles,
    title: "AI অপটিমাইজেশন",
    titleEn: "AI Optimization",
    description: "AI স্বয়ংক্রিয়ভাবে কোড অপটিমাইজ করে পারফরম্যান্স বাড়ায়।",
    descriptionEn: "AI automatically optimizes code for better performance.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/30 scroll-mt-16">
      <div className="container px-4">
        {/* Section header */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="text-gradient-bengal font-bengali">কেন Build Bengal AI?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Why Build Bengal AI?
          </p>
          <p className="text-muted-foreground mt-4 font-bengali">
            বাংলাদেশের ডেভেলপারদের জন্য তৈরি, সবার জন্য সহজ।
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Card className="group h-full bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-bengal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 font-bengali">{feature.title}</h3>
                  <p className="text-sm text-primary mb-2">{feature.titleEn}</p>
                  <p className="text-muted-foreground text-sm font-bengali">{feature.description}</p>
                  <p className="text-muted-foreground text-xs mt-1">{feature.descriptionEn}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
