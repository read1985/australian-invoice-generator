'use client'

import { InvoiceData } from './types'

interface EmailInvoiceProps {
  data: InvoiceData
}

export default function EmailInvoice({ data }: EmailInvoiceProps) {
  return (
    <button
      disabled
      className="btn-secondary opacity-50 cursor-not-allowed flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[140px]"
      title="Email sending is coming soon"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span>Email (Coming Soon)</span>
    </button>
  )
}
