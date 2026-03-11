'use client'

import { useState, useEffect } from 'react'

interface ProUpgradeProps {
  onUpgrade?: () => void
}

export default function ProUpgrade({ onUpgrade }: ProUpgradeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    // Check if user has Pro status
    const proStatus = localStorage.getItem('invoice_generator_pro')
    setIsPro(proStatus === 'true')
    
    // Check for successful payment in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      localStorage.setItem('invoice_generator_pro', 'true')
      setIsPro(true)
      onUpgrade?.()
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [onUpgrade])

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const { url, error } = await response.json()

      if (error) {
        console.error('Checkout error:', error)
        alert('Payment setup failed. Please try again.')
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment setup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isPro) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <h3 className="font-semibold text-green-800">Pro Activated!</h3>
            <p className="text-sm text-green-600">Unlimited invoices + email sending enabled</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-800">Free Version</h3>
          <p className="text-sm text-amber-700 mb-3">
            You can generate and download PDFs for free. Upgrade to Pro for unlimited use + email sending.
          </p>
          <div className="space-y-2 text-sm text-amber-700 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited invoice generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Email invoices directly to clients</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No recurring fees - one-time payment</span>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Setting up payment...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Upgrade to Pro - $9 AUD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}