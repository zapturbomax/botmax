import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!key) {
      console.error('Missing Stripe public key');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const redirectToCheckout = async ({ priceId }: { priceId: string }) => {
  try {
    const stripe = await getStripe();
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${window.location.origin}/settings/billing?success=true`,
      cancelUrl: `${window.location.origin}/settings/billing?canceled=true`,
    });
    
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error redirecting to Stripe checkout:', error);
    throw error;
  }
};

export const redirectToBillingPortal = async (customerId: string) => {
  try {
    // In a real implementation, we would make an API call to create a portal session
    // and redirect the user to the returned URL
    const response = await fetch('/api/subscription/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });
    
    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to billing portal:', error);
    throw error;
  }
};
