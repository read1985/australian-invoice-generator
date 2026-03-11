# Stripe Payment Setup Guide

## What You Need to Do

1. **Create a Stripe Account**
   - Go to https://stripe.com/au
   - Sign up for a new account
   - Complete the onboarding process for Australian businesses
   - You'll need your ABN and bank account details

2. **Get Your API Keys**
   - Log into the Stripe Dashboard: https://dashboard.stripe.com/
   - Navigate to Developers → API Keys
   - Copy your **Publishable key** (starts with `pk_test_` for testing)
   - Copy your **Secret key** (starts with `sk_test_` for testing)
   - **Important**: These are test keys - use them for development

3. **Update Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Replace the placeholder keys with your real Stripe keys:
     ```
     STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
     STRIPE_SECRET_KEY=sk_test_your_actual_key_here
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
     ```

4. **Test the Payment Flow**
   - Use Stripe test card numbers: https://stripe.com/docs/testing#cards
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC

5. **Go Live**
   - Once testing works, activate your Stripe account
   - Replace test keys with live keys (start with `pk_live_` and `sk_live_`)
   - Update the environment variables in Vercel dashboard

## Costs
- **Stripe Fees**: 1.75% + 30¢ for Australian cards, 2.9% + 30¢ for international
- **For $9 product**: ~46¢ fee (very reasonable!)

## Next Steps
- Set up webhook endpoint for payment confirmations (optional)
- Configure email receipts in Stripe dashboard
- Add business name and support info in Stripe dashboard