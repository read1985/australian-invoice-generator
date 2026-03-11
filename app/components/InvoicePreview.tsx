'use client'

import { InvoiceData } from './types'
import { formatCurrency, calculateTotals, calculateDueDate, formatDate } from './utils'
import PDFGenerator from './PDFGenerator'
import EmailInvoice from './EmailInvoice'

interface InvoicePreviewProps {
  data: InvoiceData
  isPro?: boolean
}

export default function InvoicePreview({ data, isPro = false }: InvoicePreviewProps) {
  const totals = calculateTotals(data)
  const dueDate = calculateDueDate(data.invoiceDate, data.dueDate)

  // Check if required fields are filled for PDF generation
  const requiredFields = [
    { field: 'businessName', value: data.businessName, label: 'Business name' },
    { field: 'abn', value: data.abn, label: 'ABN' },
    { field: 'businessAddress', value: data.businessAddress, label: 'Business address' },
    { field: 'businessEmail', value: data.businessEmail, label: 'Business email' },
    { field: 'clientName', value: data.clientName, label: 'Client name' },
    { field: 'clientAddress', value: data.clientAddress, label: 'Client address' },
    { field: 'invoiceNumber', value: data.invoiceNumber, label: 'Invoice number' },
    { field: 'invoiceDate', value: data.invoiceDate, label: 'Invoice date' },
  ]

  const missingFields = requiredFields.filter(field => !field.value)
  const hasValidLineItems = data.lineItems.some(item => item.description && item.quantity > 0 && item.unitPrice > 0)
  
  if (!hasValidLineItems) {
    missingFields.push({ field: 'lineItems', value: '', label: 'At least one line item' })
  }

  const canGeneratePDF = missingFields.length === 0

  return (
    <div className="space-y-6">
      {/* Actions Section */}
      <div className="card">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h2 className="text-xl font-semibold text-primary-teal">Invoice Preview</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-auto">
                <EmailInvoice data={data} />
              </div>
              <div className="w-full sm:w-auto">
                {canGeneratePDF ? (
                  <PDFGenerator data={data} />
                ) : (
                  <button
                    disabled
                    className="btn-primary opacity-50 cursor-not-allowed flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[140px]"
                    title={`Missing: ${missingFields.map(f => f.label).join(', ')}`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          {!canGeneratePDF && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-amber-800">Complete these fields to generate your invoice:</div>
                  <div className="text-sm text-amber-700 mt-1">
                    {missingFields.map(f => f.label).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="card bg-white shadow-lg" id="invoice-preview">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-teal mb-2">TAX INVOICE</h1>
          <div className="text-lg text-gray-600">
            Invoice #{data.invoiceNumber || 'INV-XXXX-XXXXXX'}
          </div>
        </div>

        {/* Business and Client Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Business Details */}
          <div>
            <h3 className="text-lg font-semibold text-primary-teal mb-3">From:</h3>
            <div className="space-y-1 text-gray-700">
              <div className="font-semibold text-base">{data.businessName || 'Your Business Name'}</div>
              <div>ABN: {data.abn || 'XX XXX XXX XXX'}</div>
              <div className="whitespace-pre-line leading-relaxed">
                {data.businessAddress || 'Your Business Address'}
              </div>
              <div>{data.businessEmail || 'business@example.com'}</div>
              {data.businessPhone && <div>{data.businessPhone}</div>}
            </div>
          </div>

          {/* Client Details */}
          <div>
            <h3 className="text-lg font-semibold text-primary-teal mb-3">To:</h3>
            <div className="space-y-1 text-gray-700">
              <div className="font-semibold text-base">{data.clientName || 'Client Name'}</div>
              <div className="whitespace-pre-line leading-relaxed">
                {data.clientAddress || 'Client Address'}
              </div>
              {data.clientEmail && <div>{data.clientEmail}</div>}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-gray-600">Invoice Date</div>
            <div className="text-gray-900 font-medium">{formatDate(data.invoiceDate)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Due Date</div>
            <div className="text-gray-900 font-medium">{dueDate}</div>
          </div>
          {data.paymentTerms && (
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-sm font-medium text-gray-600">Payment Terms</div>
              <div className="text-gray-900 text-sm leading-relaxed">{data.paymentTerms}</div>
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-teal mb-4">Items / Services</h3>
          
          {/* Mobile Layout: Cards */}
          <div className="block lg:hidden space-y-4">
            {data.lineItems.map((item, index) => {
              const lineTotal = item.quantity * item.unitPrice * (item.includeGST ? 1.1 : 1)
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.description || 'Service description'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Quantity: </span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Unit Price: </span>
                        <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">GST: </span>
                        <span className="font-medium">{item.includeGST ? '10%' : 'GST-free'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Line Total: </span>
                        <span className="font-semibold text-base">{formatCurrency(lineTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Layout: Table */}
          <div className="hidden lg:block border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">GST</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.lineItems.map((item, index) => {
                  const lineTotal = item.quantity * item.unitPrice * (item.includeGST ? 1.1 : 1)
                  return (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.description || 'Service description'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.includeGST ? '10%' : 'GST-free'}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-center lg:justify-end mb-8">
          <div className="w-full max-w-sm bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal (excl. GST):</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (10%):</span>
                <span className="font-medium">{formatCurrency(totals.gstTotal)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-base lg:text-lg font-bold">
                  <span>Total (incl. GST):</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-primary-teal mb-4">Payment Details</h3>
          
          {data.paymentMethod === 'bank' && (
            <div className="text-sm text-gray-700 space-y-2 bg-gray-50 p-4 rounded-lg">
              <div><span className="font-medium">Payment Method:</span> Bank Transfer</div>
              {data.bankName && <div><span className="font-medium">Bank:</span> {data.bankName}</div>}
              {data.bsb && <div><span className="font-medium">BSB:</span> {data.bsb}</div>}
              {data.accountNumber && <div><span className="font-medium">Account:</span> {data.accountNumber}</div>}
            </div>
          )}

          {data.paymentMethod === 'paypal' && (
            <div className="text-sm text-gray-700 space-y-2 bg-gray-50 p-4 rounded-lg">
              <div><span className="font-medium">Payment Method:</span> PayPal</div>
              {data.paypalEmail && <div><span className="font-medium">PayPal:</span> {data.paypalEmail}</div>}
            </div>
          )}

          {data.paymentMethod === 'custom' && data.customPaymentInstructions && (
            <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              <div className="whitespace-pre-line leading-relaxed">{data.customPaymentInstructions}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600">Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}