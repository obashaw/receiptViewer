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

/*
    General workflow
    1. specify data sources + necessary columns in config options.  all columns should exist in sigma tables
    2. get the data (should be 1 row for header table, many rows for other fct table)
    3. package data into shape that receipt viewer will like
    4. pass to receipt viewer (this needs to be built, will determine step 3)

    user selects receipt, filters 2 fact tables
    plugin accepts these filtered tables as sources
    need to hardcode on column names (client.config.getElementColumns(elementId)) --
    find header values

    Q's for Prashant
    1. does this workflow sound right?
    2. best practices for working w plugins in sigma
      - how to develop most efficiently (any thoughts on Jon's use of v0)
      - designing for performance
    3. when to recommend plugins, translating existing code from prospect
  */

function App() {
  const config = useConfig();
  const orderColumns = useElementColumns(config.orders);
  const lineItemColumns = useElementColumns(config.lineItems);

  const orderData = useElementData(config.orders);
  const lineItemData = useElementData(config.lineItems);
  
  const orderColumnsKeys = Object.keys(orderData);
  const lineItemColumnsKeys = Object.keys(lineItemData);
  const orderDataFlat = [];
  const liDataFlat = [];
  // if (orderColumns) {
  //   console.log(orderColumns);
  // }
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

  if (orderDataFlat.length > 0 && liDataFlat.length > 0) {
    console.log(orderDataFlat);
    console.log(liDataFlat);
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
