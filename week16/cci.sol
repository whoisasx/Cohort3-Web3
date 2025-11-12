//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IStorage{
    function getNum() external view return(uint);
    function add() external;
}

contract CCI{
    address private storageAddress;
    constructor(address _storageAddress){
        storageAddress=_storageAddress;
    }
    function proxyAdd() public{
        IStorage(storageAddress).add();
    }
    function proxyGetNum() public view return(uint){
        return IStorage(storageAddress).getNum();
    }
}