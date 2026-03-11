'use client'

import { InvoiceData, LineItem } from './types'
import { formatABN, validateABN, formatCurrency } from './utils'

interface InvoiceFormProps {
  data: InvoiceData
  onChange: (data: InvoiceData) => void
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const updateData = (updates: Partial<InvoiceData>) => {
    onChange({ ...data, ...updates })
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      includeGST: true
    }
    updateData({ lineItems: [...data.lineItems, newItem] })
  }

  const removeLineItem = (id: string) => {
    if (data.lineItems.length > 1) {
      updateData({ lineItems: data.lineItems.filter(item => item.id !== id) })
    }
  }

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    updateData({
      lineItems: data.lineItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    })
  }

  const dueDateOptions = [
    'On receipt',
    '7 days',
    '14 days',
    '30 days',
    '60 days'
  ]

  const missingFields: string[] = []
  if (!data.businessName) missingFields.push('Business name')
  if (!data.abn) missingFields.push('ABN')
  if (!data.businessAddress) missingFields.push('Address')
  if (!data.businessEmail) missingFields.push('Email')
  if (!data.clientName) missingFields.push('Client name')
  if (!data.clientAddress) missingFields.push('Client address')
  if (!data.invoiceNumber) missingFields.push('Invoice number')
  if (!data.invoiceDate) missingFields.push('Invoice date')
  if (!data.lineItems.some(i => i.description && i.quantity > 0 && i.unitPrice > 0)) {
    missingFields.push('Line item')
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="text-sm">
        {missingFields.length === 0 ? (
          <div className="flex items-center space-x-1.5 text-green-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Ready to download</span>
          </div>
        ) : (
          <p className="text-gray-400">
            Still needed: {missingFields.join(', ')}
          </p>
        )}
      </div>

      {/* Business Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-primary-teal mb-4">Your Business Details</h2>
        <div className="form-grid">
          <div className="input-group full-width">
            <label className="label">Business Name *</label>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => updateData({ businessName: e.target.value })}
              placeholder="Your Business Name"
              required
            />
          </div>
          <div className="input-group">
            <label className="label">ABN *</label>
            <input
              type="text"
              value={data.abn}
              onChange={(e) => {
                const formatted = formatABN(e.target.value)
                updateData({ abn: formatted })
              }}
              placeholder="12 345 678 901"
              required
              style={!validateABN(data.abn) && data.abn ? {borderColor: '#ef4444'} : {}}
            />
            {data.abn && !validateABN(data.abn) && (
              <p style={{fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem'}}>Please enter a valid 11-digit ABN</p>
            )}
          </div>
          <div className="input-group">
            <label className="label">Email *</label>
            <input
              type="email"
              value={data.businessEmail}
              onChange={(e) => updateData({ businessEmail: e.target.value })}
              placeholder="business@example.com"
              required
            />
          </div>
          <div className="input-group">
            <label className="label">Phone</label>
            <input
              type="tel"
              value={data.businessPhone}
              onChange={(e) => updateData({ businessPhone: e.target.value })}
              placeholder="(02) 1234 5678"
            />
          </div>
          <div className="input-group full-width">
            <label className="label">Address *</label>
            <textarea
              value={data.businessAddress}
              onChange={(e) => updateData({ businessAddress: e.target.value })}
              placeholder="123 Business St, Suburb, State, Postcode"
              rows={3}
              required
            />
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-primary-teal mb-4">Client Details</h2>
        <div className="form-grid">
          <div className="input-group">
            <label className="label">Client Name / Business *</label>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => updateData({ clientName: e.target.value })}
              placeholder="Client Name or Business"
              required
            />
          </div>
          <div className="input-group">
            <label className="label">Client Email</label>
            <input
              type="email"
              value={data.clientEmail}
              onChange={(e) => updateData({ clientEmail: e.target.value })}
              placeholder="client@example.com"
            />
          </div>
          <div className="input-group full-width">
            <label className="label">Client Address *</label>
            <textarea
              value={data.clientAddress}
              onChange={(e) => updateData({ clientAddress: e.target.value })}
              placeholder="456 Client Ave, Suburb, State, Postcode"
              rows={3}
              required
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-primary-teal mb-4">Invoice Details</h2>
        <div className="form-grid">
          <div className="input-group">
            <label className="label">Invoice Number *</label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => updateData({ invoiceNumber: e.target.value })}
              placeholder="INV-2024-001"
              required
            />
          </div>
          <div className="input-group">
            <label className="label">Invoice Date *</label>
            <div style={{width: '100%', overflow: 'hidden'}}>
              <input
                type="date"
                value={data.invoiceDate}
                onChange={(e) => updateData({ invoiceDate: e.target.value })}
                required
                style={{width: '100%', maxWidth: '100%', minWidth: '0'}}
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">Due Date *</label>
            <select
              value={data.dueDate}
              onChange={(e) => updateData({ dueDate: e.target.value })}
              required
            >
              {dueDateOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="input-group full-width">
            <label className="label">Payment Terms / Notes</label>
            <textarea
              value={data.paymentTerms}
              onChange={(e) => updateData({ paymentTerms: e.target.value })}
              placeholder="Any additional payment terms or notes..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem'}}>
          <h2 className="text-xl font-semibold" style={{color: 'var(--primary-teal)', margin: 0}}>Line Items</h2>
          <button
            type="button"
            onClick={addLineItem}
            className="btn-primary"
          >
            + Add Item
          </button>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {data.lineItems.map((item, index) => (
            <div key={item.id} style={{border: '1px solid var(--border-light)', borderRadius: '0.5rem', padding: '1rem'}}>
              {/* Mobile Layout */}
              <div className="line-item-mobile" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#374151'}}>Item #{index + 1}</span>
                  {data.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      style={{color: '#dc2626', padding: '0.5rem', minHeight: '44px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'}}
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="input-group">
                  <label className="label">Description *</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                    placeholder="Service or product description"
                    required
                  />
                </div>
                
                <div className="line-item-row">
                  <div className="input-group">
                    <label className="label">Quantity *</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="label">Unit Price *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <label style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem', gap: '0.5rem'}}>
                    <input
                      type="checkbox"
                      checked={item.includeGST}
                      onChange={(e) => updateLineItem(item.id, { includeGST: e.target.checked })}
                      style={{width: '1.25rem', height: '1.25rem', minHeight: 'auto'}}
                    />
                    Include GST (10%)
                  </label>
                  <div style={{textAlign: 'right'}}>
                    <span style={{fontSize: '0.875rem', color: '#6b7280'}}>Total: </span>
                    <span style={{fontWeight: 600, fontSize: '1.125rem'}}>
                      {formatCurrency(item.quantity * item.unitPrice * (item.includeGST ? 1.1 : 1))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="line-item-desktop">
                <div className="input-group" style={{gridColumn: 'span 2'}}>
                  <label className="label">Description *</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                    placeholder="Service or product description"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="label">Qty *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="label">Unit Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <label style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem', gap: '0.5rem'}}>
                    <input
                      type="checkbox"
                      checked={item.includeGST}
                      onChange={(e) => updateLineItem(item.id, { includeGST: e.target.checked })}
                      style={{width: '1rem', height: '1rem', minHeight: 'auto'}}
                    />
                    GST (10%)
                  </label>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600}}>
                      {formatCurrency(item.quantity * item.unitPrice * (item.includeGST ? 1.1 : 1))}
                    </span>
                    {data.lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        style={{color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem'}}
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <div className="card">
        <h2 className="text-xl font-semibold text-primary-teal mb-4">Payment Details</h2>
        <div className="space-y-4">
          <div className="payment-options">
            {(['bank', 'paypal', 'custom'] as const).map((method) => (
              <label key={method} style={{display: 'flex', alignItems: 'center', minHeight: '44px', cursor: 'pointer', gap: '0.75rem'}}>
                <input
                  type="radio"
                  value={method}
                  checked={data.paymentMethod === method}
                  onChange={(e) => updateData({ paymentMethod: e.target.value as typeof method })}
                  style={{width: '1.25rem', height: '1.25rem', minHeight: 'auto'}}
                />
                <span style={{fontSize: '1rem'}}>
                  {method === 'bank' && 'Bank Transfer'}
                  {method === 'paypal' && 'PayPal'}
                  {method === 'custom' && 'Custom'}
                </span>
              </label>
            ))}
          </div>

          {data.paymentMethod === 'bank' && (
            <div className="bank-fields">
              <div className="input-group">
                <label className="label">Bank Name</label>
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) => updateData({ bankName: e.target.value })}
                  placeholder="Commonwealth Bank"
                />
              </div>
              <div className="input-group">
                <label className="label">BSB</label>
                <input
                  type="text"
                  value={data.bsb}
                  onChange={(e) => updateData({ bsb: e.target.value })}
                  placeholder="123-456"
                />
              </div>
              <div className="input-group">
                <label className="label">Account Number</label>
                <input
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) => updateData({ accountNumber: e.target.value })}
                  placeholder="123456789"
                />
              </div>
            </div>
          )}

          {data.paymentMethod === 'paypal' && (
            <div className="input-group">
              <label className="label">PayPal Email</label>
              <input
                type="email"
                value={data.paypalEmail}
                onChange={(e) => updateData({ paypalEmail: e.target.value })}
                placeholder="payments@business.com"
              />
            </div>
          )}

          {data.paymentMethod === 'custom' && (
            <div className="input-group">
              <label className="label">Payment Instructions</label>
              <textarea
                value={data.customPaymentInstructions}
                onChange={(e) => updateData({ customPaymentInstructions: e.target.value })}
                placeholder="Enter custom payment instructions..."
                rows={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}