import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "রাহুল আহমেদ",
    nameEn: "Rahul Ahmed",
    role: "স্টার্টআপ প্রতিষ্ঠাতা",
    roleEn: "Startup Founder",
    avatar: "RA",
    rating: 5,
    text: "Build Bengal আমার স্টার্টআপের জন্য গেম চেঞ্জার! মাত্র ২ ঘণ্টায় পুরো ল্যান্ডিং পেজ তৈরি করেছি।",
    textEn: "Build Bengal is a game changer for my startup! Built the entire landing page in just 2 hours.",
  },
  {
    name: "ফাতিমা খান",
    nameEn: "Fatima Khan",
    role: "ফ্রিল্যান্স ডেভেলপার",
    roleEn: "Freelance Developer",
    avatar: "FK",
    rating: 5,
    text: "বাংলায় কোড করা এখন অনেক সহজ। AI সব কিছু বুঝে এবং সঠিক কোড দেয়।",
    textEn: "Coding in Bengali is now so easy. AI understands everything and gives correct code.",
  },
  {
    name: "তানভীর হাসান",
    nameEn: "Tanvir Hasan",
    role: "ছাত্র, BUET",
    roleEn: "Student, BUET",
    avatar: "TH",
    rating: 5,
    text: "প্রজেক্ট শেখার জন্য অসাধারণ! রিয়েল-টাইম প্রিভিউ দেখে অনেক কিছু শিখছি।",
    textEn: "Amazing for learning projects! Learning so much from the real-time preview.",
  },
  {
    name: "সাবরিনা ইসলাম",
    nameEn: "Sabrina Islam",
    role: "UI/UX ডিজাইনার",
    roleEn: "UI/UX Designer",
    avatar: "SI",
    rating: 4,
    text: "ডিজাইন থেকে কোড করা এত দ্রুত হবে ভাবিনি। Build Bengal সত্যিই অসাধারণ।",
    textEn: "Never thought design to code would be this fast. Build Bengal is truly amazing.",
  },
  {
    name: "আরিফ মাহমুদ",
    nameEn: "Arif Mahmud",
    role: "সফটওয়্যার ইঞ্জিনিয়ার",
    roleEn: "Software Engineer",
    avatar: "AM",
    rating: 5,
    text: "প্রোটোটাইপিং এর জন্য সেরা টুল। ক্লায়েন্টদের দ্রুত ডেমো দেখাতে পারি।",
    textEn: "Best tool for prototyping. Can quickly show demos to clients.",
  },
  {
    name: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    role: "টেক উদ্যোক্তা",
    roleEn: "Tech Entrepreneur",
    avatar: "NJ",
    rating: 5,
    text: "বাংলাদেশে তৈরি, বাংলাদেশের জন্য! গর্বিত এই প্ল্যাটফর্ম ব্যবহার করে।",
    textEn: "Made in Bangladesh, for Bangladesh! Proud to use this platform.",
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-bengal-gold text-bengal-gold"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 scroll-mt-16">
      <div className="container px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            ব্যবহারকারীদের মতামত
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="text-gradient-bengal">হাজারো</span> ডেভেলপারের বিশ্বাস
          </h2>
          <p className="text-lg text-muted-foreground font-bengali">
            দেখুন আমাদের ব্যবহারকারীরা কী বলছেন Build Bengal সম্পর্কে
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
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
              <Card className="group h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />

                  {/* Testimonial text */}
                  <p className="mt-4 text-foreground/90 font-bengali leading-relaxed">
                    {testimonial.text}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {testimonial.textEn}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/50">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground font-bengali">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-bengali">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: "৫,০০০+", label: "সক্রিয় ব্যবহারকারী", labelEn: "Active Users" },
            { value: "১০,০০০+", label: "প্রজেক্ট তৈরি", labelEn: "Projects Built" },
            { value: "৪.৯", label: "গড় রেটিং", labelEn: "Average Rating" },
            { value: "৯৮%", label: "সন্তুষ্ট ব্যবহারকারী", labelEn: "Satisfied Users" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-gradient-bengal">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground font-bengali">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
