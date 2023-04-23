import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockData, setBlockData] = useState();
  const [gas, setGas] = useState();
  const [blockDetail, setBlockDetail] = useState();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    getBlockNumber();

    async function getBlock(){
      const blockNumber = await alchemy.core.getBlockNumber();
      const block = await alchemy.core.getBlock(blockNumber)
      setBlockData(block);
    }
    getBlock();

    async function getBlockWithTransactions(){
      const blockNumber = await alchemy.core.getBlockNumber();
      const res = await alchemy.core.getBlockWithTransactions(blockNumber)
      setBlockDetail(res);
      setTransactions(res.transactions);
    }
    getBlockWithTransactions();

    async function getGasPrice(){
      setGas(await alchemy.core.getGasPrice())
    }

    getGasPrice();
    
  },[blockData]);
  
  const splitTransactions = transactions.map(trans => {
    return (
      <div className='transaction-block'>
          <p>Hash : {trans.hash.slice(0,15)}...{trans.hash.slice(-15)}</p>
          <p>From : {trans.from}</p>
          <p>To : {trans.to}</p>
      </div>
    )
  })

  const formatDate = (unixTimeStamp) => {
    const date = new Date(unixTimeStamp * 1000);
    return `${date.toLocaleDateString()} | ${date.toLocaleTimeString()}`;
};

  return (
    <div className="App">
      <div className='nav'>
        <h1>Ethereum Blockchain Explorer</h1>
        {gas && (
        <p>Gas Price: {Math.floor(gas.toString()/1000000000)} Gwei</p>
      )}
      </div>
      <main>
      
        <div className='latestBlock'>
          <h2>Latest Blocks</h2>
          <h3>Block Number: {blockNumber}</h3>
          <h5>Block Number: {blockNumber-1}</h5>
          <h5>Block Number: {blockNumber-2}</h5>
          <h5>Block Number: {blockNumber-3}</h5>
          <h5>Block Number: {blockNumber-4}</h5>
          <h5>Block Number: {blockNumber-5}</h5>
        </div>

        <div className='blockdetail'>
          <h2>Block Detail</h2>
          {blockData && (
            <ul>
              <li>Number: {blockData.number}</li>
              <li>Hash: {blockData.hash.slice(0,15)}...{blockData.hash.slice(-15)}</li>
              <li>Parent Hash: {blockData.parentHash.slice(0,15)}...{blockData.parentHash.slice(-15)}</li>
              <li>Timestamp: {formatDate(blockData.timestamp)}</li>
              <li>Gas Limit: {blockData.gasLimit.toString()}</li>
              <li>Gas Used: {blockData.gasUsed.toString()}</li>
            </ul>
          )}
        </div>

      <div className='latest-trans'>
        <h2>Latest Transactions</h2>
        {blockDetail && (
        
            <p>Transactions :{splitTransactions}</p>
        
        )}  
      </div>
      
      </main>
    </div>
  );

}

export default App;
