import jsPDF from 'jspdf';

import type { Invoice, LineItem } from '../types';

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate totals
  const calculateSubtotal = () => {
    if (invoice.line_items && Array.isArray(invoice.line_items)) {
      return invoice.line_items.reduce((sum: number, item) => {
        const lineItem = item as unknown as LineItem;
        return sum + (lineItem?.amount || 0);
      }, 0);
    }
    return invoice.amount;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxPercentage = invoice.tax_percentage || 0;
    return (subtotal * taxPercentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Header
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', margin, yPosition);
  
  // Company info (right aligned)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ZaytrixFlow', pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Invoice Management Platform', pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 6;
  pdf.text('support@zaytrixflow.com', pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 20;

  // Invoice details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Invoice Number: ${invoice.invoice_number}`, margin, yPosition);
  yPosition += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Issue Date: ${formatDate(invoice.issue_date)}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Due Date: ${formatDate(invoice.due_date)}`, margin, yPosition);
  yPosition += 6;
  
  // Status
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Status: ${invoice.status.toUpperCase()}`, margin, yPosition);
  
  yPosition += 20;

  // Bill To section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', margin, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(invoice.client_name, margin, yPosition);
  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text(invoice.client_email, margin, yPosition);
  
  yPosition += 20;

  // Line items table
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  
  // Table headers
  const colWidths = [80, 25, 35, 35];
  const colPositions = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]];
  
  pdf.text('Description', colPositions[0], yPosition);
  pdf.text('Qty', colPositions[1], yPosition, { align: 'right' });
  pdf.text('Rate', colPositions[2], yPosition, { align: 'right' });
  pdf.text('Amount', colPositions[3], yPosition, { align: 'right' });
  
  yPosition += 8;
  
  // Draw line under headers
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  
  // Table rows
  pdf.setFont('helvetica', 'normal');
  
  if (invoice.line_items && Array.isArray(invoice.line_items)) {
    invoice.line_items.forEach((item) => {
      if (!item) return;
      const lineItem = item as unknown as LineItem;
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(lineItem.description || '', colPositions[0], yPosition);
      pdf.text((lineItem.quantity || 0).toString(), colPositions[1], yPosition, { align: 'right' });
      pdf.text(formatCurrency(lineItem.rate || 0, invoice.currency), colPositions[2], yPosition, { align: 'right' });
      pdf.text(formatCurrency(lineItem.amount || 0, invoice.currency), colPositions[3], yPosition, { align: 'right' });
      yPosition += 8;
    });
  } else {
    // Single line item from description
    pdf.text(invoice.description || 'Service', colPositions[0], yPosition);
    pdf.text('1', colPositions[1], yPosition, { align: 'right' });
    pdf.text(formatCurrency(invoice.amount, invoice.currency), colPositions[2], yPosition, { align: 'right' });
    pdf.text(formatCurrency(invoice.amount, invoice.currency), colPositions[3], yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Totals section
  const totalsX = pageWidth - 80;
  
  pdf.line(totalsX - 10, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  
  // Subtotal
  pdf.text('Subtotal:', totalsX - 10, yPosition);
  pdf.text(formatCurrency(calculateSubtotal(), invoice.currency), pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 8;
  
  // Tax (if applicable)
  if (invoice.tax_percentage && invoice.tax_percentage > 0) {
    pdf.text(`Tax (${invoice.tax_percentage}%):`, totalsX - 10, yPosition);
    pdf.text(formatCurrency(calculateTax(), invoice.currency), pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 8;
  }
  
  // Total
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.line(totalsX - 10, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  pdf.text('Total:', totalsX - 10, yPosition);
  pdf.text(formatCurrency(calculateTotal(), invoice.currency), pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 20;
  
  // Notes section
  if (invoice.description) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Notes:', margin, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    const splitText = pdf.splitTextToSize(invoice.description, pageWidth - 2 * margin);
    pdf.text(splitText, margin, yPosition);
    yPosition += splitText.length * 6;
  }
  
  yPosition += 10;
  
  // Payment instructions
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Payment Instructions:', margin, yPosition);
  yPosition += 6;
  pdf.text('Please make payment within the specified due date.', margin, yPosition);
  yPosition += 4;
  pdf.text('For any questions regarding this invoice, please contact us at support@zaytrixflow.com', margin, yPosition);
  yPosition += 4;
  pdf.text('Thank you for your business!', margin, yPosition);
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on ${new Date().toLocaleDateString()} by ZaytrixFlow`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  pdf.save(`${invoice.invoice_number}.pdf`);
};
