import { Sparkles, Github, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-bengal flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">Build Bengal</span>
                <span className="text-primary font-bold ml-1">AI</span>
              </div>
            </a>
            <p className="text-muted-foreground text-sm font-bengali">
              বাংলাদেশের প্রথম AI কোডিং প্ল্যাটফর্ম। কোডিং ছাড়াই অ্যাপ তৈরি করুন।
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Bangladesh's First AI Coding Platform.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Templates</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 font-bengali">রিসোর্স</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">ডকুমেন্টেশন</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">টিউটোরিয়াল</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">ব্লগ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">আমাদের সম্পর্কে</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">যোগাযোগ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Build Bengal AI. <span className="font-bengali">সর্বস্বত্ব সংরক্ষিত।</span>
          </p>
          <p className="text-muted-foreground text-sm font-bengali">
            🇧🇩 বাংলাদেশে তৈরি, ভালোবাসায় ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
