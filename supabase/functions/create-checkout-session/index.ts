
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
    console.log('🚀 Create checkout session called');
    console.log('📋 Headers received:', {
      authorization: req.headers.get('Authorization') ? 'Present' : 'Missing',
      contentType: req.headers.get('Content-Type'),
      origin: req.headers.get('origin')
    });

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

    // Create supabase client with SERVICE ROLE KEY for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Manually verify the JWT token using service role client
    console.log('🔐 Verifying JWT token with service role client...');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
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

    // Parse request body
    const { tier } = await req.json();
    console.log('💰 Processing upgrade request for tier:', tier);

    if (!tier) {
      console.error('❌ Missing tier parameter');
      return new Response(JSON.stringify({ 
        error: 'Missing tier parameter' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Get or create Stripe customer
    console.log('👥 Looking for existing Stripe customer...');
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log('📋 Found existing customer:', customer.id);
    } else {
      console.log('✨ Creating new Stripe customer...');
      customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      console.log('✅ Created new customer:', customer.id);
    }

    // Get price ID based on tier
    let priceId;
    switch (tier) {
      case 'pro':
        priceId = Deno.env.get('STRIPE_PRICE_ID_PRO');
        break;
      case 'legend':
        priceId = Deno.env.get('STRIPE_PRICE_ID_LEGEND');
        break;
      default:
        console.error('❌ Invalid tier requested:', tier);
        return new Response(JSON.stringify({ 
          error: 'Invalid tier' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    if (!priceId) {
      console.error('❌ Price ID not configured for tier:', tier);
      return new Response(JSON.stringify({ 
        error: 'Price ID not configured for tier' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('💰 Using price ID:', priceId, 'for tier:', tier);

    // Create checkout session
    const origin = req.headers.get('origin') || Deno.env.get('FRONTEND_URL');
    console.log('🌐 Creating checkout session with origin:', origin);

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard`,
      metadata: {
        user_id: user.id,
        tier: tier,
      },
    });

    console.log('✅ Checkout session created successfully:', {
      sessionId: session.id,
      userId: user.id,
      userEmail: user.email,
      tier: tier,
      customerId: customer.id,
      url: session.url
    });

    return new Response(JSON.stringify({
      url: session.url
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('💥 Checkout session creation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(JSON.stringify({
      error: 'Failed to create checkout session',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
