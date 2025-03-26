import React from 'react';
import { format, fromUnixTime } from "date-fns";

const ReceiptViewer = ({ orderDataFlat, lineItemDataFlat }) => {
  // Group line items by order number
  const lineItemsByOrder = lineItemDataFlat.reduce((acc, item) => {
    if (!acc[item.ORDER_NUMBER]) {
      acc[item.ORDER_NUMBER] = [];
    }
    acc[item.ORDER_NUMBER].push(item);
    return acc;
  }, {});

  const receiptContainerStyles = {
    maxWidth: '300px',
    width: '100%',
    overflow: 'visible' /* Ensures full content visibility */
  }
  // Base styles for the receipt
  const receiptStyles = {
    backgroundColor: '#ffffff', // 1. White background
    padding: '20px', // 2. More spacing (outer padding)
    marginBottom: '30px',
    border: '2px solid black',
    maxWidth: '300px',
    width: '100%',
    marginLeft: '20px',
    marginTop: '20px'
  }; 


  return (
    <div style={receiptContainerStyles}>
      {orderDataFlat.map((order) => {
        const orderLineItems = lineItemsByOrder[order.ORDER_NUMBER] || [];
        const total = orderLineItems.reduce((sum, item) => 
          sum + (item.PRICE * item.QUANTITY), 0);
        const isReturn = order.TRANSACTION_TYPE === 'Return';

        // Conditional styles based on return status
        const containerStyles = {
          ...receiptStyles,
          color: isReturn ? '#ff0000' : '#000000', // 4. Red text for returns
        };

        return (
          <div key={order.ORDER_NUMBER} style={containerStyles}>
            <h2 style={{ marginBottom: '15px' }}>
              ReceiptViewer #{order.ORDER_NUMBER}
            </h2>
            
            <div style={{ marginBottom: '10px' }}>
              Date: {format(fromUnixTime(order.DATE / 1000), 'yyyy-MM-dd')}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              Customer: {order.CUST_KEY} | Store: {order.STORE_KEY}
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              Transaction Type: {order.TRANSACTION_TYPE}
            </div>
            
            {isReturn && (
              <div style={{ marginBottom: '15px' }}>
                ** RETURN **
              </div>
            )}

            {orderLineItems.map((item, index) => {
              const isVoid = item.SKU_NUMBER === 'AU2878977250';
              return (
              <div 
                key={index}
                style={{ 
                  marginBottom: '20px', // 3. Empty line between line items
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
  );
};

export default ReceiptViewer;