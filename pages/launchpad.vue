<template>
  <div style="min-height: 100vh;" class="d-flex dust">
    <v-container class="ma-auto">
      <div class="text-h4 text-center mb-12">Dynasty Xchange</div>
      <v-card color="black" max-width="600px" class="mx-auto rounded-xl cream-bx-2">
        <v-card-text class="pa-3 pa-md-12">
          <div class="text-h4 text-center white--text">Launchpad</div>
          <div class="text-center">
            Be the first to get in. Swap your BNB for DYNXT
          </div>
          <div class="d-flex align-center my-5">
            <div class="vault-icon d-flex justify-center align-center">
              <v-img :src="logo" height="25px" width="25px" contain @click="$router.push({name:'index'})"></v-img>
            </div>
            <div class="mx-5">
              <div class="white--text">DYNXT</div>
              <div class="grey--text">{{presaleType}}</div>
            </div>
          </div>
          <div class="d-flex justify-space-between flex-wrap my-5">
            <div class="text-center">
              <div class="grey--text">{{totalSold}} BNB</div>
              <div class="white--text">Sold</div>
            </div>

            <div class="text-center">
              <div class="grey--text">2000 BNB</div>
              <div class="white--text">Max cap</div>
            </div>
          </div>
          <div class="my-3">
            <div class="text-subtitle-1 mb-1 white--text">Progress</div>
            <v-progress-linear
              v-model="launchProgress"
              color="cream"
              class="rounded-xl"
              height="15"
            ></v-progress-linear>
            <div class="d-flex justify-space-between mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div  class="text-center" v-if="!isConnectedWallet">
            <v-btn @click="connectModal = true;" color="cream" rounded class="px-7">{{connectButton}}</v-btn>
          </div>
          <div class="text-center" v-if="isConnectedWallet">
            <div class="text-h4 text-center white--text mb-5">Buy DYNXT with BNB</div>

            <div class="d-flex justify-space-between flex-wrap my-5">
              <div class="text-center">
                <div class="grey--text">{{shortAddr}}</div>
                <div class="white--text">Your Address</div>
              </div>
              <div class="text-center">
                <div class="grey--text">{{saleRate}}</div>
                <div class="white--text">Rate</div>
              </div>
              <div class="text-center">
                <div class="grey--text">{{yourDYNXTBalance}}M DYNXT</div>
                <div class="white--text">Your Balance</div>
              </div>
            </div>


            <v-row>
              <v-col sm="6" cols="12">
                <v-text-field outlined
                              label="BNB Amount"
                              color="cream"
                              class="rounded-lg"
                              v-model="bnbInput"
                              @input="bnbAmountInput()">
                </v-text-field>
              </v-col>
              <v-col sm="6" cols="12">
                <v-text-field outlined
                              label="DYNXT Amount"
                              color="cream"
                              v-model="dynxtInput"
                              @input="dynxtAmountInput()">
                </v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn color="cream" rounded class="px-7" @click="buyPreSaleToken">Buy DYNXT</v-btn>
            </div>
          </div>
        </v-card-text>

      </v-card>
    </v-container>

    <v-dialog max-width="500" v-model="connectModal" >
      <v-card class="cream-br-2 rounded-xl" >
        <v-card-text class="black pa-7">
          <div class="cream--text text-h6 font-weight-bold"> Connect to A wallet</div>
          <v-list rounded color="transparent">
            
            <v-list-item class="justify-space-between d-flex my-3 dust py-2" @click="connectMetamask">
              <v-list-item-content>
                <v-list-item-title class="cream--text text-h6 font-weight-bold">Metamask</v-list-item-title>
              </v-list-item-content>
              <div>
                <v-img :src="require('~/assets/images/metamask.png')" height="40px" width="40px"
                       contain></v-img>
              </div>
            </v-list-item>
            <v-list-item class="justify-space-between d-flex my-3 dust py-2" @click="connectTrust">
              <v-list-item-content>
                <v-list-item-title class="cream--text text-h6 font-weight-bold">Trust Wallet</v-list-item-title>
              </v-list-item-content>
              <div>
                <v-img :src="require('~/assets/images/trust.png')" height="40px" width="40px"
                       contain></v-img>
              </div>
            </v-list-item>
            <v-list-item class="justify-space-between d-flex my-3 dust py-2" @click="connectWalletConnect">
              <v-list-item-content>
                <v-list-item-title class="cream--text text-h6 font-weight-bold">WalletConnect</v-list-item-title>
              </v-list-item-content>
              <div>
                <v-img :src="require('~/assets/images/wlconnect.svg')" height="40px" width="40px"
                       contain></v-img>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
    import Web3 from 'web3';
    import WalletConnectProvider from "@walletconnect/web3-provider";

    //https://testnet.bscscan.com/address/0x257ed88065ebcfd83e7789a4ae5d3e9ef13749fe  Token
    //https://bscscan.com/address/0x66711b14a6f869265b13cb06eabd452b0ff89792#readContract Preslae

    export default {
        name: "login",
        components: {},
        computed: {
            logo() {
                if (this.$store.getters.getSettings.header && this.$store.getters.getSettings.header.logo) {
                    return this.$imgUrl(this.$store.getters.getSettings.header.logo.url)
                } else {
                    return null
                }
            },
        },
        data() {
            return {
                intervalUpdate: null,
                launchProgress: 0,
                connectModal: false,
                connectButton: "Connect Wallet",

                TOKEN_ADDRESS: "0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396",
                TOKEN_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"onOwnershipTransferred","type":"event"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numTokensSellToAddToLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"operationWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reservedWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxAmount","type":"uint256"}],"name":"setMaxTxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_operationWallet","type":"address"}],"name":"setOperationgWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_reservedWallet","type":"address"}],"name":"setReservedWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFiveThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierFourThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierOneThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierThreeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newThresholdPercent","type":"uint256"}],"name":"setTierTwoThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFiveThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierFourThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierOneThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierThreeThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tierTwoThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],
                PRESALE_ADDRESS: "0x66711B14A6F869265b13cb06eAbd452B0ff89792",
                PRESALE_ABI: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"CrowdSaleEnd","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],"name":"CrowdSaleStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokenPurchase","type":"event"},{"inputs":[],"name":"MAX_CONTRIBUTED_PER_WALLET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_CONTRIBUTED_BNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_TOKEN_SOLD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buyToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"crowndSaleBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dynastyXToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_started","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startCrowdsale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopCrowdsale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalBNBPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"updateLimitPerWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
                presaleType: "Public Pre-sale",
                web3: null,
                currentAddr: '',
                shortAddr: '',
                isConnectedWallet: false,
                isWalletConnectProtocol: false,
                tokenContract: null,
                presaleContract: null,

                saleRate: "1250M DYNXT/BNB",

                totalSold: 0,
                yourDYNXTBalance: 0,

                bnbInput: 0,
                dynxtInput: 0,
            }
        },


        mounted: function(){
          //this.getSoldAmount();
          //this.Connect();
        },


        methods: {

          bnbAmountInput(){
              this.dynxtInput = this.bnbInput / 0.0000000008;
          },

          dynxtAmountInput(){
              this.bnbInput  = this.dynxtInput * 0.0000000008;
          },

          async getSoldAmount(){
            var NETID = 56;
            var tempWeb3 = null;
            if (NETID == 56) {
                tempWeb3 = new Web3('https://bsc-dataseed1.binance.org:443');
            } else {
                tempWeb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
            }
            var tempPresaleContract = await new tempWeb3.eth.Contract(this.PRESALE_ABI, this.PRESALE_ADDRESS);

            this.totalSold = 0;
            tempPresaleContract.methods.TOTAL_CONTRIBUTED_BNB().call().then(res => {
                this.totalSold = (res / 1e18).toFixed(2);
                this.launchProgress = (this.totalSold *100 / 2000).toFixed(0);
                console.log("Public sold: " + this.totalSold);
            })
          },


          /**CONNECT**/
          async Connect() {
            this.isWalletConnectProtocol =  false;
            if (window.ethereum) {
              this.web3 = new Web3(window.ethereum)
              try {
                  await window.ethereum.request({ method: "eth_requestAccounts" })
                  let accounts = await window.ethereum.request({ method: 'eth_accounts' })
                  this.currentAddr = accounts[0]
                  window.ethereum.on('chainChanged', (chainId) => {
                      window.location.reload();
                  });
                  this.runAPP()
                  return
              } catch (error) {
                  console.error(error)
              }
            }
          },

          /**RUN APP**/
          async runAPP() {
            let networkID = await this.web3.eth.net.getId()
            if (networkID == 56) {
                this.presaleContract = await new this.web3.eth.Contract(this.PRESALE_ABI, this.PRESALE_ADDRESS);
                this.tokenContract = await new this.web3.eth.Contract(this.TOKEN_ABI, this.TOKEN_ADDRESS);

                this.isConnectedWallet = true;

                console.log(this.currentAddr);
   
                this.presaleType = 'Public Pre-sale';
                this.saleRate = 1250 + "M DYNXT/BNB"

                this.update();
                this.intervalUpdate = setInterval(this.update, 5000);
            } else {
                this.connectButton = "Wrong network";

                if (window.ethereum) {
                    const data = [{
                            chainId: '0x38',
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
          update() {
            console.log("Update")
            this.getCurrentWallet();
            // Update your Balance
            this.tokenContract.methods.balanceOf(this.currentAddr).call().then(res => {
                console.log("current Balance: " + res/1e18);
                this.yourDYNXTBalance = (res/1e24).toFixed(2);
            })
            //Calculate total Again
            this.presaleContract.methods.TOTAL_CONTRIBUTED_BNB().call().then(res => {
                this.totalSold = (res / 1e18).toFixed(2);
                this.launchProgress = (this.totalSold *100 / 2000).toFixed(0);
                console.log("Public sold: " + this.totalSold);
            })
          },

          /**GET CURRENT WALLET**/
          async getCurrentWallet() {
              if(this.isWalletConnectProtocol){
                  this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];
              }else if (window.ethereum) {
                  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                  if (accounts.length > 0) {
                      this.currentAddr = accounts[0]
                      this.shortAddr = this.currentAddr[0] + this.currentAddr[1] + this.currentAddr[2] + this.currentAddr[3] + this.currentAddr[4] + this.currentAddr[5] + '...' + this.currentAddr[this.currentAddr.length - 6] + this.currentAddr[this.currentAddr.length - 5] + this.currentAddr[this.currentAddr.length - 4] + this.currentAddr[this.currentAddr.length - 3] + this.currentAddr[this.currentAddr.length - 2] + this.currentAddr[this.currentAddr.length - 1];
                  }
              }
          },

          /**METAMASMASK */
          connectMetamask() {
            this.connectModal = false;
            if (window.ethereum) {
                this.Connect();
            } else {
                alert("Please install Metamask first");
            }
          },

          /**TRUST WALLET */
          connectTrust() {
            this.connectModal = false;
            if (window.ethereum) {
                if (window.ethereum.isMetaMask == true) {
                    alert("Please install TrustWallet and open the website on Dapps of Trustwallet");
                } else {
                    this.Connect();
                }
            } else {
                showAlert("Please install TrustWallet and open the website on Dapps of Trustwallet");
            }
          },

          async connectWalletConnect() {
            this.connectModal = false;
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

            this.isWalletConnectProtocol =  true;

            walletConnectProvider.on("chainChanged", (chainId) => {
                window.location.reload();
            });
            walletConnectProvider.on("disconnect", (code, reason) => {
                console.log(code, reason);
                window.location.reload();
            });

            this.runAPP()
          },

          /* BUY PRE-SALE TOKEN */
          buyPreSaleToken(){
            if(this.bnbInput == 0){
                alert("Amount of BNB must be more than zero");
                return;
            }

            this.presaleContract.methods.buyToken().send({ from: this.currentAddr, value: this.bnbInput * 1e18 }, function (res) {
                if (res != null) {
                    console.log("Buy Token Successfully")
                }
            })
          }
        }

    }
</script>

<style scoped>

</style>
