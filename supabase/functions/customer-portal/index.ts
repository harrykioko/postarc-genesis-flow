
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Customer portal function called');
    
    // Check for auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return new Response(JSON.stringify({ 
        error: 'No authorization header provided' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.error('❌ Invalid authorization header format');
      return new Response(JSON.stringify({ 
        error: 'Invalid authorization header format' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Authorization header found');

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 JWT token extracted, length:', token.length);

    // Create supabase admin client with SERVICE ROLE KEY for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Manually verify the JWT token using service role client
    console.log('🔐 Verifying JWT token with service role client...');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    console.log('🔍 JWT verification result:', {
      userFound: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message
    });
    
    if (authError) {
      console.error('❌ JWT verification failed:', authError);
      return new Response(JSON.stringify({ 
        error: 'Invalid or expired token',
        details: authError.message 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
      console.error('❌ No user found from JWT token');
      return new Response(JSON.stringify({ 
        error: 'Invalid token - no user found' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user.email) {
      console.error('❌ User has no email address');
      return new Response(JSON.stringify({ 
        error: 'User email not available' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ User authenticated successfully via JWT:', user.email);

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('❌ Stripe secret key not configured');
      return new Response(JSON.stringify({ 
        error: 'Stripe configuration error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    console.log('💳 Stripe initialized successfully');

    // Find Stripe customer
    console.log('🔍 Looking for Stripe customer...');
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      console.error('❌ No Stripe customer found for email:', user.email);
      return new Response(JSON.stringify({ 
        error: 'No Stripe customer found' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const customer = customers.data[0];
    console.log('✅ Found Stripe customer:', customer.id);

    // Create portal session
    const origin = req.headers.get('origin') || Deno.env.get('FRONTEND_URL');
    console.log('🌐 Creating portal session with return URL:', `${origin}/settings`);
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/settings`,
    });

    console.log('✅ Customer portal session created:', {
      sessionId: portalSession.id,
      userId: user.id,
      customerId: customer.id,
      url: portalSession.url
    });

    return new Response(JSON.stringify({
      url: portalSession.url
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('💥 Customer portal creation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create customer portal session',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
