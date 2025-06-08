
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    // Find Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // No customer found, return default free tier
      await supabaseClient
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: null,
          stripe_subscription: '',
          tier: 'free',
          status: 'active',
          monthly_quota: 5,
          current_period_end: null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({
        subscribed: false,
        tier: 'free',
        status: 'active',
        current_period_end: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    let subscriptionData = {
      subscribed: false,
      tier: 'free',
      status: 'active',
      current_period_end: null,
      monthly_quota: 5
    };

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const price = subscription.items.data[0].price;
      
      // Determine tier based on price
      let tier = 'free';
      let quota = 5;
      
      if (price.id === Deno.env.get('STRIPE_PRICE_ID_PRO')) {
        tier = 'pro';
        quota = 15;
      } else if (price.id === Deno.env.get('STRIPE_PRICE_ID_LEGEND')) {
        tier = 'legend';
        quota = -1; // unlimited
      }

      subscriptionData = {
        subscribed: true,
        tier: tier,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        monthly_quota: quota
      };

      // Update subscription in database
      await supabaseClient
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customer.id,
          stripe_subscription: subscription.id,
          tier: tier,
          status: subscription.status,
          monthly_quota: quota,
          current_period_end: subscriptionData.current_period_end,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } else {
      // No active subscription, update to free tier
      await supabaseClient
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customer.id,
          stripe_subscription: '',
          tier: 'free',
          status: 'active',
          monthly_quota: 5,
          current_period_end: null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }

    console.log('Subscription checked for user:', user.id, subscriptionData);

    return new Response(JSON.stringify(subscriptionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Subscription check error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to check subscription',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
