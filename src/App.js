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

  const orderColumnMap = Object.fromEntries(
    Object.entries(orderColumns).map(([key, value]) => [key, value.name])
  );
  const lineItemColumnMap = Object.fromEntries(
    Object.entries(lineItemColumns).map(([key, value]) => [key, value.name])
  );
  
  const orderColumnsKeys = Object.keys(orderData);
  const lineItemColumnsKeys = Object.keys(lineItemData);

  const orderDataFlat = [];
  const liDataFlat = [];
 
  if (orderColumnsKeys.length > 0 && Object.keys(orderColumnMap).length >0 ) {
    for (let i = 0; i < orderData[orderColumnsKeys[0]].length; i++) { // for each row of data
      let row = { 
        idx: i
      }
      for (let j = 0; j < orderColumnsKeys.length; j++) { // for each column 
        let colName = orderColumnMap[orderColumnsKeys[j]].toUpperCase();
        let colValue = orderData[orderColumnsKeys[j]][i];
        row[colName] = colValue;
      } 
      orderDataFlat.push(row);
    }
  }

  if (lineItemColumnsKeys.length > 0 && Object.keys(lineItemColumnMap).length >0) {
    for (let i = 0; i < lineItemData[lineItemColumnsKeys[0]].length; i++) { // for each row of data
      let row = { 
        idx: i
      }
      for (let j = 0; j < lineItemColumnsKeys.length; j++) { // for each column
        let colName = lineItemColumnMap[lineItemColumnsKeys[j]].toUpperCase();
        let colValue = lineItemData[lineItemColumnsKeys[j]][i];
        row[colName] = colValue;
      } 
      liDataFlat.push(row);
    }
  }
  if (orderDataFlat.length === 0 && liDataFlat.length ===0) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        marginBottom: '30px',
        border: '2px solid black',
        maxWidth: '300px',
        width: '100%',
        marginLeft: '20px',
        marginTop: '20px'
      }} >
        <h2 style={{ marginBottom: '15px' , textAlign: 'center'}}>
          Receipt Viewer
        </h2>
        <h4>Select a transaction to view receipt</h4>
      </div>
    )
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
