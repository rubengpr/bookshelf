import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const verifyStripePayment = baseProcedure
  .input(
    z.object({
      sessionId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      
      if (session.payment_status === "paid") {
        // For now, we'll just return success
        // In a real app, you'd want to store this in the database
        // and associate it with a user account
        return {
          success: true,
          isPremium: true,
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment not completed",
        });
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to verify payment",
      });
    }
  });
