# Stripe Setup Guide

This guide will help you configure Stripe payments for your application to fix the "Failed to create checkout session" error.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** > **API keys**
3. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Configure Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual Stripe keys:

```env
# Replace these with your actual Stripe keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # Optional for now
```

## Step 3: Test vs Production Keys

- **Test keys** (recommended for development):
  - Secret key starts with `sk_test_`
  - Publishable key starts with `pk_test_`
  - Use test card numbers (e.g., `4242424242424242`)
  - No real money is charged

- **Live keys** (for production only)
  - Secret key starts with `sk_live_`
  - Publishable key starts with `pk_live_`
  - Real money will be charged

## Step 4: Restart Your Application

After updating the environment variables, restart your application for the changes to take effect.

## Step 5: Test the Payment Flow

1. Try to add more than 5 books to trigger the paywall
2. Click "Upgrade Now" in the payment modal
3. You should be redirected to Stripe's checkout page
4. Use test card details if using test keys:
   - Card number: `4242424242424242`
   - Expiry: Any future date
   - CVC: Any 3 digits

## Troubleshooting

### "Failed to create checkout session" Error

This error typically occurs when:
1. **Invalid API keys**: Make sure you're using actual Stripe keys, not placeholders
2. **Wrong key format**: Ensure test keys start with `sk_test_` and `pk_test_`
3. **Missing keys**: Both secret and publishable keys are required
4. **Network issues**: Check your internet connection and Stripe's status

### Common Error Messages

- **"Stripe authentication failed"**: Your secret key is invalid or expired
- **"Invalid request to Stripe"**: Check that your keys match (both test or both live)
- **"STRIPE_SECRET_KEY is not configured"**: You're still using placeholder values

## Security Notes

- Never commit your live Stripe keys to version control
- Keep your secret keys secure and never expose them in client-side code
- Use test keys during development
- Consider using environment-specific configuration for different deployment stages

## Need Help?

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Keys Guide](https://stripe.com/docs/keys)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
