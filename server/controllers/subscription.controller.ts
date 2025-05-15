import { Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import Stripe from 'stripe';

// Initialize Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Validation schemas
const subscriptionSchema = z.object({
  planId: z.number().positive(),
});

// Subscription controller methods
export const getPlans = async (_req: Request, res: Response) => {
  try {
    const plans = await storage.getPlans();
    res.status(200).json(plans.filter(plan => plan.active));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPlan = async (req: Request, res: Response) => {
  try {
    const planId = parseInt(req.params.id);
    if (isNaN(planId)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }
    
    const plan = await storage.getPlan(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCurrentPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If user has no plan, return the free plan
    if (!user.planId) {
      const freePlan = await storage.getPlan(1); // Assuming Free plan has ID 1
      return res.status(200).json(freePlan);
    }
    
    const plan = await storage.getPlan(user.planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate input
    const { planId } = subscriptionSchema.parse(req.body);
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const plan = await storage.getPlan(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    
    if (!plan.stripePriceId) {
      return res.status(400).json({ message: "Plan has no Stripe price ID" });
    }
    
    const tenant = await storage.getTenantByUserId(userId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    // Create or retrieve a customer
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName || user.username,
        metadata: {
          userId: user.id.toString(),
          tenantId: tenant.id.toString(),
        },
      });
      
      customerId = customer.id;
      await storage.updateUser(userId, { stripeCustomerId: customerId });
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/settings/billing?success=true`,
      cancel_url: `${req.headers.origin}/settings/billing?canceled=true`,
      metadata: {
        userId: user.id.toString(),
        planId: plan.id.toString(),
      },
    });
    
    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({ message: "Missing Stripe signature" });
  }
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).json({ message: `Webhook error: ${error.message}` });
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.status(200).json({ received: true });
};

// Helper functions for webhook handlers
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = parseInt(session.metadata?.userId || '0');
  const planId = parseInt(session.metadata?.planId || '0');
  
  if (!userId || !planId) {
    console.error('Missing userId or planId in session metadata');
    return;
  }
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }
    
    // Update user's plan
    await storage.updateUser(userId, { planId });
    
    // If subscription ID is available, update it as well
    if (session.subscription) {
      const subscriptionId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription.id;
      
      await storage.updateUser(userId, { stripeSubscriptionId: subscriptionId });
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  try {
    // Find user by Stripe customer ID
    const users = await Promise.all((await storage.getPlans()).map(async () => {
      // This is a placeholder - in a real implementation, we would query users by stripeCustomerId
      // Since we're using in-memory storage, we have to iterate through all users
      const allUsers = [];
      for (let i = 1; i <= 100; i++) {
        const user = await storage.getUser(i);
        if (user && user.stripeCustomerId === customerId) {
          allUsers.push(user);
        }
      }
      return allUsers;
    }));
    
    const user = users.flat()[0];
    
    if (!user) {
      console.error(`User not found for customer: ${customerId}`);
      return;
    }
    
    // Get the price ID from the subscription
    const priceId = subscription.items.data[0]?.price.id;
    
    if (!priceId) {
      console.error('No price ID found in subscription');
      return;
    }
    
    // Find the plan with this Stripe price ID
    const plans = await storage.getPlans();
    const plan = plans.find(p => p.stripePriceId === priceId);
    
    if (!plan) {
      console.error(`No plan found for Stripe price ID: ${priceId}`);
      return;
    }
    
    // Update user's plan and subscription ID
    await storage.updateUser(user.id, {
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  try {
    // Find user by Stripe customer ID (same approach as above)
    const users = await Promise.all((await storage.getPlans()).map(async () => {
      const allUsers = [];
      for (let i = 1; i <= 100; i++) {
        const user = await storage.getUser(i);
        if (user && user.stripeCustomerId === customerId) {
          allUsers.push(user);
        }
      }
      return allUsers;
    }));
    
    const user = users.flat()[0];
    
    if (!user) {
      console.error(`User not found for customer: ${customerId}`);
      return;
    }
    
    // Set user's plan to the free plan (ID 1) and remove subscription ID
    await storage.updateUser(user.id, {
      planId: 1, // Assuming Free plan has ID 1
      stripeSubscriptionId: null,
    });
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

export const getPortalSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({ message: "User has no Stripe customer ID" });
    }
    
    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.origin}/settings/billing`,
    });
    
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
