import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

async function testPaymentIntent() {
  console.log('[TEST] Starting payment intent test...');
  console.log('[TEST] STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...` : 'NOT SET');

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[TEST] ERROR: STRIPE_SECRET_KEY is not set!');
    process.exit(1);
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16' as const,
    });

    console.log('[TEST] Stripe instance created successfully');

    // Test creating a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5999, // $59.99
      currency: 'usd',
      metadata: { orderId: 'test-order-123' },
    });

    console.log('[TEST] ✅ Payment intent created successfully!');
    console.log('[TEST] Payment Intent ID:', paymentIntent.id);
    console.log('[TEST] Client Secret:', paymentIntent.client_secret);
    console.log('[TEST] Status:', paymentIntent.status);
  } catch (error: any) {
    console.error('[TEST] ❌ Error creating payment intent:', error.message);
    console.error('[TEST] Error type:', error.type);
    console.error('[TEST] Stack:', error.stack);
    process.exit(1);
  }
}

testPaymentIntent();
