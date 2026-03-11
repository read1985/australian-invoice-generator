'use client'

import { useState, useEffect } from 'react'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from './InvoicePreview'
import ProUpgrade from './ProUpgrade'
import { InvoiceData, LineItem } from './types'
import { generateInvoiceNumber } from './utils'

const defaultLineItem: LineItem = {
  id: 'default-1',
  description: '',
  quantity: 1,
  unitPrice: 0,
  includeGST: true
}

const defaultInvoiceData: InvoiceData = {
  // Business details
  businessName: '',
  abn: '',
  businessAddress: '',
  businessEmail: '',
  businessPhone: '',

  // Client details
  clientName: '',
  clientAddress: '',
  clientEmail: '',

  // Invoice details
  invoiceNumber: '',
  invoiceDate: '',
  dueDate: 'On receipt',
  paymentTerms: '',

  // Line items
  lineItems: [defaultLineItem],

  // Payment details
  paymentMethod: 'bank',
  bankName: '',
  bsb: '',
  accountNumber: '',
  paypalEmail: '',
  customPaymentInstructions: ''
}

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | ''>('')
  const [isPro, setIsPro] = useState(false)
  const [hasTemplate, setHasTemplate] = useState(false)

  // Load from localStorage and set dynamic defaults
  useEffect(() => {
    let data = { ...defaultInvoiceData }

    const saved = localStorage.getItem('invoiceData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        data = { ...data, ...parsedData }
      } catch (e) {
        console.error('Failed to parse saved invoice data')
      }
    }

    // Set dynamic defaults for fields that are still empty
    if (!data.invoiceNumber) data.invoiceNumber = generateInvoiceNumber()
    if (!data.invoiceDate) data.invoiceDate = new Date().toISOString().split('T')[0]
    if (data.lineItems[0]?.id === 'default-1') {
      data.lineItems[0] = { ...data.lineItems[0], id: Date.now().toString() }
    }

    setInvoiceData(data)

    // Check Pro status
    const proStatus = localStorage.getItem('invoice_generator_pro')
    setIsPro(proStatus === 'true')

    // Check if saved business template exists
    setHasTemplate(!!localStorage.getItem('businessTemplate'))
  }, [])

  useEffect(() => {
    if (autoSaveStatus === '') {
      setAutoSaveStatus('saving')
    }

    const timeoutId = setTimeout(() => {
      localStorage.setItem('invoiceData', JSON.stringify(invoiceData))
      setAutoSaveStatus('saved')
      
      // Clear the saved status after 2 seconds
      setTimeout(() => setAutoSaveStatus(''), 2000)
    }, 500) // Debounce saving by 500ms

    return () => clearTimeout(timeoutId)
  }, [invoiceData])

  const [saveStatus, setSaveStatus] = useState<string>('')

  const saveBusinessDetails = () => {
    const template = {
      businessName: invoiceData.businessName,
      abn: invoiceData.abn,
      businessAddress: invoiceData.businessAddress,
      businessEmail: invoiceData.businessEmail,
      businessPhone: invoiceData.businessPhone,
      paymentMethod: invoiceData.paymentMethod,
      bankName: invoiceData.bankName,
      bsb: invoiceData.bsb,
      accountNumber: invoiceData.accountNumber,
      paypalEmail: invoiceData.paypalEmail,
      customPaymentInstructions: invoiceData.customPaymentInstructions,
    }
    localStorage.setItem('businessTemplate', JSON.stringify(template))
    setHasTemplate(true)
    setSaveStatus('✓ Business details saved')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const loadBusinessDetails = () => {
    const template = localStorage.getItem('businessTemplate')
    if (template) {
      try {
        const parsedTemplate = JSON.parse(template)
        setInvoiceData(prev => ({ ...prev, ...parsedTemplate }))
        setSaveStatus('✓ Business details loaded')
        setTimeout(() => setSaveStatus(''), 3000)
      } catch (e) {
        console.error('Failed to parse business template')
      }
    } else {
      setSaveStatus('No saved business details found')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background-cream overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
            <div className="text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-teal">Invoicely</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <p className="text-xs sm:text-sm text-gray-600">Free Australian Tax Invoice Generator</p>
                {autoSaveStatus && (
                  <div className="flex items-center justify-center sm:justify-start space-x-1 text-xs">
                    {autoSaveStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 flex-shrink-0"></div>
                        <span className="text-gray-500">Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-600">Draft saved</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {(hasTemplate || invoiceData.businessName.trim() || saveStatus) && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full sm:w-auto">
                {saveStatus && (
                  <span className="text-sm text-green-600 font-medium text-center">{saveStatus}</span>
                )}
                {hasTemplate && (
                  <button
                    onClick={loadBusinessDetails}
                    className="w-full sm:w-auto text-sm text-primary-teal hover:text-opacity-80 transition-colors min-h-[44px] px-4 py-2 border border-primary-teal rounded-md"
                  >
                    Load Saved Details
                  </button>
                )}
                {invoiceData.businessName.trim() && (
                  <button
                    onClick={saveBusinessDetails}
                    className="btn-secondary w-full sm:w-auto text-sm"
                  >
                    Save Business Details
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="main-layout">
          {/* Form Panel */}
          <div>
            <InvoiceForm
              data={invoiceData}
              onChange={setInvoiceData}
            />
          </div>

          {/* Preview Panel */}
          <div>
            <InvoicePreview data={invoiceData} isPro={isPro} />
          </div>
        </div>

        {/* Pro Upgrade */}
        <div style={{marginTop: '1.5rem'}}>
          <ProUpgrade onUpgrade={() => setIsPro(true)} />
        </div>

        <p className="text-center text-xs text-gray-400" style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>
          ATO-compliant tax invoices &middot; ABN, GST, and all required fields included
        </p>
      </main>
    </div>
  )
}