import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, ShoppingBag, FileText, Layout, BarChart3, Utensils } from "lucide-react";
import { motion } from "framer-motion";

const templates = [
  {
    icon: Briefcase,
    title: "পোর্টফোলিও",
    titleEn: "Portfolio",
    description: "ব্যক্তিগত ও পেশাদার প্রোফাইল",
    color: "from-primary to-primary/70",
  },
  {
    icon: ShoppingBag,
    title: "ই-কমার্স",
    titleEn: "E-commerce",
    description: "অনলাইন স্টোর ও শপিং কার্ট",
    color: "from-accent to-accent/70",
  },
  {
    icon: FileText,
    title: "ব্লগ",
    titleEn: "Blog",
    description: "কন্টেন্ট ম্যানেজমেন্ট সিস্টেম",
    color: "from-bengal-gold to-bengal-gold/70",
  },
  {
    icon: Layout,
    title: "ল্যান্ডিং পেজ",
    titleEn: "Landing Page",
    description: "মার্কেটিং ও বিজনেস পেজ",
    color: "from-primary to-bengal-gold",
  },
  {
    icon: BarChart3,
    title: "ড্যাশবোর্ড",
    titleEn: "Dashboard",
    description: "অ্যাডমিন প্যানেল ও চার্ট",
    color: "from-primary to-accent",
  },
  {
    icon: Utensils,
    title: "রেস্টুরেন্ট",
    titleEn: "Restaurant",
    description: "মেনু, অর্ডার ও যোগাযোগ",
    color: "from-accent to-bengal-gold",
  },
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="py-24 bg-muted/30 scroll-mt-16">
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
            <span className="font-bengali">রেডি টেমপ্লেট থেকে শুরু করুন</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start from Ready Templates
          </p>
          <p className="text-muted-foreground mt-4 font-bengali">
            জনপ্রিয় টেমপ্লেট থেকে শুরু করুন এবং আপনার মতো কাস্টমাইজ করুন
          </p>
        </motion.div>

        {/* Templates grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {templates.map((template, index) => (
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
              <Card className="group h-full cursor-pointer bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  {/* Preview area */}
                  <div className={`h-32 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                    <template.icon className="w-12 h-12 text-primary-foreground group-hover:scale-110 transition-transform" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold font-bengali">{template.title}</h3>
                    <p className="text-sm text-primary">{template.titleEn}</p>
                    <p className="text-muted-foreground text-sm mt-1 font-bengali">{template.description}</p>
                    
                    <Button variant="ghost" size="sm" className="mt-3 group/btn">
                      <span className="font-bengali">ব্যবহার করুন</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant="outline" size="lg">
            <span className="font-bengali">সব টেমপ্লেট দেখুন</span>
            <span className="mx-2">•</span>
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TemplatesSection;
