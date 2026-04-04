import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const tiers = [
  {
    name: "Free",
    nameBn: "ফ্রি",
    monthlyPrice: 0,
    features: [
      "10 AI generations per month",
      "3 saved projects",
      "Bengali + English support",
    ],
    cta: "Get Started",
    ctaBn: "শুরু করুন",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    nameBn: "প্রো",
    monthlyPrice: 499,
    features: [
      "Unlimited AI generations",
      "Unlimited saved projects",
      "Priority AI speed",
      "Code export & download",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    ctaBn: "প্রো তে আপগ্রেড করুন",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Team",
    nameBn: "টিম",
    monthlyPrice: 1499,
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared project workspace",
      "Custom subdomain",
      "Priority support",
    ],
    cta: "Contact Us",
    ctaBn: "যোগাযোগ করুন",
    href: "mailto:hello@buildbengal.ai",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes! You can cancel or downgrade your plan at any time. Your access continues until the end of the current billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "The Free tier is always available with 10 AI generations per month. You can upgrade to Pro anytime to unlock unlimited features.",
  },
  {
    q: "Do you support bKash/Nagad?",
    a: "Yes, we support bKash, Nagad, and all major Bangladeshi payment methods alongside international cards.",
  },
  {
    q: "Can I switch between monthly and yearly billing?",
    a: "Absolutely! Switch anytime from your account settings. Switching to yearly saves you 20% on all paid plans.",
  },
  {
    q: "What happens when I hit my Free plan limits?",
    a: "You'll be prompted to upgrade. Your saved projects and chat history remain accessible — you just won't be able to create new generations until the next month or an upgrade.",
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  const getPrice = (monthly: number) => {
    if (monthly === 0) return 0;
    return yearly ? Math.round(monthly * 12 * 0.8) : monthly;
  };

  const period = yearly ? "/year" : "/month";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Build Bengal AI" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-display font-bold">Build Bengal AI</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 py-16 max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="secondary" className="mb-4">মূল্য নির্ধারণ</Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start building for free. Upgrade when you need more power.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.5}
        >
          <Label htmlFor="billing-toggle" className={`text-sm ${!yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Monthly
          </Label>
          <Switch id="billing-toggle" checked={yearly} onCheckedChange={setYearly} />
          <Label htmlFor="billing-toggle" className={`text-sm ${yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            Yearly
          </Label>
          {yearly && (
            <Badge className="bg-primary/10 text-primary border-primary/20 ml-1">
              Save 20%
            </Badge>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-20">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
            >
              <Card
                className={`h-full flex flex-col relative ${
                  tier.highlighted
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.03] bg-card"
                    : "border-border/50 bg-card/50"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-display">
                    {tier.name} <span className="text-muted-foreground font-bengali text-base">({tier.nameBn})</span>
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                      ৳{getPrice(tier.monthlyPrice).toLocaleString("en-IN")}
                    </span>
                    {tier.monthlyPrice > 0 && (
                      <span className="text-muted-foreground text-sm">{period}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {tier.href.startsWith("mailto:") ? (
                    <a href={tier.href} className="w-full">
                      <Button
                        variant={tier.highlighted ? "default" : "outline"}
                        className={`w-full ${tier.highlighted ? "bg-primary hover:bg-primary/90" : ""}`}
                      >
                        {tier.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link to={tier.href} className="w-full">
                      <Button
                        variant={tier.highlighted ? "default" : "outline"}
                        className={`w-full ${tier.highlighted ? "bg-primary hover:bg-primary/90" : ""}`}
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
        >
          <h2 className="text-2xl font-display font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </main>
    </div>
  );
}
