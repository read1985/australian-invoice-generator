import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe only if we have a valid secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey && !stripeSecretKey.includes('placeholder') 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured. Please contact support.' },
        { status: 500 }
      )
    }
    
    const { priceId } = await request.json()
    
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'hosted',
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Australian Invoice Generator Pro',
              description: 'Unlimited invoice generation + email sending',
            },
            unit_amount: 900, // $9.00 AUD in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?canceled=true`,
      metadata: {
        product: 'invoice_generator_pro',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}