import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, language, model } = await req.json();
    
    // Validate input
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the requested model against an allowlist (default to fast)
    const ALLOWED_MODELS = [
      "google/gemini-3-flash-preview",
      "google/gemini-2.5-pro",
      "google/gemini-3.1-pro-preview",
    ];
    const selectedModel = ALLOWED_MODELS.includes(model)
      ? model
      : "google/gemini-3-flash-preview";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Strict output contract shared across languages so the live preview can
    // always reliably extract and render exactly one component.
    const outputContract = `
STRICT OUTPUT RULES (follow exactly):
- Return EXACTLY ONE fenced code block tagged \`\`\`tsx containing ONE complete, self-contained React component.
- The component MUST have a default export (export default function App() { ... }).
- Do NOT import any UI libraries, icon packs, CSS files, or external packages. Only "react" may be imported, and prefer no imports at all (React is globally available in the preview).
- Style ONLY with inline Tailwind utility classes. No external stylesheets, no styled-components, no shadcn imports.
- Use semantic, accessible HTML (labels, alt text, button elements) and make the layout responsive with good spacing.
- Produce polished, production-quality UI — never skeletal or placeholder-only output.
- All data must be local/mock state inside the component. Do NOT call external APIs or use environment variables.
- Keep any explanation SHORT and OUTSIDE the code block.`;

    const systemPrompt = language === "bn" 
      ? `আপনি Build Bengal AI - বাংলাদেশের প্রথম AI কোডিং প্ল্যাটফর্ম। আপনি ব্যবহারকারীদের প্রাকৃতিক ভাষায় সুন্দর ওয়েব অ্যাপ্লিকেশন তৈরি করতে সাহায্য করেন।

আপনার কাজ:
1. ব্যবহারকারীর আইডিয়া বুঝে একটি সম্পূর্ণ, কার্যকরী React কম্পোনেন্ট তৈরি করুন
2. React, TypeScript এবং Tailwind CSS ব্যবহার করুন
3. কোড ব্লকের বাইরে সংক্ষেপে বাংলায় ব্যাখ্যা দিন
4. পরিষ্কার, আধুনিক এবং রেসপনসিভ UI তৈরি করুন

${outputContract}`
      : `You are Build Bengal AI - Bangladesh's First AI Coding Platform. You help users build beautiful web applications using natural language.

Your job:
1. Understand the user's idea and generate ONE complete, working React component
2. Use React, TypeScript, and Tailwind CSS
3. Give a SHORT explanation outside the code block
4. Build clean, modern, responsive UI relevant to Bangladeshi users when applicable

${outputContract}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
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
      JSON.stringify({ error: "An error occurred processing your request" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
