import React from 'react';

const ReceiptViewer = ({ orderDataFlat, lineItemDataFlat }) => {
  // Group line items by order number
  const lineItemsByOrder = lineItemDataFlat.reduce((acc, item) => {
    if (!acc[item.ORDER_NUMBER]) {
      acc[item.ORDER_NUMBER] = [];
    }
    acc[item.ORDER_NUMBER].push(item);
    return acc;
  }, {});

  return (
    <div>
      {orderDataFlat.map((order) => {
        // Get line items for this specific order
        const orderLineItems = lineItemsByOrder[order.ORDER_NUMBER] || [];
        
        // Calculate total
        const total = orderLineItems.reduce((sum, item) => 
          sum + (item.PRICE * item.QUANTITY), 0);
        
        // Determine if this is a return transaction
        const isReturn = order.TRANSACTION_TYPE === 'Return';

        return (
          <div key={order.ORDER_NUMBER}>
            <h2>Receipt for Order #{order.ORDER_NUMBER}</h2>
            
            <div>Date: {order.DATE}</div>
            
            <div>Customer: {order.CUST_KEY} | Store: {order.STORE_KEY}</div>
            
            <div>Transaction Type: {order.TRANSACTION_TYPE}</div>
            
            {isReturn && (
              <div>** RETURN **</div>
            )}

            {orderLineItems.map((item, index) => (
              <div key={index}>
                <div>SKU: {item.SKU_NUMBER}</div>
                <div style={{marginLeft: '20px'}}>
                  <div>Product Type: {item.PRODUCT_TYPE}</div>
                  <div>Quantity: {item.QUANTITY}</div>
                  <div>Price: ${item.PRICE.toFixed(2)}</div>
                  <div>Subtotal: ${(item.PRICE * item.QUANTITY).toFixed(2)}</div>
                </div>
              </div>
            ))}

            <div>Total: ${total.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ReceiptViewer;