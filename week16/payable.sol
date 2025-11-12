//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Will{
    uint public totalBalance;
    address payable public owner;
    address public recipientAddress;
    uint pingStamp;

    constructor(){
        owner=payable(msg.sender);
    }

    modifier ownerOnly {
        require(owner==msg.sender, "only the owner is allowed.");
        _;
    }
    modifier willCheck(address _address) {
        require(pingStamp+(1 hours* 24* 365) < block.timestamp, "owner is still alive.");
        require(_address==recipientAddress, "only the will adress can drain.");
        _;
    }

    function defineRecipient(address _address) public ownerOnly{
        recipientAddress=_address;
    }
    function changeRecipient(address _address) public ownerOnly{
        recipientAddress=_address;
    }
    function addBalance() public payable ownerOnly{
        totalBalance+=msg.value;
    }
    function withdrawBalance(uint amount) public ownerOnly{
        require(amount<=totalBalance, "invalid amount.");
        payable(owner).transfer(amount);
        totalBalance-=amount;
    }
    function pingByOwner() public ownerOnly{
        pingStamp=block.timestamp;
    }
    function draintheWill(address payable _address) public willCheck(_address) {
        payable(_address).transfer(totalBalance);
        totalBalance=0;
    }
}