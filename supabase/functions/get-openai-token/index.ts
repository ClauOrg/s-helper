import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Debug: List all available environment variables
    console.log('Available env vars:', Object.keys(Deno.env.toObject()));
    
    // Try different ways to get the API key
    let OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || 
                         Deno.env.get('SUPABASE_OPENAI_API_KEY') ||
                         Deno.env.get('_OPENAI_API_KEY');
    
    console.log('API key found:', !!OPENAI_API_KEY);
    console.log('API key type:', typeof OPENAI_API_KEY);
    
    if (!OPENAI_API_KEY) {
      // Try to get from Supabase vault
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://vxsfjofnyzwhlqxavdpy.supabase.co';
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        try {
          const { data, error } = await supabase.from('vault.secrets').select('secret').eq('name', 'OPENAI_API_KEY').single();
          if (data && !error) {
            OPENAI_API_KEY = data.secret;
            console.log('Retrieved API key from vault');
          }
        } catch (e) {
          console.log('Could not access vault:', e.message);
        }
      }
    }
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment or vault');
    }

    // Check if the API key is base64 encoded and decode it if necessary
    if (!OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const decoded = atob(OPENAI_API_KEY);
        if (decoded.startsWith('sk-')) {
          OPENAI_API_KEY = decoded;
          console.log('Decoded base64 encoded API key');
        }
      } catch (e) {
        console.log('API key is not base64 encoded');
      }
    }

    console.log('Using API key starting with:', OPENAI_API_KEY.substring(0, 7) + '...');
    console.log('Creating OpenAI realtime session...');

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: "You are a helpful cooking assistant. Help users with recipes, cooking techniques, and culinary questions. Be friendly and encouraging."
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});