import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import DYABI_TEST from "./ABI_TEST.json"
import ROUTER_ABI from "./ROUTER_ABI.json"
// import { getState } from 'core-js/modules/web.url-search-params';


const Web3Service = {
    isTest: false,
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
    userCompound: false,

    tokenLists: [
        {
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
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png'
          },
          {
            id: 3,
            name: 'ETH',
            sub_name: 'eth',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png'
          },
          {
            id: 4,
            name: 'USDT',
            sub_name: 'usd',
            image: 'https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png'
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

    vault1Index: -1,
    vault2Index: -1,
    vault3Index: -1,
    vault4Index: -1,

    // VAULT_ADDRESS: "0x0b03540D9a1304458079E1Dc1eF5B1B13CbdFfB3",
    // VAULT_ABI: [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AddRewardTokens", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "tokenRecovered", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "AdminTokenRecovery", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256" }], "name": "Harvest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdraw", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_minimumDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_percentage", "type": "uint256" }, { "internalType": "uint256", "name": "_duration", "type": "uint256" }, { "internalType": "bool", "name": "_isEnabled", "type": "bool" }], "name": "addOrUpdateLock", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "addRewardTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "emergencyRewardWithdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "getLock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getStakingAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }], "name": "getUserAllInvestments", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bool[]", "name": "", "type": "bool[]" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getUserCompund", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "getUserInfo", "outputs": [{ "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint256", "name": "reward", "type": "uint256" }, { "internalType": "uint256", "name": "claimedAt", "type": "uint256" }, { "internalType": "uint256", "name": "stakedAt", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "canWithdraw", "type": "bool" }, { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_userAddress", "type": "address" }, { "internalType": "uint256", "name": "_upto", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getUserVaults", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "harvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "harvestAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IBEP20", "name": "_stakedToken", "type": "address" }, { "internalType": "contract IBEP20", "name": "_rewardToken", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "isInitialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lockId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "lockInfo", "outputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }, { "internalType": "uint256", "name": "minimumDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "percentage", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "isEnabled", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxVault", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "pendingReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenAddress", "type": "address" }, { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" }], "name": "recoverWrongTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "rewardOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IBEP20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_lockId", "type": "uint256" }], "name": "rewardsOfLockId", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_compound", "type": "bool" }], "name": "setCompound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_maxVault", "type": "uint256" }], "name": "setMaxVault", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "stakedToken", "outputs": [{ "internalType": "contract IBEP20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRewardTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStakingTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_lockId", "type": "uint256" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "withdrawAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],

    VAULT_ADDRESS: "0x758e514d2233b061F9cA0228Cf0Dd3faAB93733b",
    VAULT_ABI: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AddRewardTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"tokenRecovered","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AdminTokenRecovery","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"Harvest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"uint256","name":"_lockId","type":"uint256"},{"internalType":"uint256","name":"_minimumDeposit","type":"uint256"},{"internalType":"uint256","name":"_percentage","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"},{"internalType":"bool","name":"_isEnabled","type":"bool"}],"name":"addOrUpdateLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"addRewardTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_lockId","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"emergencyRewardWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lockId","type":"uint256"}],"name":"getLock","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_lockId","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getStakingAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getUserAllInvestments","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bool[]","name":"","type":"bool[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserCompund","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_lockId","type":"uint256"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"uint256","name":"claimedAt","type":"uint256"},{"internalType":"uint256","name":"stakedAt","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bool","name":"canWithdraw","type":"bool"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"uint256","name":"_upto","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getUserVaults","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lockId","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"harvestAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IBEP20","name":"_stakedToken","type":"address"},{"internalType":"contract IBEP20","name":"_rewardToken","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isInitialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lockInfo","outputs":[{"internalType":"uint256","name":"lockId","type":"uint256"},{"internalType":"uint256","name":"minimumDeposit","type":"uint256"},{"internalType":"uint256","name":"percentage","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bool","name":"isEnabled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxVault","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"pendingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_tokenAmount","type":"uint256"}],"name":"recoverWrongTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_lockId","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"rewardOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardToken","outputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"uint256","name":"_lockId","type":"uint256"}],"name":"rewardsOfLockId","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_compound","type":"bool"}],"name":"setCompound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxVault","type":"uint256"}],"name":"setMaxVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakedToken","outputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewardTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalStakingTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lockId","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lockId","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],

    // TOKEN_ABI: [{ "inputs": [], "stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokensSellToAddToLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operationWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reservedWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operationWallet","type":"address"}],"name":"setOperationgWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reservedWallet","type":"address"}],"name":"setReservedWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFiveThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFourThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierOneThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierThreeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierTwoThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFiveThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFourThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierOneThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierThreeThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierTwoThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
    // PRESALE_ADDRESS: "0x66711B14A6F869265b13cb06eAbd452B0ff89792",
    // PRESALE_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"CrowdSaleEnd","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"CrowdSaleStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"inputs":[],"name":"MAX_CONTRIBUTED_PER_WALLET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_CONTRIBUTED_BNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_TOKEN_SOLD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"crowndSaleBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dynastyXToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_started","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startCrowdsale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopCrowdsale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalBNBPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"updateLimitPerWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
    // presaleType: "Public Pre-sale",
    
    
    /**FOR TEST NET */
    
    // DYNXT_TOKEN_ABI: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "minTokensBeforeSwap", "type": "uint256" }], "name": "MinTokensBeforeSwapUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokensSwapped", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "ethReceived", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "tokensIntoLiqudity", "type": "uint256" }], "name": "SwapAndLiquify", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "bool", "name": "enabled", "type": "bool" }], "name": "SwapAndLiquifyEnabledUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "onOwnershipTransferred", "type": "event" }, { "inputs": [], "name": "_maxTxAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "_totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "excludeFromFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "includeInFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isExcludedFromFee", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numTokensSellToAddToLiquidity", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "operationWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reservedWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "maxTxAmount", "type": "uint256" }], "name": "setMaxTxAmount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_operationWallet", "type": "address" }], "name": "setOperationgWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_reservedWallet", "type": "address" }], "name": "setReservedWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_enabled", "type": "bool" }], "name": "setSwapAndLiquifyEnabled", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierFiveThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierFourThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierOneThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierThreeThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newThresholdPercent", "type": "uint256" }], "name": "setTierTwoThreshold", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "swapAndLiquifyEnabled", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierFiveThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierFourThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierOneThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierThreeThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tierTwoThreshold", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uniswapV2Pair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uniswapV2Router", "outputs": [{ "internalType": "contract IUniswapV2Router02", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }],
    TEST_ROUTER_ADDRESS: "0x3E3DE45447Cc22664a58d2F33Cd664650448E85a",
    TEST_ROUTER_ABI: DYABI_TEST,
    TEST_FACTORY_ADDRESS: "0x8F9ce3b55e564586a9AaE9a37850bbf70f560F2c",
    TEST_FACTORY_ABI: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    TEST_BNB_ADD: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    TEST_CRYPTO_ADD: "0x20fc2979e9c229a19710692299677f21d623887d",
    
    
    /**FOR MAIN NET */

    // DYNXT_TOKEN_ADDRESS: "0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396",
    // DYNXT_TOKEN_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokensSellToAddToLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operationWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reservedWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operationWallet","type":"address"}],"name":"setOperationgWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reservedWallet","type":"address"}],"name":"setReservedWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFiveThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFourThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierOneThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierThreeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierTwoThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFiveThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFourThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierOneThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierThreeThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierTwoThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
    
    ROUTER_ADDRESS: "0x31bc4C4fC335895082ae9f7a78f3bF58f5CBB2ec",
    ROUTER_ABI: ROUTER_ABI,
    FACTORY_ADDRESS: "0xff43aDdccf2Cc1b280836ffa285DF58992C615C3",
    FACTORY_ABI: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    DYNXT_TOKEN_ADDRESS: "0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396",
    DYNXT_TOKEN_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokensSellToAddToLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operationWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reservedWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operationWallet","type":"address"}],"name":"setOperationgWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reservedWallet","type":"address"}],"name":"setReservedWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFiveThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFourThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierOneThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierThreeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierTwoThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFiveThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFourThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierOneThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierThreeThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierTwoThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
    BNB_TOKEN_ADDRESS: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    BNB_TOKEN_ABI: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}],

    eventTransactions: undefined,
    isWalletConnectProtocol: false,

    /*Current Working Vault*/
    currentVault: 0,
    currentIndex: -1,
    currentStake: 0,
    currentCanWithdraw: false,
    currentWithdrawAt: 0,
    currentPendingReward: 0,
    lp_bnb_balance: 0,
    lp_crypto_balance: 0,

    /**CONNECT**/
    async Connect() {
        this.isWalletConnectProtocol = false;
        this.currNetworkID = await this.web3.eth.net.getId()
        if(this.isTest) {
            console.log(this.currNetworkID);
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
            } catch (error) {
                console.error(error)
            }
            if(this.currNetworkID != this.TEST_NETWORK) {
                const data = [{
                    // chainId: '0x38', //mainnet
                    chainId: '0x61',
                    chainName: 'Test Binance Smart Chain',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18
                    },
                    // rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                }]
            }
            // else {
                /* eslint-disable */
                const tx = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
                if (tx) {
                    console.log(tx)
                }
            // }
            let accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if(accounts && accounts.length) {
                this.currentAddr = accounts[0]
                this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];
                console.log(this.currentAddr);
            }
            this.runAPP()
            window.ethereum.on('chainChanged', (chainId) => {
                console.log(chainId);
                this.currNetworkID = chainId
                console.log("window.location.reload");
                // window.location.reload();
            });
        }
        else {
            try {
                console.log("connect started");
                await window.ethereum.request({ method: "eth_requestAccounts" })
                
            } catch (error) {
                console.error(error)
            }
            if(this.currNetworkID != this.NETWORK) {
                console.log("connect started");
                
            // }
            // else {
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
                // this.Connect()
                if (tx) {
                    console.log("tx", tx)
                }
                else {
                    this.currNetworkID = this.NETWORK
                }
            }
            // let accounts = await window.ethereum.request({ method: 'eth_accounts' })
            // if(accounts && accounts.length) {
            //     this.currentAddr = accounts[0]
            //     this.shortAddr = this.currentAddr.slice(0, 2) + '...' + this.currentAddr.slice(-4);
            // }
            this.runAPP()
            
            
        }
    },

    /**GET PROJECT STATE IN app-header COMPONENT */
    async getAppState() {
        if(!this.pair_address) return
        if(this.bnbContract){
            console.log("object1", this.pair_address);
            const res = await this.bnbContract.methods.balanceOf(this.pair_address).call()
            console.log("bnbContract Balance: " + res);
            this.lp_bnb_balance = (res/this.tokenLists[1-1].decimals).toFixed(2);
        }
        // })
        if(this.cryptoContract){
            console.log("object1");
            const res1 = await this.cryptoContract.methods.balanceOf(this.pair_address).call()
            // console.log("cryptoContract Balance: " + res/1e9);
            this.lp_crypto_balance = (res1/this.tokenLists[5-1].decimals).toFixed(2);
            // })
        }
    },

    // /**GET EXCHANGE PAGE STATE */
    // async getExchangeState() {
    //     if(this.bnbContract){
    //         console.log("object1", this.pair_address);
    //         const res = await this.bnbContract.methods.balanceOf(this.pair_address).call()
    //         console.log("bnbContract Balance: " + res);
    //         this.lp_bnb_balance = (res/1e18).toFixed(2);
    //     }
    //     // })
    //     if(this.cryptoContract){
    //         console.log("object1");
    //         const res1 = await this.cryptoContract.methods.balanceOf(this.pair_address).call()
    //         // console.log("cryptoContract Balance: " + res/1e9);
    //         this.lp_crypto_balance = (res1/1e9).toFixed(2);
    //         // })
    //     }
    // },

    /**RUN APP**/
    async runAPP() {
        this.web3_for_state = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/')) //'https://bsc-dataseed1.defibit.io/'
        if (window.ethereum) {
            let accounts = await window.ethereum.request({ method: 'eth_accounts' })
            if(accounts.length){
                this.currentAddr = accounts[0]
                this.shortAddr = this.currentAddr.slice(0, 2) + '...' + this.currentAddr.slice(-4);
            }
            else{
                this.currentAddr = ""
                this.shortAddr = ""
            }
            this.web3 = new Web3(window.ethereum)
            // this.web3.eth.net.isListening()
            // .then(() => console.log('is connected'))
            // .catch(e => console.log('Wow. Something went wrong: '+ e));
            this.currNetworkID = await this.web3.eth.net.getId()
            console.log("NetworkId = " + this.currNetworkID);
            if (this.currNetworkID == this.NETWORK) {
                this.vaultContract = await new this.web3.eth.Contract(this.VAULT_ABI, this.VAULT_ADDRESS);
                this.dyntxContract = await new this.web3.eth.Contract(this.DYNXT_TOKEN_ABI, this.DYNXT_TOKEN_ADDRESS);
            }
            // else if(this.currNetworkID == this.TEST_NETWORK){
                // this.web3_for_state = new Web3("https://data-seed-prebsc-1-s1.binance.org")
                
                // this.web3_for_state.eth.getBalance(this.currentAddr).then(res=>console.log("res", res));

                /**FOR TEST NET */
                
                // this.dyContract = await new this.web3_for_state.eth.Contract(this.TEST_ROUTER_ABI, this.TEST_ROUTER_ADDRESS);
                // this.factoryContract = await new this.web3_for_state.eth.Contract(this.TEST_FACTORY_ABI, this.TEST_FACTORY_ADDRESS);
                // const res = await this.factoryContract.methods.getPair(this.TEST_BNB_ADD, this.TEST_CRYPTO_ADD).call();
                // console.log("pair add: " + res);
                // this.pair_address = res;
                // this.bnbContract = await new this.web3_for_state.eth.Contract(this.DYNXT_TOKEN_ABI, this.TEST_BNB_ADD);
                // this.cryptoContract = await new this.web3_for_state.eth.Contract(this.DYNXT_TOKEN_ABI, this.TEST_CRYPTO_ADD);
                

                /**FOR MAIN NET */
                // if(this.currentAddr) {
                //     this.dyContract = await new this.web3.eth.Contract(this.ROUTER_ABI, this.ROUTER_ADDRESS);
                // }
                // else {
                //     this.dyContract = await new this.web3_for_state.eth.Contract(this.ROUTER_ABI, this.ROUTER_ADDRESS);
                    
                //     // this.factoryContract = await new this.web3_for_state.eth.Contract(this.FACTORY_ABI, this.FACTORY_ADDRESS);
                //     // const res = await this.factoryContract.methods.getPair(this.BNB_TOKEN_ADDRESS, this.DYNXT_TOKEN_ADDRESS).call();
                //     // console.log("pair add: " + res);
                //     // this.pair_address = res;
                //     // this.bnbContract = await new this.web3_for_state.eth.Contract(this.DYNXT_TOKEN_ABI, this.BNB_TOKEN_ADDRESS);
                //     // this.cryptoContract = await new this.web3_for_state.eth.Contract(this.DYNXT_TOKEN_ABI, this.DYNXT_TOKEN_ADDRESS);
                // }
                this.factoryContract = await new this.web3_for_state.eth.Contract(this.FACTORY_ABI, this.FACTORY_ADDRESS);
                const res = await this.factoryContract.methods.getPair(this.BNB_TOKEN_ADDRESS, this.DYNXT_TOKEN_ADDRESS).call();
                console.log("pair add: " + res);
                this.pair_address = res;
                this.bnbContract = await new this.web3_for_state.eth.Contract(this.DYNXT_TOKEN_ABI, this.BNB_TOKEN_ADDRESS);
                this.cryptoContract = await new this.web3_for_state.eth.Contract(this.DYNXT_TOKEN_ABI, this.DYNXT_TOKEN_ADDRESS);
        } else {
            // if (window.ethereum) {
            //     const data = [{
            //             chainId: '0x38', //mainnet
            //             //chainId: '0x61',
            //             chainName: 'Binance Smart Chain',
            //             nativeCurrency: {
            //                 name: 'BNB',
            //                 symbol: 'BNB',
            //                 decimals: 18
            //             },
            //             rpcUrls: ['https://bsc-dataseed.binance.org/'],
            //             blockExplorerUrls: ['https://bscscan.com/'],
            //         }]
            //         /* eslint-disable */
            //     const tx = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
            //     if (tx) {
            //         console.log(tx)
            //     }
            // }
        }
    },

    /** UPDATE **/
    async update() {
        console.log("Web3Service Update")
        // await this.getState()
        // this.rate = this.lp_bnb_balance/this.lp_crypto_balance
            //this.getCurrentWallet();
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' })
            console.log(accounts);
            if (accounts.length > 0) {
                this.currentAddr = accounts[0];
                this.shortAddr = this.currentAddr.slice(0, 2) + '...' + this.currentAddr.slice(-4);
                console.log("Address: " + this.shortAddr);
            }
            this.currNetworkID = await this.web3.eth.net.getId()
            
            if(!this.isTest && this.currNetworkID == this.NETWORK){
                if(this.vaultContract == undefined) {
                    this.vaultContract = await new this.web3.eth.Contract(this.VAULT_ABI, this.VAULT_ADDRESS);
                    this.dyntxContract = await new this.web3.eth.Contract(this.DYNXT_TOKEN_ABI, this.DYNXT_TOKEN_ADDRESS);
                }
                if (this.vaultContract != undefined && this.currentAddr != null && this.currentAddr.length) {
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

                if (this.dyntxContract != undefined && this.currentAddr != null && this.currentAddr.length) {
                    this.dyntxContract.methods.allowance(this.currentAddr, this.VAULT_ADDRESS).call().then(allow => {
                        console.log("allowance: " + allow);
                        if (allow == 0) {
                            this.isApprovalRequired = true;
                        } else {
                            this.isApprovalRequired = false;
                        }
                    })
    
                    //var allow = await this.dyntxContract.methods.allowance(this.currentAddr, this.VAULT_ADDRESS).call();
                    //console.log("allowance: " + allow);
                }
            }
        }
    },

    /**GET BALANCE */
    async getBalance(token) {
        let res;
        console.log(await this.bnbContract.methods.balanceOf(this.currentAddr).call());
        switch (token) {
            case 1:
                res = await this.bnbContract.methods.balanceOf(this.currentAddr).call()/this.tokenLists[token-1].decimals
                break;
            case 5:
                if(this.isTest)
                    res = await this.cryptoContract.methods.balanceOf(this.currentAddr).call()/this.tokenLists[token-1].decimals
                else
                    res = await this.cryptoContract.methods.balanceOf(this.currentAddr).call()/this.tokenLists[token-1].decimals
                    // res = await this.tokenContract.methods.balanceOf(this.currentAddr).call()
                break;
        
            default:
                break;
        }
        return res
        // this.
    },

    /**EXCHANGE */
    async exchange(amount, amountOutMin, fromToken, toToken) {
        console.log(new Date().getTime()/1000 + 60*20);
        console.log(this.currentAddr);
        // const amountOutMin = 1;
        let res;
        if(fromToken == 1){
            res = await this.dyContract.methods.swapExactETHForTokens(amountOutMin, [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                from: this.currentAddr,
                value: amount
            })
        }
        else if(fromToken == 5) {
            res = await this.dyContract.methods.swapExactTokensForETH(this.web3.utils.toBN(parseInt(parseFloat(amount)*1e18)), amountOutMin, [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr], this.currentAddr, this.web3.utils.toBN(Math.ceil(new Date().getTime()/1000) + 60*20)).send({
                from: this.currentAddr
            })
        }
        // .then(res => {
        console.log("exchange result: " + res/1e18);
        //     // this.lp_bnb_balance = (res/1e18).toFixed(2);
        // })
        // .catch(err=>{
        //     console.log(err);
        // })
    },

    /**GETAMOUNTSIN */
    async getAmountsIn(amountOut, fromToken, toToken, seq) {
        try {
            const res = await this.dyContract.methods.getAmountsIn(this.web3_for_state.utils.toBN(parseInt(parseFloat(amountOut)*this.tokenLists[toToken-1].decimals)), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]).call()
            console.log("res", res);
            return {res, seq}
        } catch (error) {
            return {res: 0, seq}
        }
    },

    /**GETAMOUNTSOUT */
    async getAmountsOut(amountIn, fromToken, toToken, seq) {
        console.log("here: ", this.tokenLists[fromToken-1].decimals, [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]);
        try {
            const res = await this.dyContract.methods.getAmountsOut(this.web3_for_state.utils.toBN(parseInt(parseFloat(amountIn)*this.tokenLists[fromToken-1].decimals)), [this.tokenLists[fromToken-1].addr, this.tokenLists[toToken-1].addr]).call()
            return {res, seq}
        } catch (error) {
            return {res: 0, seq}
        }
        // console.log("res", res);
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
            await this.Connect()
            return this.currentAddr
        } else {
            alert("Please install Metamask first");
        }
    },

    /**TRUST WALLET */
    connectTrust() {
        if (window.ethereum) {
            if (window.ethereum.isMetaMask == true) {
                alert("Please install TrustWallet and open the website on Dapps of Trustwallet");
            } else {
                this.Connect();
            }
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
        console.log("accounts", accounts)
        this.currentAddr = accounts[0];
        this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];

        this.isWalletConnectProtocol = true;

        walletConnectProvider.on("chainChanged", async (chainId) => {
            this.currNetworkID = await this.web3.eth.net.getId()
            // window.location.reload();
        });
        walletConnectProvider.on("disconnect", async (code, reason) => {
            this.currNetworkID = await this.web3.eth.net.getId()
            console.log(code, reason);
            // window.location.reload();
        });

        this.runAPP()
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
            this.vaultContract.methods.deposit(_id, tokens).send({
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

    getUserInfo(address, index, lockid) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            this.vaultContract.methods.getUserInfo(address, index, lockid).call().then(res => {
                this.currentStake = res.stake;

                this.web3.eth.getBlock(res.stakedAt).then(r => {
                    this.currentWithdrawAt = r.timestamp + res.duration * 3;
                    console.log("timestamp: " + this.currentWithdrawAt);
                })

                this.currentCanWithdraw = res.canWithdraw;
                console.log("canWithdraw: " + res.canWithdraw);

            })
        }
    },

    rewardOf(_address, _lockId, _index) {
        if (window.ethereum && this.vaultContract != undefined && this.currentAddr != null) {
            this.vaultContract.methods.rewardOf(_address, _lockId, _index).call().then(res => {
                this.currentPendingReward = res;
            })
        }
    },

    //from launchpad for temp
    // async getSoldAmount(){
    //     var NETID = 97;
    //     var tempWeb3 = null;
    //     if (NETID == 56) {
    //       tempWeb3 = new Web3('https://bsc-dataseed1.binance.org:443');
    //     } else {
    //       tempWeb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org');
    //     }
    //     var tempPresaleContract = await new tempWeb3.eth.Contract(this.PRESALE_ABI, this.PRESALE_ADDRESS);

    //     this.totalSold = 0;
    //     tempPresaleContract.methods.TOTAL_CONTRIBUTED_BNB().call().then(res => {
    //       this.totalSold = (res / 1e18).toFixed(2);
    //       console.log("Public sold: " + this.totalSold);
    //     })
    //   },
}

export default Web3Service;