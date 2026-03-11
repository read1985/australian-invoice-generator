import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { InvoiceData } from './types'
import { formatCurrency, calculateTotals, calculateDueDate, formatDate } from './utils'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d4f4f',
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  leftColumn: {
    flexDirection: 'column',
    flexGrow: 1,
    marginRight: 20,
  },
  rightColumn: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d4f4f',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCol: {
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    padding: 8,
  },
  tableColDescription: {
    width: '40%',
  },
  tableColQty: {
    width: '10%',
    textAlign: 'center',
  },
  tableColPrice: {
    width: '15%',
    textAlign: 'right',
  },
  tableColGst: {
    width: '15%',
    textAlign: 'center',
  },
  tableColTotal: {
    width: '20%',
    textAlign: 'right',
  },
  tableCell: {
    fontSize: 9,
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 8,
  },
  totalsContainer: {
    alignSelf: 'flex-end',
    width: '50%',
    marginBottom: 20,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalsFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 8,
    marginTop: 8,
  },
  totalsLabel: {
    fontSize: 10,
  },
  totalsFinalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalsValue: {
    fontSize: 10,
    textAlign: 'right',
  },
  totalsFinalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
    color: '#666666',
  },
})

interface InvoicePDFProps {
  data: InvoiceData
}

export default function InvoicePDF({ data }: InvoicePDFProps) {
  const totals = calculateTotals(data)
  const dueDate = calculateDueDate(data.invoiceDate, data.dueDate)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TAX INVOICE</Text>
          <Text style={styles.invoiceNumber}>Invoice #{data.invoiceNumber}</Text>
        </View>

        {/* Business and Client Information */}
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>From:</Text>
            <Text style={styles.businessName}>{data.businessName}</Text>
            <Text style={styles.text}>ABN: {data.abn}</Text>
            <Text style={styles.text}>{data.businessAddress}</Text>
            <Text style={styles.text}>{data.businessEmail}</Text>
            {data.businessPhone && <Text style={styles.text}>{data.businessPhone}</Text>}
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.sectionTitle}>To:</Text>
            <Text style={styles.businessName}>{data.clientName}</Text>
            <Text style={styles.text}>{data.clientAddress}</Text>
            {data.clientEmail && <Text style={styles.text}>{data.clientEmail}</Text>}
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.infoBox}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Invoice Date: </Text>
                {formatDate(data.invoiceDate)}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Due Date: </Text>
                {dueDate}
              </Text>
            </View>
          </View>
          {data.paymentTerms && (
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>Payment Terms: </Text>
              {data.paymentTerms}
            </Text>
          )}
        </View>

        {/* Line Items Table */}
        <Text style={styles.sectionTitle}>Items / Services</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCol, styles.tableColDescription]}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColQty]}>
              <Text style={styles.tableCellHeader}>Qty</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColPrice]}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColGst]}>
              <Text style={styles.tableCellHeader}>GST</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColTotal, { borderRightWidth: 0 }]}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          {/* Table Rows */}
          {data.lineItems.map((item, index) => {
            const lineTotal = item.quantity * item.unitPrice * (item.includeGST ? 1.1 : 1)
            return (
              <View key={item.id} style={styles.tableRow}>
                <View style={[styles.tableCol, styles.tableColDescription]}>
                  <Text style={styles.tableCell}>{item.description}</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColQty]}>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>{item.quantity}</Text>
                </View>
                <View style={[styles.tableCol, styles.tableColPrice]}>
                  <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                    {formatCurrency(item.unitPrice)}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.tableColGst]}>
                  <Text style={[styles.tableCell, { textAlign: 'center' }]}>
                    {item.includeGST ? '10%' : 'GST-free'}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.tableColTotal, { borderRightWidth: 0 }]}>
                  <Text style={[styles.tableCell, { textAlign: 'right', fontWeight: 'bold' }]}>
                    {formatCurrency(lineTotal)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal (excl. GST):</Text>
            <Text style={styles.totalsValue}>{formatCurrency(totals.subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>GST (10%):</Text>
            <Text style={styles.totalsValue}>{formatCurrency(totals.gstTotal)}</Text>
          </View>
          <View style={styles.totalsFinalRow}>
            <Text style={styles.totalsFinalLabel}>Total (incl. GST):</Text>
            <Text style={styles.totalsFinalValue}>{formatCurrency(totals.total)}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={[styles.infoBox, { marginBottom: 0 }]}>
          {data.paymentMethod === 'bank' && (
            <View>
              <Text style={styles.text}>Payment Method: Bank Transfer</Text>
              {data.bankName && <Text style={styles.text}>Bank: {data.bankName}</Text>}
              {data.bsb && <Text style={styles.text}>BSB: {data.bsb}</Text>}
              {data.accountNumber && <Text style={styles.text}>Account: {data.accountNumber}</Text>}
            </View>
          )}
          {data.paymentMethod === 'paypal' && (
            <View>
              <Text style={styles.text}>Payment Method: PayPal</Text>
              {data.paypalEmail && <Text style={styles.text}>PayPal: {data.paypalEmail}</Text>}
            </View>
          )}
          {data.paymentMethod === 'custom' && data.customPaymentInstructions && (
            <Text style={styles.text}>{data.customPaymentInstructions}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  )
}