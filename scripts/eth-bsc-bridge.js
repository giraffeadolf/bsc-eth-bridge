const Web3 = require('web3');
const VaultEth = require('../build/contracts/VaultEth.json');
const VaultBsc = require('../build/contracts/VaultBsc.json');

const web3Eth = new Web3('');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const vaultEth = new web3Eth.eth.Contract(
  VaultEth.abi,
  VaultEth.networks['4'].address
);

const vaultBsc = new web3Bsc.eth.Contract(
  VaultBsc.abi,
  VaultBsc.networks['97'].address
);

var x = 1000; // eth
var y = 1000; // bsc
var k = x * y;

vaultEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce, signature } = event.returnValues;

  var newAmount = y - k / (x + amount);

  const tx = vaultBsc.methods.unlock(from, to, newAmount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: vaultBsc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${newAmount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
});

vaultBsc.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce, signature } = event.returnValues;

  var newAmount = x - k / (y + amount);

  const tx = vaultEth.methods.unlock(from, to, newAmount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Eth.bsc.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: vaultEth.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Eth.bsc.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${newAmount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
});
