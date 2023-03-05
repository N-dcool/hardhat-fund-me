// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title A contract for crowd funding.
 * @author Naresh Choudhary
 * @notice this contract is to demo a simple funding contract 
 * @dev this implements price feeds as our library
 */
contract FundMe {
    using PriceConverter for uint256; 

    //state variables!
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address public immutable i_owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmount;
    
    AggregatorV3Interface public priceFeed;

    //modifiers!
    modifier OnlyOwner(){
        //require(msg.sender == i_owner, "You are not the Owner of contract");
        if(msg.sender != i_owner){
            revert FundMe__NotOwner();
        }
        _;
    }

    //functions inorder !
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }

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

    
    
}