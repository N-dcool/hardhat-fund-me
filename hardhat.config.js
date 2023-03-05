require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
// require("hardhat-deploy");
require("hardhat-deploy");

const GOERLI_RCP_URL = process.env.GOERLI_RCP_URL || "https://www.random.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x1234";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "0x1234";
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY || "0x1234";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    //solidity: "0.8.18",
    solidity: {
        compilers: [{ version: "0.8.18" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        goerli: {
            url: GOERLI_RCP_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    },
    namedAccounts: {
        deployer: {
            default: 0,
            31337: 1,
        },
        user: {
            default: 1,
        },
    },
};
