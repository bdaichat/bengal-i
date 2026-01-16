import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = language === "bn" 
      ? `আপনি Build Bengal AI - বাংলাদেশের প্রথম AI কোডিং প্ল্যাটফর্ম। আপনি ব্যবহারকারীদের প্রাকৃতিক ভাষায় ওয়েব অ্যাপ্লিকেশন তৈরি করতে সাহায্য করেন।

আপনার কাজ:
1. ব্যবহারকারীর প্রজেক্ট আইডিয়া বুঝুন
2. React, TypeScript, এবং Tailwind CSS ব্যবহার করে কোড জেনারেট করুন
3. বাংলায় কোড ব্যাখ্যা করুন
4. প্রজেক্ট উন্নত করার পরামর্শ দিন

সর্বদা পরিষ্কার, মন্তব্য সহ কোড প্রদান করুন। বাংলাদেশী ব্যবহারকারীদের জন্য উদাহরণ দিন।`
      : `You are Build Bengal AI - Bangladesh's First AI Coding Platform. You help users build web applications using natural language.

Your responsibilities:
1. Understand the user's project idea
2. Generate code using React, TypeScript, and Tailwind CSS
3. Explain the code clearly
4. Suggest improvements for the project

Always provide clean, well-commented code. Use examples relevant to Bangladeshi users when applicable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
