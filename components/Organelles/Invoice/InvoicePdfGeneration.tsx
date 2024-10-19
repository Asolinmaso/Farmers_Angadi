import { PDFDocument, rgb } from 'pdf-lib';

// Function to generate invoice PDF
export async function generateInvoicePDF({
  userName,
  paymentId,
  cartItems,
  totalAmount,
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const { width, height } = page.getSize();
  const fontSize = 14;

  // Add title and user details
  page.drawText('INVOICE', { x: 50, y: height - 50, size: 20, color: rgb(0, 0, 0) });
  page.drawText(`Customer: ${userName}`, { x: 50, y: height - 80, size: fontSize });
  page.drawText(`Payment ID: ${paymentId}`, { x: 50, y: height - 100, size: fontSize });

  // Add table headers
  page.drawText('Item', { x: 50, y: height - 140, size: fontSize });
  page.drawText('Quantity', { x: 300, y: height - 140, size: fontSize });
  page.drawText('Price', { x: 400, y: height - 140, size: fontSize });

  // Add cart items to the PDF
  let itemYPosition = height - 160;
  cartItems.forEach((item) => {
    const product = item.productDetails;
    const productName = product.name;
    const quantity = item.productCount;
    const price = (product.cost - product.discount) * quantity;
    
    page.drawText(productName, { x: 50, y: itemYPosition, size: fontSize });
    page.drawText(`${quantity}`, { x: 300, y: itemYPosition, size: fontSize });
    page.drawText(`${price.toFixed(2)}`, { x: 400, y: itemYPosition, size: fontSize });

    itemYPosition -= 20;
  });

  // Add total amount
  page.drawText(`Total: ${totalAmount.toFixed(2)}`, {
    x: 400,
    y: itemYPosition - 20,
    size: fontSize,
    color: rgb(0, 0, 1),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Create a Blob and trigger the download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `invoice_${paymentId}.pdf`;
  link.click();
}
