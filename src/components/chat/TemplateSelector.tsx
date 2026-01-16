import { 
  Layout, 
  ShoppingCart, 
  FileText, 
  Rocket, 
  BarChart3, 
  UtensilsCrossed 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  language: "en" | "bn";
  onSelect: (prompt: string) => void;
}

const templates = [
  {
    id: "portfolio",
    icon: Layout,
    title: { en: "Portfolio Site", bn: "পোর্টফোলিও সাইট" },
    description: { 
      en: "Personal or professional showcase", 
      bn: "ব্যক্তিগত বা পেশাদার শোকেস" 
    },
    prompt: {
      en: "Create a modern portfolio website with a hero section, about me, skills, projects gallery, and contact form. Use a clean, professional design.",
      bn: "একটি আধুনিক পোর্টফোলিও ওয়েবসাইট তৈরি করুন যাতে হিরো সেকশন, আমার সম্পর্কে, দক্ষতা, প্রজেক্ট গ্যালারি এবং যোগাযোগ ফর্ম থাকবে। পরিষ্কার, পেশাদার ডিজাইন ব্যবহার করুন।"
    },
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: { en: "E-commerce Store", bn: "ই-কমার্স স্টোর" },
    description: { 
      en: "Product listings with cart", 
      bn: "কার্ট সহ পণ্য তালিকা" 
    },
    prompt: {
      en: "Build an e-commerce store with product grid, product details page, shopping cart, and checkout form. Include filtering and search.",
      bn: "প্রোডাক্ট গ্রিড, প্রোডাক্ট ডিটেইলস পেজ, শপিং কার্ট এবং চেকআউট ফর্ম সহ একটি ই-কমার্স স্টোর তৈরি করুন। ফিল্টারিং এবং সার্চ অন্তর্ভুক্ত করুন।"
    },
    color: "from-orange-500 to-red-500",
  },
  {
    id: "blog",
    icon: FileText,
    title: { en: "Blog Platform", bn: "ব্লগ প্ল্যাটফর্ম" },
    description: { 
      en: "Content management system", 
      bn: "কন্টেন্ট ম্যানেজমেন্ট সিস্টেম" 
    },
    prompt: {
      en: "Create a blog platform with a list of posts, individual post pages with comments, categories, and a sidebar with recent posts and tags.",
      bn: "পোস্টের তালিকা, কমেন্ট সহ পৃথক পোস্ট পেজ, ক্যাটাগরি এবং সাম্প্রতিক পোস্ট ও ট্যাগ সহ সাইডবার দিয়ে একটি ব্লগ প্ল্যাটফর্ম তৈরি করুন।"
    },
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "landing",
    icon: Rocket,
    title: { en: "Landing Page", bn: "ল্যান্ডিং পেজ" },
    description: { 
      en: "Marketing/business page", 
      bn: "মার্কেটিং/ব্যবসা পেজ" 
    },
    prompt: {
      en: "Design a high-converting landing page with hero section, features, testimonials, pricing table, FAQ accordion, and newsletter signup.",
      bn: "হিরো সেকশন, ফিচার, টেস্টিমোনিয়াল, প্রাইসিং টেবিল, FAQ অ্যাকর্ডিয়ন এবং নিউজলেটার সাইনআপ সহ একটি হাই-কনভার্টিং ল্যান্ডিং পেজ ডিজাইন করুন।"
    },
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "dashboard",
    icon: BarChart3,
    title: { en: "Admin Dashboard", bn: "অ্যাডমিন ড্যাশবোর্ড" },
    description: { 
      en: "Analytics and management", 
      bn: "অ্যানালিটিক্স এবং ম্যানেজমেন্ট" 
    },
    prompt: {
      en: "Build an admin dashboard with sidebar navigation, stats cards, charts, data tables, and user management section. Dark theme preferred.",
      bn: "সাইডবার নেভিগেশন, স্ট্যাটস কার্ড, চার্ট, ডেটা টেবিল এবং ইউজার ম্যানেজমেন্ট সেকশন সহ একটি অ্যাডমিন ড্যাশবোর্ড তৈরি করুন। ডার্ক থিম পছন্দ করা হবে।"
    },
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "restaurant",
    icon: UtensilsCrossed,
    title: { en: "Restaurant Site", bn: "রেস্টুরেন্ট সাইট" },
    description: { 
      en: "Menu, ordering, contact", 
      bn: "মেনু, অর্ডার, যোগাযোগ" 
    },
    prompt: {
      en: "Create a restaurant website with hero image, menu with categories, online ordering, reservation form, location map, and contact info.",
      bn: "হিরো ইমেজ, ক্যাটাগরি সহ মেনু, অনলাইন অর্ডারিং, রিজার্ভেশন ফর্ম, লোকেশন ম্যাপ এবং যোগাযোগ তথ্য সহ একটি রেস্টুরেন্ট ওয়েবসাইট তৈরি করুন।"
    },
    color: "from-amber-500 to-orange-500",
  },
];

export function TemplateSelector({ language, onSelect }: TemplateSelectorProps) {
  return (
    <div className="h-full overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {language === "bn" ? "একটি টেমপ্লেট দিয়ে শুরু করুন" : "Start with a Template"}
          </h2>
          <p className="text-muted-foreground">
            {language === "bn" 
              ? "অথবা নিচে আপনার নিজের আইডিয়া লিখুন"
              : "Or type your own idea below"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => onSelect(template.prompt[language])}
                className={cn(
                  "group relative p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card",
                  "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                  "text-left"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                  template.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {template.title[language]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {template.description[language]}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
