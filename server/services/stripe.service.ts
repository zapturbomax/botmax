import Stripe from 'stripe';
import { storage } from '../storage';

// Initialize Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createCustomer = async (userId: number, email: string, name?: string) => {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: name || email,
      metadata: {
        userId: userId.toString(),
      },
    });
    
    // Update user with customer ID
    await storage.updateUser(userId, { stripeCustomerId: customer.id });
    
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

export const createSubscription = async (userId: number, planId: number) => {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const plan = await storage.getPlan(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    if (!plan.stripePriceId) {
      throw new Error('Plan has no Stripe price ID');
    }
    
    // Get or create customer
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await createCustomer(userId, user.email, user.fullName);
      customerId = customer.id;
    }
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: plan.stripePriceId,
        },
      ],
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
    });
    
    // Update user with subscription info
    await storage.updateUser(userId, {
      stripeSubscriptionId: subscription.id,
      planId,
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating Stripe subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (userId: number) => {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.stripeSubscriptionId) {
      throw new Error('User has no active subscription');
    }
    
    // Cancel subscription
    const subscription = await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    
    // Update user
    await storage.updateUser(userId, {
      stripeSubscriptionId: null,
      planId: 1, // Assuming Free plan has ID 1
    });
    
    return subscription;
  } catch (error) {
    console.error('Error cancelling Stripe subscription:', error);
    throw error;
  }
};

export const getSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving Stripe subscription:', error);
    throw error;
  }
};

export const createBillingPortalSession = async (customerId: string, returnUrl: string) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return session;
  } catch (error) {
    console.error('Error creating Stripe billing portal session:', error);
    throw error;
  }
};
