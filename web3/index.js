import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import DYABI_TEST from "./ABI_TEST.json"
import ROUTER_ABI from "./ROUTER_ABI.json"
import ROUTER_ABI_PANCAKE from "./ROUTER_ABI_PANCAKE.json"
import * as sigUtil from "eth-sig-util";

const Web3Service = {
    TEST_NETWORK: 97,
    NETWORK: 56,

    currentAddr: null,
    shortAddr: null,
    web3: undefined,
    vaultContract: undefined,
    dyntxContract: undefined,
    isApprovalRequired: true,

    intervalUpdate: null,
    isConnectedWallet: false,
    currNetworkID: 0,
    userCompound: false,
    tokenLists: [{
            id: 1,
            name: 'BNB',
            sub_name: 'bnb',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png',
            // addr: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
            addr: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            decimals: 1e18
        },
        {
            id: 2,
            name: 'BTC',
            sub_name: 'btc',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png',
            addr: "",
            decimals: 1e18
        },
        {
            id: 3,
            name: 'ETH',
            sub_name: 'eth',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png',
            addr: "",
            decimals: 1e18
        },
        {
            id: 4,
            name: 'USDT',
            sub_name: 'usd',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png',
            addr: "",
            decimals: 1e18
        },
        {
            id: 5,
            name: 'DYNXT',
            sub_name: 'dynxt',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png',
            addr: "0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396",
            decimals: 1e18,
            // addr: "0x20fc2979e9c229a19710692299677f21d623887d",
            // decimals: 1e9
        }
    ],
    TEST_DYNXT_ADDRESS: "0xd78eF7A942B5d653BE532e810A287cDee3eE51Db",
    TEST_DYNXT_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokensSellToAddToLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operationWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reservedWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operationWallet","type":"address"}],"name":"setOperationgWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reservedWallet","type":"address"}],"name":"setReservedWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFiveThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFourThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierOneThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierThreeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierTwoThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFiveThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFourThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierOneThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierThreeThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierTwoThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
    TEST_ROUTER_ADDRESS: "0x3E3DE45447Cc22664a58d2F33Cd664650448E85a",
    TEST_ROUTER_ABI: DYABI_TEST,
    TEST_FACTORY_ADDRESS: "0x8F9ce3b55e564586a9AaE9a37850bbf70f560F2c",
    TEST_FACTORY_ABI: [{ "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "address", "name": "pair", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "PairCreated", "type": "event" }, { "constant": true, "inputs": [], "name": "INIT_CODE_PAIR_HASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allPairs", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "allPairsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "createPair", "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "feeToSetter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }], "name": "setFeeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "name": "setFeeToSetter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }],
    TEST_BNB_ADD: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    TEST_CRYPTO_ADD: "0x20fc2979e9c229a19710692299677f21d623887d",

    ROUTER_ADDRESS: "0x31bc4C4fC335895082ae9f7a78f3bF58f5CBB2ec",
    ROUTER_ABI: ROUTER_ABI,
    FACTORY_ADDRESS: "0xff43aDdccf2Cc1b280836ffa285DF58992C615C3",
    FACTORY_ABI: [{ "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "address", "name": "pair", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "PairCreated", "type": "event" }, { "constant": true, "inputs": [], "name": "INIT_CODE_PAIR_HASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allPairs", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "allPairsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "createPair", "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "feeToSetter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }], "name": "setFeeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "name": "setFeeToSetter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }],
    ROUTER_ADDRESS_PANCAKE: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    ROUTER_ABI_PANCAKE: ROUTER_ABI_PANCAKE,
    FACTORY_ADDRESS_PANCAKE: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    FACTORY_ABI_PANCAKE: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    
    DYNXT_TOKEN_ADDRESS: "0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396",
    // DYNXT_TOKEN_ABI: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "minTokensBeforeSwap", "type": "uint256" }], "name": "MinTokensBeforeSwapUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokensSwapped", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethReceived", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensIntoLiqudity", "type": "uint256" }], "name": "SwapAndLiquify", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "SwapAndLiquifyEnabledUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "onOwnershipTransferred", "type": "event" }, { "inputs": [], "name": "_maxTxAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "excludeFromFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "includeInFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isExcludedFromFee", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numTokensSellToAddToLiquidity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "operationWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reservedWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "maxTxAmount", "type": "uint256" }], "name": "setMaxTxAmount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operationWallet", "type": "address" }], "name": "setOperationgWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_reservedWallet", "type": "address" }], "name": "setReservedWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_enabled", "type": "bool" }], "name": "setSwapAndLiquifyEnabled", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierFiveThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierFourThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierOneThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierThreeThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierTwoThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "swapAndLiquifyEnabled", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierFiveThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierFourThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierOneThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierThreeThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierTwoThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapV2Pair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uniswapV2Router", "outputs": [{ "internalType": "contract IUniswapV2Router02", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }],
    BNB_TOKEN_ADDRESS: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    // BNB_TOKEN_ABI: [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }],

    vault1Index: -1,
    vault2Index: -1,
    vault3Index: -1,
    vault4Index: -1,

    // VAULT_ADDRESS: "0x0b03540D9a1304458079E1Dc1eF5B1B13CbdFfB3",
    // VAULT_ABI: [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AddRewardTokens", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "tokenRecovered", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AdminTokenRecovery", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" }], "name": "Harvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_minimumDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_percentage", "type": "uint256" }, { "internalType": "uint256", "name": "_duration", "type": "uint256" }, { "internalType": "bool", "name": "_isEnabled", "type": "bool" }], "name": "addOrUpdateLock", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "addRewardTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "emergencyRewardWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "getLock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getStakingAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "getUserAllInvestments", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bool[]", "name": "", "type": "bool[]" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserCompund", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "getUserInfo", "outputs": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "reward", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAt", "type": "uint256" }, { "internalType": "uint256", "name": "stakedAt", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "canWithdraw", "type": "bool" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint256", "name": "_upto", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getUserVaults", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "harvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "harvestAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IBEP20", "name": "_stakedToken", "type": "address" }, { "internalType": "contract IBEP20", "name": "_rewardToken", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "isInitialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lockId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "lockInfo", "outputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }, { "internalType": "uint256", "name": "minimumDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "percentage", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "isEnabled", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxVault", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "pendingReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" }], "name": "recoverWrongTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "rewardOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IBEP20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "rewardsOfLockId", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_compound", "type": "bool" }], "name": "setCompound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_maxVault", "type": "uint256" }], "name": "setMaxVault", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stakedToken", "outputs": [{ "internalType": "contract IBEP20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRewardTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStakingTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "withdrawAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],

    VAULT_ADDRESS: "0x758e514d2233b061F9cA0228Cf0Dd3faAB93733b",
    VAULT_ABI: [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AddRewardTokens", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "tokenRecovered", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AdminTokenRecovery", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" }], "name": "Harvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_minimumDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_percentage", "type": "uint256" }, { "internalType": "uint256", "name": "_duration", "type": "uint256" }, { "internalType": "bool", "name": "_isEnabled", "type": "bool" }], "name": "addOrUpdateLock", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "addRewardTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "emergencyRewardWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "getLock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getStakingAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "getUserAllInvestments", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bool[]", "name": "", "type": "bool[]" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserCompund", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "getUserInfo", "outputs": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "reward", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAt", "type": "uint256" }, { "internalType": "uint256", "name": "stakedAt", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "canWithdraw", "type": "bool" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint256", "name": "_upto", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getUserVaults", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "harvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "harvestAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IBEP20", "name": "_stakedToken", "type": "address" }, { "internalType": "contract IBEP20", "name": "_rewardToken", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "isInitialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lockId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "lockInfo", "outputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }, { "internalType": "uint256", "name": "minimumDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "percentage", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "isEnabled", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxVault", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "pendingReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" }], "name": "recoverWrongTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "rewardOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IBEP20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "rewardsOfLockId", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_compound", "type": "bool" }], "name": "setCompound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_maxVault", "type": "uint256" }], "name": "setMaxVault", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stakedToken", "outputs": [{ "internalType": "contract IBEP20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRewardTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStakingTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "withdrawAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
    DYNTX_ADDRESS: "0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396",
    DYNTX_ABI: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "minTokensBeforeSwap", "type": "uint256" }], "name": "MinTokensBeforeSwapUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokensSwapped", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethReceived", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensIntoLiqudity", "type": "uint256" }], "name": "SwapAndLiquify", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "SwapAndLiquifyEnabledUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "onOwnershipTransferred", "type": "event" }, { "inputs": [], "name": "_maxTxAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "excludeFromFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "includeInFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isExcludedFromFee", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numTokensSellToAddToLiquidity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "operationWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reservedWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "maxTxAmount", "type": "uint256" }], "name": "setMaxTxAmount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operationWallet", "type": "address" }], "name": "setOperationgWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_reservedWallet", "type": "address" }], "name": "setReservedWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_enabled", "type": "bool" }], "name": "setSwapAndLiquifyEnabled", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierFiveThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierFourThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierOneThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierThreeThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierTwoThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "swapAndLiquifyEnabled", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierFiveThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierFourThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierOneThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierThreeThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierTwoThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapV2Pair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uniswapV2Router", "outputs": [{ "internalType": "contract IUniswapV2Router02", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }],

    eventTransactions: undefined,
    isWalletConnectProtocol: false,

    /*Current Working Vault*/
    currentVault: 0,
    currentIndex: -1,
    currentStake: 0,
    currentCanWithdraw: false,
    currentWithdrawAt: 0,
    currentPendingReward: 0,
    
    toPlainString(num) {
        return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
            function(a,b,c,d,e) {
            return e < 0
                ? b + '0.' + Array(1-e-c.length).join(0) + c + d
                : b + c + d + Array(e-d.length+1).join(0);
            });
    },

    sliceStringWithPlaceCount(num, count) {
        return this.toPlainString(num).slice(0, count);
    },

    async init() {
        // this.web3_read = new Web3('https://bsc-dataseed.binance.org/');
        this.web3_read = await new Web3('https://speedy-nodes-nyc.moralis.io/9f1fe98d210bc4fca911bee2/bsc/mainnet');
        this.dyContractForRead = await new this.web3_read.eth.Contract(this.ROUTER_ABI_PANCAKE, this.ROUTER_ADDRESS_PANCAKE);
        this.dyContractForReadWithLP = await new this.web3_read.eth.Contract(this.ROUTER_ABI, this.ROUTER_ADDRESS);
    },

    /**CONNECT**/
    async Connect() {
        this.isWalletConnectProtocol = false;
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum)
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                let accounts = await window.ethereum.request({ method: 'eth_accounts' })
                this.currentAddr = accounts[0]
                window.ethereum.on('chainChanged', (chainId) => {
                    window.location.reload();
                });
                await this.runAPP()
                return
            } catch (error) {
                console.error(error)
            }
        }
    },

    /**RUN APP**/
    async runAPP() {
        this.currNetworkID = await this.web3.eth.net.getId()
        console.log("NetworkId = " + this.currNetworkID);
        if (this.currNetworkID == this.NETWORK) {
            this.vaultContract = await new this.web3.eth.Contract(this.VAULT_ABI, this.VAULT_ADDRESS);
            this.dyntxContract = await new this.web3.eth.Contract(this.DYNTX_ABI, this.DYNTX_ADDRESS);
            this.isConnectedWallet = true;

            //exchange
            this.dyContract = await new this.web3.eth.Contract(this.ROUTER_ABI_PANCAKE, this.ROUTER_ADDRESS_PANCAKE);

            this.update();
            //this.intervalUpdate = setInterval(this.update, 5000);
        } else {
            if (window.ethereum) {
                const data = [{
                        chainId: '0x38', //mainnet
                        //chainId: '0x61',
                        chainName: 'Binance Smart Chain',
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB',
                            decimals: 18
                        },
                        rpcUrls: ['https://bsc-dataseed.binance.org/'],
                        blockExplorerUrls: ['https://bscscan.com/'],
                    }]
                    /* eslint-disable */
                const tx = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
                if (tx) {
                    console.log(tx)
                }
            }
        }
    },

    /** UPDATE **/
    async update() {
        console.log("Web3Service Update")
            //this.getCurrentWallet();
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if (accounts.length > 0) {
                this.currentAddr = accounts[0];
                this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];
            }
        }

        if (this.vaultContract != undefined && this.currentAddr != null) {
            this.vaultContract.methods.getUserAllInvestments(this.currentAddr).call().then(res => {
                // return (indexes, locks, withdraws, totalInvesment);
                //res[0] //Indexes
                //res[1] Locks 
                //res[2] withdrawn
                //res[3] totalInvestment
                var _vault1Index = -1;
                var _vault2Index = -1;
                var _vault3Index = -1;
                var _vault4Index = -1;

                for (var i = 0; i < res[3]; i++) {
                    //lockID = 1;
                    if (res[1][i] == 1) {
                        if (res[2][i] == false) {
                            //All deposits were withdrawn
                        } else {
                            _vault1Index = res[0][i];
                        }
                    }
                    //lockID = 2
                    if (res[1][i] == 2) {
                        if (res[2][i] == false) {
                            //All deposits were withdrawn
                        } else {
                            _vault2Index = res[0][i];
                        }
                    }
                    //lockID = 3
                    if (res[1][i] == 3) {
                        if (res[2][i] == false) {
                            //All deposits were withdrawn
                        } else {
                            _vault3Index = res[0][i];
                        }
                    }

                    //lockID = 4
                    if (res[1][i] == 4) {
                        if (res[2][i] == false) {
                            //All deposits were withdrawn
                        } else {
                            _vault4Index = res[0][i];
                        }
                    }
                }
                this.vault1Index = _vault1Index;
                this.vault2Index = _vault2Index;
                this.vault3Index = _vault3Index;
                this.vault4Index = _vault4Index;

                if (this.currentVault == 1 && this.currentIndex == -1) {
                    this.currentIndex = this.vault1Index
                } else if (this.currentVault == 2 && this.currentIndex == -1) {
                    this.currentIndex = this.vault2Index
                } else if (this.currentVault == 3 && this.currentIndex == -1) {
                    this.currentIndex = this.vault3Index
                } else if (this.currentVault == 4 && this.currentIndex == -1) {
                    this.currentIndex = this.vault4Index
                }
            })

            this.vaultContract.methods.getUserCompund(this.currentAddr).call().then(res => {
                console.log("userCompound: " + res);
                this.userCompound = res;
            })
        }

        if (this.dyntxContract != undefined && this.currentAddr != null) {

            this.dyntxContract.methods.allowance(this.currentAddr, this.VAULT_ADDRESS).call().then(allow => {
                if (allow == 0) {
                    this.isApprovalRequired = true;
                } else {
                    this.isApprovalRequired = false;
                }
            })

            //var allow = await this.dyntxContract.methods.allowance(this.currentAddr, this.VAULT_ADDRESS).call();
        }
    },

    /**GET CURRENT WALLET**/
    async getCurrentWallet() {
        if (this.isWalletConnectProtocol) {
            this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];
        } else if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if (accounts.length > 0) {
                this.currentAddr = accounts[0]
                this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];
            }
        }
    },


    /**METAMASMASK */
    async connectMetamask() {
        if (window.ethereum) {
            await this.Connect();
        } else {
            alert("Please install Metamask first");
        }
    },

    /**TRUST WALLET */
    async connectTrust() {
        if (window.ethereum) {
            await this.Connect();
        } else {
            alert("Please install TrustWallet and open the website on Dapps of Trustwallet");
        }
    },

    async connectWalletConnect() {
        var walletConnectProvider = new WalletConnectProvider({
            rpc: {
                56: 'https://bsc-dataseed.binance.org/'
            },
            chainId: 56,
            network: 'binance',
        });
        await walletConnectProvider.enable();

        this.web3 = new Web3(walletConnectProvider);
        const accounts = await this.web3.eth.getAccounts();
        this.currentAddr = accounts[0];
        this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];

        this.isWalletConnectProtocol = true;

        walletConnectProvider.on("chainChanged", (chainId) => {
            window.location.reload();
        });
        walletConnectProvider.on("disconnect", (code, reason) => {
            console.log(code, reason);
            window.location.reload();
        });

        await this.runAPP()
    },

    approveToken() {
        if (window.ethereum && this.dyntxContract != undefined && this.currentAddr != null) {
            this.dyntxContract.methods.approve(this.VAULT_ADDRESS, "100000000000000000000000000000000").send({
                value: 0,
                from: this.currentAddr,
            })
        } else {
            alert("Connect wallet first!");
        }
    },

    deposit(_amount, _id) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            var tokens = this.web3.utils.toWei(_amount, 'ether');
            this.vaultContract.methods.deposit(tokens, _id).send({
                value: 0,
                from: this.currentAddr,
            })
        } else {
            alert("Connect wallet first!");
        }
    },

    async getDepositInfo(_term_id) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            var depositData = await this.vaultContract.methods.getDepositInfo(_term_id, this.currentAddr).send({
                value: 0,
                from: this.currentAddr,
            });
            console.log(depositData);
        } else {
            alert("Connect wallet first!");
        }
    },

    changeUserCompound() {
        this.userCompound = !this.userCompound;
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            this.vaultContract.methods.setCompound(this.userCompound).send({
                value: 0,
                from: this.currentAddr,
            })
        }
    },

    harvest(lockid, index) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            this.vaultContract.methods.harvest(lockid, index).send({
                value: 0,
                from: this.currentAddr,
            })
        } else {
            alert("Connect wallet first!");
        }
    },

    withdraw(lockid, index) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            this.vaultContract.methods.withdraw(lockid, index).send({
                value: 0,
                from: this.currentAddr,
            })
        } else {
            alert("Connect wallet first!");
        }
    },

    async getUserInfo(address, index, lockid) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            var res = await this.vaultContract.methods.getUserInfo(address, index, lockid).call();
            this.currentStake = res.stake;

            var r = await this.web3.eth.getBlock(res.stakedAt);
            this.currentWithdrawAt = r.timestamp + res.duration * 3;
            console.log("timestamp: " + this.currentWithdrawAt);


            this.currentCanWithdraw = res.canWithdraw;
            console.log("canWithdraw: " + res.canWithdraw);


        }
    },

    async rewardOf(_address, _lockId, _index) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            var res = await this.vaultContract.methods.rewardOf(_address, _lockId, _index).call();
            this.currentPendingReward = res;
            console.log("Get reward")
        }
    },

    /**GET PROJECT STATE IN app-header COMPONENT */
    async getAppState() {
        // if(this.isConnectedWallet) {
        // this.factoryContract = await new this.web3_read.eth.Contract(this.FACTORY_ABI_PANCAKE, this.FACTORY_ADDRESS_PANCAKE);
        // const res = await this.factoryContract.methods.getPair(this.BNB_TOKEN_ADDRESS, this.DYNXT_TOKEN_ADDRESS).call();
        // this.pair_address = res;
        const res = await this.getAmountsOut("0.0001", 5, 1, 0)
        if(res.res.length>1)
            return this.web3_read.utils.fromWei(res.res[1])*10000;
        return 0
        // }
        // if(!this.pair_address) return
        // if(this.bnbContract){
        //     const res = await this.bnbContract.methods.balanceOf(this.pair_address).call()
        //     this.lp_bnb_balance = (res/this.tokenLists[1-1].decimals).toFixed(2);
        // }
        // // })
        // if(this.cryptoContract){
        //     const res1 = await this.cryptoContract.methods.balanceOf(this.pair_address).call()
        //     this.lp_crypto_balance = (res1/this.tokenLists[5-1].decimals).toFixed(2);
        //     // })
        // }
    },

    /**GET BALANCE */
    async getBalance(token) {
        let res;
        switch (token) {
            case 1:
                res = await this.bnbContract.methods.balanceOf(this.currentAddr).call()/this.tokenLists[token-1].decimals
                break;
            case 5:
                if(this.isTest)
                    res = await this.cryptoContract.methods.balanceOf(this.currentAddr).call()/this.tokenLists[token-1].decimals
                else
                    res = await this.cryptoContract.methods.balanceOf(this.currentAddr).call()/this.tokenLists[token-1].decimals
                break;
        
            default:
                break;
        }
        return res
    },

    /**EXCHANGE */
    async exchange(amount_0, amount_1, amountOutMin_0, amountInMax_0, fromToken, toToken, inputFocusIsFrom) {
        console.log(this.currentAddr);
        const from = amount_0.toString()
        const to = amount_1.toString()
        const amountOutMin = amountOutMin_0.toString()
        const amountInMax = amountInMax_0.toString()
        let res;
        if(inputFocusIsFrom) {
            if(fromToken == 1){
                try {
                    res = await this.dyContract.methods.swapExactETHForTokens(this.web3_read.utils.toWei(amountOutMin.toString(), 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                        from: this.currentAddr,
                        value: this.web3_read.utils.toWei(from, 'ether')
                    })
                }
                catch(e) {
                    res = false
                    this.message = e
                }
            }
            else if(fromToken == 5) {
                try {
                    res = await this.dyContract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(this.web3_read.utils.toWei(from, 'ether'), this.web3_read.utils.toWei(amountOutMin, 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                        from: this.currentAddr,
                        value: 0
                    })
                }
                catch(e) {
                    res = false
                    this.message = e
                }
            }
        }
        else {
            if(fromToken == 1){
                try {
                    res = await this.dyContract.methods.swapETHForExactTokens(this.web3_read.utils.toWei(to, 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                        from: this.currentAddr,
                        value: this.web3_read.utils.toWei(amountInMax, 'ether')
                    })
                }
                catch(e) {
                    res = false
                    this.message = e
                }
            }
            else if(fromToken == 5) {
                // const encoded = this.dyContract.methods.swapTokensForExactETH(this.web3_read.utils.toWei(to, 'ether'), this.web3_read.utils.toWei(amountInMax, 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).encodeABI()
                // this.web3.eth.estimateGas({
                //     to: this.currentAddr,
                //     data: encoded
                // })
                // .then(async amount => {
                //     const gasPrice = await this.web3.eth.getGasPrice()
                //     console.log("gas: ", amount*this.web3.utils.fromWei(gasPrice, 'ether'))
                // })
                // .catch(console.log)
                // res = await this.dyContract.methods.swapTokensForExactETH(this.web3_read.utils.toWei(to, 'ether'), this.web3_read.utils.toWei(amountInMax, 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                //     from: this.currentAddr,
                //     // gas: 250000,
                //     value: 0
                // })
                res = false
                this.message = {code: 4001, message: "Pancake: K error"}
            }
        }
        return res
    },

    /**GETAMOUNTSIN */
    async getAmountsIn(amountOut, fromToken, toToken, seq) {
        try {
            const res = await this.dyContractForRead.methods.getAmountsIn(this.web3_read.utils.toWei(amountOut, 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]).call()
            return {res, seq}
        } catch (error) {
            return {res: 0, seq}
        }
    },

    /**GETAMOUNTSOUT */
    async getAmountsOut(amountIn, fromToken, toToken, seq) {
        try {
            const res = await this.dyContractForRead.methods.getAmountsOut(this.web3_read.utils.toWei(amountIn, 'ether'), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]).call()
            return {res, seq}
        } catch (error) {
            console.log(error);
            return {res: 0, seq}
        }
    },

    async addToken(tokenAddress, tokenSymbol, tokenDecimals) {
        const wasAdded = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports BEP20, but eventually more!
              options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                // image: tokenImage, // A string url of the token logo
              },
            },
        })
        return wasAdded;
    },

    async approveTokenForExchange(amount, currentAddr) {
        if (window.ethereum && this.dyContract != undefined && currentAddr != null) {
            const res = await this.dyntxContract.methods.approve(this.ROUTER_ADDRESS_PANCAKE, this.web3.utils.toWei(amount.toString(), 'ether')).send({
                value: 0,
                from: currentAddr,
            })
        } else {
            alert("Connect wallet first!");
        }
    },

    // -------------------
    // ---- LP Method ----
    // -------------------
    async findLPPairs(tokenA, tokenB) {
        this.dynxtFactoryContract = await new this.web3_read.eth.Contract(this.FACTORY_ABI, this.FACTORY_ADDRESS);
        let res = "0x0000000000000000000000000000000000000000";
        res = await this.dynxtFactoryContract.methods.getPair(
                                this.tokenLists[tokenA - 1].addr, 
                                this.tokenLists[tokenB - 1].addr
                            ).call();
        return res;
    },

    /**GETAMOUNTSIN */
    async getAmountsInWithLP(amountOut, fromToken, toToken, seq) {
        try {
            const res = await this.dyContractForReadWithLP.methods.getAmountsIn(
                                    this.web3_read.utils.toWei(amountOut, 'ether'), 
                                    [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]
                                ).call();
            return {res, seq}
        } catch (error) {
            return {res: 0, seq}
        }
    },

    /**GETAMOUNTSOUT */
    async getAmountsOutWithLP(amountIn, fromToken, toToken, seq) {
        try {
            const res = await this.dyContractForReadWithLP.methods.getAmountsOut(
                                    this.web3_read.utils.toWei(amountIn, 'ether'), 
                                    [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]
                                ).call();
            return {res, seq}
        } catch (error) {
            return {res: 0, seq}
        }
    },

    async getLiquidityAllowance() {
        let ret = -1;
        await this.dyntxContract.methods.allowance(this.currentAddr, this.ROUTER_ADDRESS).call().then(allow => {
            ret = allow;
        })

        return ret;
    },

    async approveRouterForExchange(currentAddr) {
        if (window.ethereum && this.dyntxContract != undefined && currentAddr != null) {
            try {
                await this.dyntxContract.methods.approve(this.ROUTER_ADDRESS, "99999990000000000000000000000000").send({
                    value: 0,
                    from: currentAddr,
                })

                return true;
            }
            catch (e) {
                console.log(e);

                return false;
            }
        } else {
            alert("Connect wallet first!");

            return false;
        }
    },

    async supplyLP(fromAmount, toAmount) {
        this.dyContractWithLP = await new this.web3.eth.Contract(this.ROUTER_ABI, this.ROUTER_ADDRESS);
        if (this.dyContractWithLP != undefined) {
            try {
                const toWeiAmount = this.web3_read.utils.toWei("" + toAmount, 'ether');
                const fromWeiAmount = this.web3_read.utils.toWei("" + fromAmount, 'ether');
                const toWeiMin = this.web3_read.utils.toWei("" + (toWeiAmount / 1000000000000000000 * 0.5), 'ether');
                const fromWeiMin = this.web3_read.utils.toWei("" + (fromWeiAmount * 0.5 / 1000000000000000000), 'ether');

                let nonce = this.web3.eth.getTransactionCount(this.currentAddr);

                // console.log(toWeiAmount)
                // console.log(fromWeiAmount)
                // console.log(toWeiMin)
                // console.log(fromWeiMin)

                const res = await this.dyContractWithLP.methods.addLiquidityETH(  
                    this.DYNXT_TOKEN_ADDRESS, 
                    toWeiAmount, 
                    toWeiMin,
                    fromWeiMin, 
                    this.currentAddr, 
                    this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                        value: fromWeiAmount,
                        from: this.currentAddr,
                        nonce: this.web3_read.utils.toHex(nonce),
                        gasLimit: this.web3_read.utils.toHex(4000000),
                        gasPrice: this.web3_read.utils.toHex(5000000000)
                });
                console.log(res);

                return res.transactionHash;
            }
            catch (e) {
                console.log(e);

                return null;
            }
        }
    },

    async getTotalDynxtTokenInLP(lpAddress) {
        let totalDynxtInLP = -1;
        await this.dyntxContract.methods.balanceOf(lpAddress).call().then(balance =>{
            totalDynxtInLP = balance;
        });

        return totalDynxtInLP;
    },

    async getTotalLPSupplyTokens(lpAddress) {
        this.lpContract = await new this.web3_read.eth.Contract(this.DYNTX_ABI, lpAddress);
        const ts = await this.lpContract.methods.totalSupply().call()
        return ts
    },

    async findAllLPPairs() {
        let res = [];
        this.dynxtFactoryContract = await new this.web3_read.eth.Contract(this.FACTORY_ABI, this.FACTORY_ADDRESS);
        let lpCount = await this.dynxtFactoryContract.methods.allPairsLength().call();

        if (lpCount > 0) {
            for (let i = 0; i < lpCount; i++) {
                res.push(await this.dynxtFactoryContract.methods.allPairs(i).call());
            }
        }

        return res;
    },

    async signDataForRemoveLP(lpAddress, lpToken) {
        const deadline = this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 5*60)
        let returnVal = null;
        
        let nonce = this.web3.eth.getTransactionCount(this.currentAddr);

        const EIP712Domain = [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ]
        const domain = {
            name: 'DYNXT LPs',
            version: '1',
            chainId: 56,
            verifyingContract: lpAddress,
        }
        const Permit = [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ]
        const message = {
            owner: this.currentAddr,
            spender: this.ROUTER_ADDRESS,
            value: this.web3.utils.toWei(lpToken).toString(),
            nonce: this.web3_read.utils.toHex(nonce),
            deadline: deadline
        }
        const data = JSON.stringify({
            types: {
                EIP712Domain,
                Permit,
            },
            domain,
            primaryType: 'Permit',
            message,
        })
        
        var from = this.currentAddr;
    
        var params = [from, data];
        var method = 'eth_signTypedData_v4';

        const callback = (err, result) => {
            if (err) {
                return console.dir(err);
            }
            if (result.error) {
                console.log(result.error.message);
            }
            if (result.error) {
                return console.error('ERROR', result);
            }

            returnVal = this.getSignatureParameters(result.result);

            const recovered = sigUtil.recoverTypedSignature_v4({
                data: JSON.parse(data),
                sig: result.result,
            });
        }
    
        await this.web3.currentProvider.send({
            method,
            params,
            from,
        }, callback);

        returnVal.deadline = deadline
        returnVal.nonce = nonce

        return returnVal;
    },

    getSignatureParameters(signature) {
        if (!this.web3.utils.isHexStrict(signature)) {
          throw new Error(
            'Given value "'.concat(signature, '" is not a valid hexstring.')
          );
        }

        var r = signature.slice(0, 66);
        var s = "0x".concat(signature.slice(66, 130));
        var v = "0x".concat(signature.slice(130, 132));
        v = this.web3.utils.hexToNumber(v);
        if (![27, 28].includes(v)) v += 27;
        return {
            r: r,
            s: s,
            v: v
        };
    },

    async removeLP(poolTokenAddr, lpToken, fromAmount, toAmount, rsvVal) {
        this.dyContractWithLP = await new this.web3.eth.Contract(this.ROUTER_ABI, this.ROUTER_ADDRESS);
        if (this.dyContractWithLP != undefined) {
            try {
                const lpTokenWei = this.web3_read.utils.toWei("" + this.sliceStringWithPlaceCount(parseFloat(lpToken), 16), 'ether');
                const toWeiMin = this.web3_read.utils.toWei("" + this.sliceStringWithPlaceCount((parseFloat(toAmount) * 0.88), 16), 'ether');
                const fromWeiMin = this.web3_read.utils.toWei("" + this.sliceStringWithPlaceCount((parseFloat(fromAmount) * 0.88), 16), 'ether');

                // console.log(poolTokenAddr);
                // console.log(lpTokenWei);
                // console.log(toWeiMin);
                // console.log(fromWeiMin);
                // console.log(this.currentAddr);
                // console.log(rsvVal.v);
                // console.log(rsvVal.r);
                // console.log(rsvVal.s);
                const res = await this.dyContractWithLP.methods.removeLiquidityETHWithPermit(  
                    this.DYNXT_TOKEN_ADDRESS, 
                    lpTokenWei,
                    toWeiMin,
                    fromWeiMin, 
                    this.currentAddr, 
                    rsvVal.deadline,
                    false,
                    rsvVal.v,
                    rsvVal.r,
                    rsvVal.s)
                    .send({
                        from: this.currentAddr,
                        nonce: this.web3_read.utils.toHex(rsvVal.nonce),
                        gasLimit: this.web3_read.utils.toHex(4000000),
                        gasPrice: this.web3_read.utils.toHex(5000000000)
                    });
                console.log(res);

                return res.transactionHash;
            }
            catch (e) {
                console.log(e);

                return null;
            }
        }
    },
}

export default Web3Service;
