import React, { useRef } from 'react';
import { format, fromUnixTime } from "date-fns";
import html2pdf from 'html2pdf.js';

const ReceiptViewer = ({ orderDataFlat, lineItemDataFlat }) => {
  // Group line items by order number
  const lineItemsByOrder = lineItemDataFlat.reduce((acc, item) => {
    if (!acc[item.ORDER_NUMBER]) {
      acc[item.ORDER_NUMBER] = [];
    }
    acc[item.ORDER_NUMBER].push(item);
    return acc;
  }, {});

  const receiptContainerRef = useRef();

  const receiptContainerStyles = {
    maxWidth: '300px',
    width: '100%',
    overflow: 'visible' /* Ensures full content visibility */
  }
  
  // Base styles for the receipt
  const receiptStyles = {
    backgroundColor: '#ffffff',
    padding: '20px',
    marginBottom: '30px',
    border: '2px solid black',
    maxWidth: '300px',
    width: '100%',
    marginLeft: '20px',
    marginTop: '20px'
  };

  // Download button styles
  const downloadButtonStyles = {
    backgroundColor: '#4361ee',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '20px',
    cursor: 'pointer',
    borderRadius: '4px'
  };

  // Handle PDF download functionality
  const handleDownloadPDF = () => {
    // Options for the PDF generation
    const options = {
      margin: [10, 10, 10, 10],
      filename: 'receipts.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Generate and download PDF
    html2pdf().from(receiptContainerRef.current).set(options).save();
  };

  return (
    <div>
      <button 
        style={downloadButtonStyles} 
        onClick={handleDownloadPDF}
      >
        Download as PDF
      </button>
      
      <div ref={receiptContainerRef} style={receiptContainerStyles}>
        {orderDataFlat.map((order) => {
          const orderLineItems = lineItemsByOrder[order.ORDER_NUMBER] || [];
          const total = orderLineItems.reduce((sum, item) => 
            sum + (item.PRICE * item.QUANTITY), 0);
          const isReturn = order.TRANSACTION_TYPE === 'Return';

          // Conditional styles based on return status
          const containerStyles = {
            ...receiptStyles,
            color: isReturn ? '#ff0000' : '#000000',
          };

          return (
            <div key={order.ORDER_NUMBER} style={containerStyles} className="receipt">
              <h2 style={{ marginBottom: '15px' , textAlign: 'center'}}>
                ReceiptViewer #{order.ORDER_NUMBER}
              </h2>
              
              <div style={{ marginBottom: '10px' , textAlign: 'center'}}>
                Date: {format(fromUnixTime(order.DATE / 1000), 'yyyy-MM-dd')}
              </div>
              
              <div style={{ marginBottom: '10px' , textAlign: 'center'}}>
                Customer: {order.CUST_KEY} | Store: {order.STORE_KEY}
              </div>
              
              <div style={{ marginBottom: '15px' , textAlign: 'center'}}>
                Transaction Type: {order.TRANSACTION_TYPE}
              </div>
              
              {isReturn && (
                <div style={{ marginBottom: '15px' , textAlign: 'center' }}>
                  ** RETURN **
                </div>
              )}

              {orderLineItems.map((item, index) => {
                const isVoid = item.SKU_NUMBER === 'AU2878977250';
                return (
                <div 
                  key={index}
                  style={{ 
                    marginBottom: '20px',
                    textAlign: 'left',
                    color: isVoid ? 'red' : 'black'
                  }}
                >
                  {isVoid && <div style={{ fontWeight: 'bold' , textAlign:'center' }}>** VOID **</div>}
                  <div style={{ marginBottom: '5px' }}>
                    SKU: {item.SKU_NUMBER}
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    <div style={{ marginBottom: '5px' }}>
                      Product Type: {item.PRODUCT_TYPE}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      Quantity: {item.QUANTITY}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      Price: ${item.PRICE.toFixed(2)}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      Subtotal: ${(item.PRICE * item.QUANTITY).toFixed(2)}
                    </div>
                  </div>
                </div>
                );
              })}

              <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                Total: ${total.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReceiptViewer;