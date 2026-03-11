import { InvoiceData, InvoiceTotals } from './types'

// Format ABN with spaces (XX XXX XXX XXX)
export function formatABN(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')
  
  // Limit to 11 digits
  const limited = digits.slice(0, 11)
  
  // Format with spaces
  if (limited.length >= 9) {
    return `${limited.slice(0, 2)} ${limited.slice(2, 5)} ${limited.slice(5, 8)} ${limited.slice(8)}`
  } else if (limited.length >= 6) {
    return `${limited.slice(0, 2)} ${limited.slice(2, 5)} ${limited.slice(5)}`
  } else if (limited.length >= 3) {
    return `${limited.slice(0, 2)} ${limited.slice(2)}`
  } else {
    return limited
  }
}

// Validate ABN (basic format check - 11 digits)
export function validateABN(abn: string): boolean {
  const digits = abn.replace(/\D/g, '')
  return digits.length === 11
}

// Format currency as Australian dollars
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Calculate invoice totals
export function calculateTotals(data: InvoiceData): InvoiceTotals {
  let subtotal = 0
  let gstTotal = 0

  data.lineItems.forEach(item => {
    const lineSubtotal = item.quantity * item.unitPrice
    subtotal += lineSubtotal
    
    if (item.includeGST) {
      gstTotal += lineSubtotal * 0.1 // 10% GST
    }
  })

  const total = subtotal + gstTotal

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gstTotal: Math.round(gstTotal * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

// Format date to Australian format (DD/MM/YYYY)
export function formatDate(dateString: string): string {
  try {
    // Handle both ISO format (YYYY-MM-DD) and Australian format (DD/MM/YYYY)
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleDateString('en-AU')
  } catch {
    return dateString
  }
}

// Calculate due date
export function calculateDueDate(invoiceDate: string, dueDateOption: string): string {
  if (dueDateOption === 'On receipt') {
    return 'On receipt'
  }
  
  const days = parseInt(dueDateOption.split(' ')[0])
  if (isNaN(days)) {
    return dueDateOption
  }
  
  try {
    // Handle ISO date format directly
    const invoiceDateObj = new Date(invoiceDate)
    if (isNaN(invoiceDateObj.getTime())) {
      return dueDateOption
    }
    const dueDate = new Date(invoiceDateObj)
    dueDate.setDate(dueDate.getDate() + days)
    return dueDate.toLocaleDateString('en-AU')
  } catch {
    return dueDateOption
  }
}

// Generate unique invoice number
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `INV-${year}-${timestamp}`
}

// Clean string for filename
export function cleanFilename(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}