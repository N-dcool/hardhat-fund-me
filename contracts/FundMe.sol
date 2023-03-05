// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256; 

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address public immutable i_owner;
    
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    address[] public funders;
    mapping(address => uint256) public addressToAmount;

    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, " Not enough money send :( ");
        funders.push(msg.sender);
        addressToAmount[msg.sender] += msg.value;
    }

    function withdraw() public OnlyOwner{
        for(uint256 i=0; i < funders.length; i++ ){
            address funder = funders[i];
            addressToAmount[funder] = 0;
        }
        //reseting funders Array to empty:
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Transaction failed due to some error");

    }

    modifier OnlyOwner(){
        //require(msg.sender == i_owner, "You are not the Owner of contract");
        if(msg.sender != i_owner){
            revert NotOwner();
        }
        _;
    }

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }
    
}