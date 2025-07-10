import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";
import Stripe from "stripe";

// Validate that we have a proper Stripe key (not a placeholder)
if (env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key_here') || 
    env.STRIPE_SECRET_KEY === 'sk_test_51...' || 
    env.STRIPE_SECRET_KEY.length < 20) {
  throw new Error('STRIPE_SECRET_KEY is not configured. Please set a valid Stripe secret key in your .env file.');
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createStripeCheckoutSession = baseProcedure
  .input(
    z.object({
      successUrl: z.string().url(),
      cancelUrl: z.string().url(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium Book Collection",
                description: "Upgrade to save unlimited books to your collection",
              },
              unit_amount: 999, // $9.99 in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          type: "premium_upgrade",
        },
      });

      return {
        sessionUrl: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      console.error("Stripe checkout session creation failed:", error);
      
      // Handle specific Stripe errors
      if (error instanceof Stripe.errors.StripeError) {
        if (error.type === 'StripeAuthenticationError') {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stripe authentication failed. Please check your API keys configuration.",
          });
        } else if (error.type === 'StripeInvalidRequestError') {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid request to Stripe. Please check your configuration.",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Stripe error: ${error.message}`,
          });
        }
      }
      
      // Generic error fallback
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session. Please try again later.",
      });
    }
  });
