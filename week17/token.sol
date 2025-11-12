//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CustomToken{
    address owner;
    mapping(address=>uint) balances;
    uint totalSupply;

    modifier ownerOnly {
        require(owner==msg.sender,"only the owner is allowed");
        _;
    }

    constructor(){
        owner=msg.sender;
    }

    function mint(uint amount) public ownerOnly {
        balances[msg.sender]+=amount;
        totalSupply+=amount;
    }
    function mintTo(address _address, uint amount) public ownerOnly{
        balances[_address]+=amount;
        totalSupply+=amount;
    }
    function transfer(address reciever, uint amount) public {
        require(balances[msg.sender]>=amount, "invalid amount");
        balances[msg.sender]-=amount;
        balances[reciever]+=amount;
    }
}