import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="Build Bengal AI" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <span className="font-display font-bold text-lg">Build Bengal</span>
              <span className="text-primary font-bold ml-1">AI</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </a>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">
              ডকুমেন্টেশন
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/signin">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90">
                <span className="font-bengali">শুরু করুন</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors font-bengali">
                ডকুমেন্টেশন
              </a>
              <div className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <Link to="/signin">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <span className="font-bengali">শুরু করুন</span>
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
