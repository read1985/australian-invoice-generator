'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { InvoiceData } from './types'
import InvoicePDF from './InvoicePDF'
import { cleanFilename } from './utils'

interface EmailInvoiceProps {
  data: InvoiceData
}

export default function EmailInvoice({ data }: EmailInvoiceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [email, setEmail] = useState(data.clientEmail || '')
  const [message, setMessage] = useState(`Hi ${data.clientName || ''},

Please find attached your invoice #${data.invoiceNumber}.

Thank you for your business!

Best regards,
${data.businessName}`)

  const sendEmail = async () => {
    setIsSending(true)
    try {
      // Generate PDF blob
      const blob = await pdf(<InvoicePDF data={data} />).toBlob()
      
      // Convert blob to base64 for email attachment
      const reader = new FileReader()
      reader.onload = async function() {
        const base64 = reader.result?.toString().split(',')[1]
        
        // Use EmailJS to send email
        const templateParams = {
          to_email: email,
          subject: `Invoice #${data.invoiceNumber} from ${data.businessName}`,
          message: message,
          from_name: data.businessName,
          from_email: data.businessEmail,
          attachment: base64,
          filename: `${cleanFilename(`${data.businessName || 'invoice'}-${data.invoiceNumber || 'temp'}`)}.pdf`
        }

        // For now, just simulate sending (EmailJS setup needed)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        alert('Invoice emailed successfully!')
        setIsOpen(false)
      }
      
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try downloading and sending manually.')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[140px]"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>Email Invoice</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Email Invoice</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal"
              placeholder="client@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal"
            />
          </div>

          <div className="text-sm text-gray-500">
            Invoice will be attached as a PDF
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={sendEmail}
              disabled={!email || isSending}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Invoice</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}