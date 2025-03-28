import logo from './logo.svg';
import './App.css';
import ReceiptViewer from './ReceiptViewer';
import {
  client,
  useConfig,
  useElementColumns,
  useElementData
} from "@sigmacomputing/plugin";


client.config.configureEditorPanel([
  { name: "orders", type: "element" },
  { name: "lineItems", type: "element" },
  { name: "orderColumns", type: "column", source: "orders", allowMultiple: true},
  { name: "lineItemColumns", type: "column", source: "lineItems", allowMultiple: true}
]);

function App() {
  const config = useConfig();

  const orderData = useElementData(config.orders);
  const orderColumns = useElementColumns(config.orders);
  const lineItemData = useElementData(config.lineItems);
  const lineItemColumns = useElementColumns(config.lineItems);

  
  const orderColumnsKeys = Object.keys(orderData);
  const lineItemColumnsKeys = Object.keys(lineItemData);
  
  const orderColumnMap = Object.fromEntries(
    Object.entries(orderColumns).map(([key, value]) => [value.name, key])
  );
  const lineItemColumnMap = Object.fromEntries(
    Object.entries(lineItemColumns).map(([key, value]) => [value.name, key])
  );
  
  console.log(orderColumnMap);
  console.log(lineItemColumnMap);
  const orderDataFlat = [];
  const liDataFlat = [];

  if (orderColumnsKeys.length > 0) {
    for (let i = 0; i < orderData[orderColumnsKeys[0]].length; i++) { // for each row of data
      let row = { 
        idx: i
      }
      for (let j = 0; j < orderColumnsKeys.length; j++) {
        row[orderColumnsKeys[j].split('/')[1]] = orderData[orderColumnsKeys[j]][i];
      } 
      orderDataFlat.push(row);
    }
  }

  if (lineItemColumnsKeys.length > 0) {
    for (let i = 0; i < lineItemData[lineItemColumnsKeys[0]].length; i++) { // for each row of data
      let row = { 
        idx: i
      }
      for (let j = 0; j < lineItemColumnsKeys.length; j++) {
        row[lineItemColumnsKeys[j].split('/')[1]] = lineItemData[lineItemColumnsKeys[j]][i];
      } 
      liDataFlat.push(row);
    }
  }


  return (
    <div className="App">
      {orderDataFlat.length > 0 && liDataFlat.length > 0 && (
        <ReceiptViewer 
          orderDataFlat={orderDataFlat} 
          lineItemDataFlat={liDataFlat} 
        />
      )}
    </div>
  );
}

export default App;
