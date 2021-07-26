const TokenEth = artifacts.require('TokenEth.sol');
const TokenBsc = artifacts.require('TokenBsc.sol');
const VaultEth = artifacts.require('VaultEth.sol');
const VaultBsc = artifacts.require('VaultBsc.sol');

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    await deployer.deploy(TokenEth);
    const tokenEth = await TokenEth.deployed();
    await tokenEth.mint(addresses[0], 1000);
    await deployer.deploy(VaultEth, tokenEth.address);
    const vaultEth = await VaultEth.deployed();
    await tokenEth.updateAdmin(vaultEth.address);
  }
  if(network === 'bscTestnet') {
    await deployer.deploy(TokenBsc);
    const tokenBsc = await TokenBsc.deployed();
    await tokenBsc.mint(addresses[0], 1000);
    await deployer.deploy(VaultBsc, tokenBsc.address);
    const vaultBsc = await VaultBsc.deployed();
    await tokenBsc.updateAdmin(vaultBsc.address);
  }
};
