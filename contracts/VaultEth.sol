pragma solidity ^0.8.0;

import './VaultBase.sol';

contract VaultEth is VaultBase {
  constructor(address token) VaultBase(token) {}
}
