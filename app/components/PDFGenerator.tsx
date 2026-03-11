'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { InvoiceData } from './types'
import InvoicePDF from './InvoicePDF'
import { cleanFilename } from './utils'

interface PDFGeneratorProps {
  data: InvoiceData
}

export default function PDFGenerator({ data }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Create PDF blob
      const blob = await pdf(<InvoicePDF data={data} />).toBlob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename
      const filename = cleanFilename(
        `${data.businessName || 'invoice'}-${data.invoiceNumber || 'temp'}`
      )
      link.download = `${filename}.pdf`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[140px]"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF</span>
        </>
      )}
    </button>
  )
}