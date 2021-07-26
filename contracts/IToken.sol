pragma solidity ^0.8.0;

interface IToken {
  function mint(address to, uint amount) external;
  function burn(address owner, uint amount) external;
  function transferFrom(address owner, address to, uint amount) external;
}
