//import ✔️
//deploy func ✔️
//export.default ✔️
/*
    async function deployFunc(hre) {
        //mainCode
    }
    module.exports.default = deployFunc;
*/

const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // if chainId is X use address a
    // if chainId is Y use address b
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    //if the contract does not exist, we deploy a minimal version for our local testing

    //well what happen when we want to change chains?
    //we are going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put priceFeed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify... 🔍
        await verify(fundMe.address, args);
    }
    log("-----------------------------------");
};

module.exports.tags = ["all", "fundme"];
