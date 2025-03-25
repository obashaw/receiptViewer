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
    <div className="p-4 bg-gray-100 min-h-screen">
      {orderDataFlat.map((order) => {
        // Get line items for this specific order
        const orderLineItems = lineItemsByOrder[order.ORDER_NUMBER] || [];
        
        // Calculate total
        const total = orderLineItems.reduce((sum, item) => 
          sum + (item.PRICE * item.QUANTITY), 0);
        
        // Determine if this is a return transaction
        const isReturn = order.TRANSACTION_TYPE === 'RETURN';

        return (
          <div 
            key={order.ORDER_NUMBER} 
            className="bg-white shadow-md rounded-lg p-6 mb-4"
          >
            <div className="border-b pb-2 mb-4">
              <h2 className="text-xl font-bold">
                Receipt for Order #{order.ORDER_NUMBER}
              </h2>
              <div className="text-sm text-gray-600">
                <p>Date: {order.DATE}</p>
                <p>Customer: {order.CUST_KEY}</p>
                <p>Store: {order.STORE_KEY}</p>
                <p className={isReturn ? 'text-red-600 font-bold' : ''}>
                  Transaction Type: {order.TRANSACTION_TYPE}
                </p>
              </div>
            </div>

            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Product</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderLineItems.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b ${isReturn ? 'text-red-600' : ''}`}
                  >
                    <td>{item.PRODUCT_TYPE} ({item.SKU_NUMBER})</td>
                    <td className="text-right">${item.PRICE.toFixed(2)}</td>
                    <td className="text-right">{item.QUANTITY}</td>
                    <td className="text-right">
                      ${(item.PRICE * item.QUANTITY).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-bold">
              <p className={`text-xl ${isReturn ? 'text-red-600' : ''}`}>
                Total: ${total.toFixed(2)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReceiptViewer;