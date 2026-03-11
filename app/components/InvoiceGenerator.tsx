'use client'

import { useState, useEffect } from 'react'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from './InvoicePreview'
import ProUpgrade from './ProUpgrade'
import { InvoiceData, LineItem } from './types'

const defaultLineItem: LineItem = {
  id: Date.now().toString(),
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
  invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  invoiceDate: new Date().toISOString().split('T')[0], // Store as YYYY-MM-DD
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

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('invoiceData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setInvoiceData({ ...defaultInvoiceData, ...parsedData })
      } catch (e) {
        console.error('Failed to parse saved invoice data')
      }
    }
    
    // Check Pro status
    const proStatus = localStorage.getItem('invoice_generator_pro')
    setIsPro(proStatus === 'true')
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
    <div className="min-h-screen bg-background-cream">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-teal">Invoicely</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <p className="text-sm text-gray-600">Free Australian Tax Invoice Generator</p>
                {autoSaveStatus && (
                  <div className="flex items-center space-x-1 text-xs">
                    {autoSaveStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
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
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {saveStatus && (
                <span className="text-sm text-green-600 font-medium">{saveStatus}</span>
              )}
              <button
                onClick={loadBusinessDetails}
                className="btn-mobile-full sm:w-auto text-sm text-primary-teal hover:text-opacity-80 transition-colors min-h-[44px] px-4 py-2 border border-primary-teal rounded-md"
              >
                Use My Business Details
              </button>
              <button
                onClick={saveBusinessDetails}
                className="btn-secondary btn-mobile-full sm:w-auto text-sm"
              >
                Save Business Details
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem'}}>
        {/* Pro Upgrade Section */}
        <div style={{marginBottom: '2rem'}}>
          <ProUpgrade onUpgrade={() => setIsPro(true)} />
        </div>

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

        {/* Info Section */}
        <div className="card" style={{marginTop: '3rem'}}>
          <h2 style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-teal)', marginBottom: '1rem'}}>ATO Tax Invoice Requirements</h2>
          <p style={{color: '#374151', marginBottom: '1.5rem', lineHeight: 1.7}}>
            This invoice generator ensures your invoices meet all Australian Taxation Office (ATO) requirements for valid tax invoices.
          </p>
          <div className="form-grid">
            <div>
              <h3 className="font-semibold text-primary-teal mb-3">What&apos;s included:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>The words &quot;Tax Invoice&quot; prominently displayed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Your ABN (Australian Business Number)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Your business name and contact details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Invoice date and unique invoice number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Description of goods or services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>GST amount for each item (where applicable)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Total price including GST</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary-teal mb-3">Features:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Auto-save your work as you type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Save business details as template</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Professional PDF generation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>Mobile-friendly responsive design</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>No signup required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-amber mr-3 mt-0.5 text-lg">✓</span>
                  <span>100% free to use</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}