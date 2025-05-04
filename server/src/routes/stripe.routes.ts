import express from 'express';
import stripe from 'stripe';
import { protect } from '../middleware/auth.middleware';
import User from '../models/user.model';

const router = express.Router();

// Initialize Stripe with your secret key
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || '');

// Credit packages
const CREDIT_PACKAGES = {
  '100': { credits: 100, price: 1000, label: '100 credits for $10' },
  '1000': { credits: 1000, price: 5000, label: '1000 credits for $50' },
  '2500': { credits: 2500, price: 10000, label: '2500 credits for $100' },
} as const;

type PackageId = keyof typeof CREDIT_PACKAGES;

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, credits } = req.body;

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
      metadata: {
        userId,
        credits: credits.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
});

// Webhook endpoint to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res.status(400).json({ error: 'Missing stripe signature or webhook secret' });
  }

  let event;

  try {
    // Get the raw body as a Buffer
    const rawBody = req.body;
    event = stripeClient.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (!userId || !credits) {
      return res.status(400).json({ error: 'Missing userId or credits in session metadata' });
    }

    try {
      await User.findByIdAndUpdate(userId, { $inc: { credits } });
      res.json({ received: true });
    } catch (err: any) {
      console.error('Error updating user credits:', err);
      res.status(500).json({ error: 'Error updating user credits' });
    }
  } else {
    res.json({ received: true });
  }
});

// POST /api/stripe/checkout-session
router.post('/checkout-session', protect, async (req, res) => {
  try {
    const { packageId } = req.body as { packageId: PackageId };
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const pkg = CREDIT_PACKAGES[packageId];
    if (!pkg) return res.status(400).json({ error: 'Invalid package' });

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkg.label,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        credits: pkg.credits.toString(),
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard?payment=cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

export default router; 