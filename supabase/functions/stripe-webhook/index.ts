
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

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return new Response('No signature', { status: 400 });
    }

    let event;
    try {
      // In production, you'd set up a webhook endpoint secret
      // For now, we'll parse the event directly
      event = JSON.parse(body);
    } catch (err) {
      console.error('Error parsing webhook body:', err);
      return new Response('Invalid JSON', { status: 400 });
    }

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        if (session.mode === 'subscription') {
          // Handle subscription creation
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await handleSubscriptionUpdate(supabaseClient, subscription);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        await handleSubscriptionUpdate(supabaseClient, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        
        // Update subscription to cancelled
        await supabaseClient
          .from('subscriptions')
          .update({
            status: 'cancelled',
            tier: 'free',
            monthly_quota: 5,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Payment failed for subscription:', invoice.subscription);
        
        // Update subscription status
        await supabaseClient
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription', invoice.subscription);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({
      error: 'Webhook processing failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleSubscriptionUpdate(supabaseClient: any, subscription: any) {
  try {
    // Get customer details
    const customer = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', subscription.customer?.email)
      .single();

    if (!customer.data) {
      console.error('No user found for customer email');
      return;
    }

    const price = subscription.items.data[0].price;
    
    // Determine tier and quota based on price
    let tier = 'free';
    let quota = 5;
    
    if (price.id === Deno.env.get('STRIPE_PRICE_ID_PRO')) {
      tier = 'pro';
      quota = 15;
    } else if (price.id === Deno.env.get('STRIPE_PRICE_ID_LEGEND')) {
      tier = 'legend';
      quota = -1; // unlimited
    }

    // Update subscription in database
    await supabaseClient
      .from('subscriptions')
      .upsert({
        user_id: customer.data.id,
        stripe_customer_id: subscription.customer,
        stripe_subscription: subscription.id,
        tier: tier,
        status: subscription.status,
        monthly_quota: quota,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    console.log('Subscription updated in database:', {
      userId: customer.data.id,
      tier: tier,
      status: subscription.status
    });

  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}
