import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

export { stripe };

// Product and Price IDs for each plan
export const PLANS = {
  bronze: {
    name: 'Bronze',
    setupFee: 297,
    monthlyFee: 27,
    annualFee: 275, // 15% discount: 27*12*0.85 = 275.4
    features: [
      'Professional website (5 pages)',
      'Professional email',
      'Mobile responsive',
      'Basic SEO',
      'SSL certificate',
      'Monthly maintenance',
    ],
  },
  silver: {
    name: 'Silver',
    setupFee: 497,
    monthlyFee: 47,
    annualFee: 480, // 15% discount: 47*12*0.85 = 479.4
    features: [
      'Advanced website (10 pages)',
      'Professional email',
      'Analytics dashboard',
      'Advanced SEO',
      'Social media integration',
      'Blog setup',
      'Monthly maintenance & updates',
    ],
  },
  gold: {
    name: 'Gold',
    setupFee: 797,
    monthlyFee: 97,
    annualFee: 990, // 15% discount: 97*12*0.85 = 989.4
    features: [
      'Premium website (unlimited pages)',
      'Professional email',
      'Advanced analytics dashboard',
      'Load tracking system',
      'Client portal',
      'API integrations',
      'Priority support',
      'Weekly maintenance & updates',
    ],
  },
};

export type PlanType = keyof typeof PLANS;
export type BillingCycle = 'monthly' | 'annual';

/**
 * Create a Stripe checkout session for a plan with subscription
 */
export async function createCheckoutSession(
  planType: PlanType,
  customerEmail: string,
  billingCycle: BillingCycle,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  const plan = PLANS[planType];
  const isAnnual = billingCycle === 'annual';
  const subscriptionFee = isAnnual ? plan.annualFee : plan.monthlyFee;

  // Create line items array
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    // Setup fee (one-time payment)
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${plan.name} Plan - Setup Fee`,
          description: 'One-time setup and development fee',
        },
        unit_amount: plan.setupFee * 100, // Convert to cents
      },
      quantity: 1,
    },
    // Subscription fee (recurring)
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${plan.name} Plan - ${isAnnual ? 'Annual' : 'Monthly'} Maintenance`,
          description: isAnnual 
            ? `Annual maintenance (Save 15% vs monthly - €${plan.monthlyFee * 12 - plan.annualFee}/year)`
            : 'Monthly maintenance and support',
        },
        unit_amount: subscriptionFee * 100, // Convert to cents
        recurring: {
          interval: isAnnual ? 'year' : 'month',
        },
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'sepa_debit'],
    line_items: lineItems,
    mode: 'subscription', // Changed to subscription mode to handle recurring payments
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      plan: planType,
      billingCycle: billingCycle,
      setupFee: plan.setupFee.toString(),
      subscriptionFee: subscriptionFee.toString(),
    },
  });

  return session;
}

/**
 * Create a subscription for monthly or annual payments
 */
export async function createSubscription(
  customerId: string,
  planType: PlanType,
  billingCycle: BillingCycle = 'monthly'
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const plan = PLANS[planType];
  const isAnnual = billingCycle === 'annual';
  const subscriptionFee = isAnnual ? plan.annualFee : plan.monthlyFee;

  // Create a price for the subscription
  const price = await stripe.prices.create({
    currency: 'eur',
    unit_amount: subscriptionFee * 100,
    recurring: {
      interval: isAnnual ? 'year' : 'month',
    },
    product_data: {
      name: `${plan.name} Plan - ${isAnnual ? 'Annual' : 'Monthly'} Maintenance`,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
    metadata: {
      plan: planType,
      billingCycle: billingCycle,
    },
  });

  return subscription;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  return customers.data[0] || null;
}

/**
 * Create a customer portal session for managing subscriptions
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

