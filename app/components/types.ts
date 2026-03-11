export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  includeGST: boolean
}

export interface InvoiceData {
  // Business details
  businessName: string
  abn: string
  businessAddress: string
  businessEmail: string
  businessPhone: string
  
  // Client details
  clientName: string
  clientAddress: string
  clientEmail: string
  
  // Invoice details
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  paymentTerms: string
  
  // Line items
  lineItems: LineItem[]
  
  // Payment details
  paymentMethod: 'bank' | 'paypal' | 'custom'
  bankName: string
  bsb: string
  accountNumber: string
  paypalEmail: string
  customPaymentInstructions: string
}

export interface InvoiceTotals {
  subtotal: number
  gstTotal: number
  total: number
}