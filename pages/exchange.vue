<template>
  <div class="black pl-md-70 pt-12" >
    <div>
      <div color="black" class="mx-auto rounded-xl cream-bx-2" :loading="loading">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="9">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text">XCHANGE</div>
                <div class="grey--text">
                  <span class="sub-title">Trade tokens in an instant</span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <!-- <v-img :src="require('~/assets/images/settings-white.png')"
                            contain
                            height="30px"
                            width="30px" class="mx-auto mt-5"></v-img>
              <v-icon dark>fas fa-sliders-h</v-icon> -->
              <v-btn text class="mt-7 ml-md-10" @click="showSetting=true"><v-icon dark>fas fa-sliders-h</v-icon></v-btn>
            </v-col>
          </v-row>

        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-3 pa-md-7">

          <v-form class="mt-0" ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field outlined
                              label="From"
                              color="cream darken-2"
                              hide-details
                              class="rounded-lg"
                              placeholder="0.0"
                              type="number"
                              v-model="form.from"
                              autocomplete="false"
                              @change="formFromChange"
                              @input="fromAmountInput">
                  <template v-slot:append style="display: block !important">
                    <div class="">
                      <div>
                        <div class="text-left balance-text" style="padding-bottom: 15px !important; color: lightgray !important;">balance:  <span class="pl-3" style="color: white;">{{vuetifyNumber(fromBalance)}}</span></div>
                      </div>
                      <!-- fromBalance>1e8?(fromBalance*1.0).toLocaleString('fullwide', { useGrouping: false }).slice(0,8)+"...":(fromBalance*1.0).toLocaleString('fullwide', { useGrouping: false, maximumSignificantDigits: 5 }).slice(0,8) -->
                      <v-row>
                        <!-- <v-col v-if="fromToken" cols="1" class="text-left"></v-col> -->
                        <v-col cols="12" class="text-right pl-0 mb-5 mt-8" style="min-width: 90px">
                          <v-btn v-if="form.from!=fromBalance" color="cream" style="width:30px; height: 30px" small class="px-0" text @click="setMax0">MAX</v-btn>
                          <!-- @click="selectFromToken=true" -->
                            <v-btn v-if="fromToken" small text class="px-0">
                              <v-img :src="getTokenItem(fromToken).image"
                                    contain
                                    height="25px"
                                    width="25px" class="my-auto mr-2"></v-img>
                              {{getTokenItem(fromToken).name}}
                            </v-btn>
                            <v-btn v-else text small class="mt-1">
                              Select a currency
                            </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn icon @click="swapPosition">
                  <v-icon color="cream">mdi-arrow-up-down-bold</v-icon>
                </v-btn>

              </v-col>
              <v-col cols="12">
                <!-- :rules="rules.requiredRules" -->
                <v-text-field outlined
                              label="To"
                              type="number"
                              :step="0.001"
                              hide-details
                              placeholder="0.0"
                              color="cream"
                              class="rounded-lg"
                              v-model="form.to"
                              autocomplete="false"
                              @change="formToChange"
                              @input="toAmountInput">
                  <template v-slot:append style="display: block !important">
                    <div class="">
                      <div>
                        <div class="text-left balance-text" style="">balance:  <span class="pl-3" style="color: white;">{{vuetifyNumber(toBalance)}}</span></div>
                      </div>
                      <v-row>
                        <!-- <v-col cols="4" class="text-left px-1"> -->
                          <!-- <v-btn small class="px-0" color="cream" text @click="setMax1">MAX</v-btn> -->
                        <!-- </v-col> -->
                        <!-- <v-col v-if="toToken" cols="1" class="text-left"></v-col> -->
                        <v-col cols="12" class="text-right pl-0 mb-5 mt-8" style="min-width: 90px">
                          <div v-if="toToken">
                            <v-btn small text class="px-0">
                              <v-img :src="getTokenItem(toToken).image"
                                    contain
                                    height="25px"
                                    width="25px" class="my-auto mr-2"></v-img>
                              {{getTokenItem(toToken).name}}
                            </v-btn>
                          </div>
                          <div v-else>
                            <v-btn text small class="mt-1">
                              Select a currency
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="9" class="text-left text-white" style="color: white; font-weight: 600;">
                Slippage Tolerance
              </v-col>
              <v-col cols="3" class="text-right">
                {{getTolerance}}%
              </v-col>
              <v-col cols="12">
                <v-btn class="rounded-lg py-7 px-4" 
                      :disabled="getIsConnected && !swapable" 
                      :color="getIsConnected && form.from > 0 && form.to > 0?'cream': getIsConnected && form.from <= 0?'darkcream':'cream'" 
                      style="width: fit-content; font-weight: 600;" 
                      :style="getIsConnected && !swapable&&'background-color: #a17c49 !important'" 
                      @click="confirmSwapForExchange">
                      {{connectButton}}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
      <div v-show="form.from > 0 && form.to > 0" color="black" class="mx-auto rounded-xl cream-bx-2 pa-12 mt-12" :loading="loading">
        <v-row>
          <v-col cols="5" class="text-left text-white py-1" style="color: gray; font-weight: 600;">
            <small>{{inputFocusIsFrom?"Minimum recieved": "Maximum sold"}}</small>
          </v-col>
          <v-col cols="7" class="text-right py-1" style="color: white; font-weight: 600;">
            {{inputFocusIsFrom?amountOutMin:amountInMax}} {{tokenLists[toToken-1].name}}
          </v-col>
          <v-col cols="6" class="text-left text-white py-1" style="color: gray; font-weight: 600;">
            <small>Price impact</small>
          </v-col>
          <v-col cols="6" class="text-right py-1" style="color: white; font-weight: 600;">
            {{priceImpact > 0.25?priceImpact:"&lt; "+0.25}}%
          </v-col>
          <v-col cols="6" class="text-left text-white py-1" style="color: gray; font-weight: 600;">
            <small>Liquidity Provider Fee</small>
          </v-col>
          <v-col cols="6" class="text-right py-1" style="color: white; font-weight: 600;">
            {{vuetifyNumber(provider_fee * form.from / 100)}} {{tokenLists[fromToken-1].name}}
          </v-col>
        </v-row>
      </div>
    </div>
    
    <v-dialog v-model="selectFromToken" max-width="400" content-class="pl-md-70">
      <token-list :token="fromToken"
                  @change="changeFromToken"
                  :tokenLists="tokenLists"
                  @close="selectFromToken=false"
      ></token-list>
    </v-dialog>
    <v-dialog v-model="selectToToken" max-width="400" content-class="pl-md-70">
      <token-list :token="toToken"
                  @change="changeToToken"
                  :tokenLists="tokenLists"
                  @close="selectToToken=false"
      ></token-list>
    </v-dialog>

    <v-dialog v-model="showSetting" max-width="500" content-class="pl-md-70">
      <setting-list @close="showSetting=false" @change="changeTolerance"></setting-list>
    </v-dialog>

    <v-dialog v-model="confirmSwap" max-width="650" content-class="pl-md-70">
      <v-card class="cream-br-2 rounded-lg">
        <v-card-title class="justify-space-between" style="background-color: gray">
          Confirm Swap
          <v-btn @click="confirmSwap=false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-4">
          <!-- <v-radio-group v-model="radios" :mandatory="false">
            <v-radio label="Radio 1" value="radio-1"><v-chip class="px-7" @click="$emit('changeTolerant')">0.1%</v-chip></v-radio>
            <v-radio label="Radio 2" value="radio-2"><v-chip class="px-7" @click="$emit('changeTolerant')">0.1%</v-chip></v-radio>
          </v-radio-group> -->
          <!-- <v-text-field solo style="border-radius:  50px;background-color: white"></v-text-field> -->
          <v-row class="text-center mt-2 mb-2 px-5">
            <v-col cols="1" class="px-0">
              <v-img :src="getTokenItem(fromToken).image"
                      contain
                      height="25px"
                      width="25px" class="my-auto mr-2"></v-img>
            </v-col>
            <v-col cols="6" class="px-0" style="text-align: left">
              <h2>{{vuetifyNumber(form.from)}}</h2>
            </v-col>
            <v-col cols="5" class="px-0" style="text-align: right">
              <h2>{{getTokenItem(fromToken).name}}</h2>
            </v-col>
          </v-row>
          <v-icon class="ml-2">mdi-arrow-down</v-icon>
          <v-row class="text-center mt-2 px-5">
            <v-col cols="1" class="px-0">
              <v-img :src="getTokenItem(toToken).image"
                      contain
                      height="25px"
                      width="25px" class="my-auto mr-2"></v-img>
            </v-col>
            <v-col cols="6" class="px-0" style="text-align: left">
              <h2>{{vuetifyNumber(form.to)}}</h2>
            </v-col>
            <v-col cols="5" class="px-0" style="text-align: right">
              <h2>{{getTokenItem(toToken).name}}</h2>
            </v-col>
          </v-row>
          <v-card-text class="px-0 mt-7">You will {{inputFocusIsFrom?"receive":"sell"}} at {{inputFocusIsFrom?"least":"most"}} <b>{{inputFocusIsFrom?amountOutMin:amountInMax}} {{inputFocusIsFrom?getTokenItem(toToken).name:getTokenItem(fromToken).name}}</b> or the transaction will revert.</v-card-text>
          <v-alert
            color="dark-grey"
            dark
            dense
            prominent
            class="mx-auto rounded-xl pa-7 mt-5"
          >
            <v-row class="px-0">
              <v-col cols="5" class="text-left text-white py-1" style="font-weight: 600;">
                Price
              </v-col>
              <v-col cols="7" class="text-right py-1" style="font-weight: 600;">
                {{web3Service.toPlainString(getRate).slice(0,15)}} {{getTokenItem(fromToken).name}} / {{getTokenItem(toToken).name}}
              </v-col>
              <v-col cols="5" class="text-left text-white py-1" style="font-weight: 600;">
                {{inputFocusIsFrom?"Minimum recieved":"Maximum sold"}}
              </v-col>
              <v-col cols="7" class="text-right py-1" style="font-weight: 600;">
                {{inputFocusIsFrom?amountOutMin:amountInMax}} {{inputFocusIsFrom?getTokenItem(toToken).name:getTokenItem(fromToken).name}}
              </v-col>
              <v-col cols="6" class="text-left text-white py-1" style="font-weight: 600;">
                Price impact
              </v-col>
              <v-col cols="6" class="text-right py-1" style="font-weight: 600;">
                {{priceImpact > 0.25?priceImpact:"&lt; "+0.25}}%
              </v-col>
              <v-col cols="6" class="text-left text-white py-1" style="font-weight: 600;">
                Liquidity Provider Fee
              </v-col>
              <v-col cols="6" class="text-right py-1" style="color: white; font-weight: 600;">
                {{vuetifyNumber(provider_fee * form.from / 100)}} {{tokenLists[fromToken-1].name}}
              </v-col>
            </v-row>
          </v-alert>
          <v-btn :disabled="confirmingSwap" :style="confirmingSwap&&'background-color: #a17c49 !important'" class="rounded-lg py-7 px-4" color="cream" @click="exchange">
            <client-only>
            <atom-spinner
              v-if="confirmingSwap"
              :animation-duration="1500"
              :size="40"
              color="white"
            />
            <span v-else>Confirm Swap</span>
            </client-only>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="swapSuccess" max-width="500" content-class="pl-md-70">
      <swap-success :fromToken="fromToken" :toToken="toToken" :getTokenItem="getTokenItem" :successTx="successTx" @close="swapSuccess=false" @addToken="addToken"></swap-success>
    </v-dialog>

    <v-dialog v-model="swapFail" max-width="500" content-class="pl-md-70">
      <swap-fail :fromToken="fromToken" :toToken="toToken" :errorMessage="errorMessage" :code="code" :getTokenItem="getTokenItem" @close="swapFail=false"></swap-fail>
    </v-dialog>
  </div>
</template>

<script>
    import Web3 from 'web3'
    import WalletConnectProvider from "@walletconnect/web3-provider"
    import {AtomSpinner} from 'epic-spinners'
    import {mapGetters, mapMutations} from 'vuex'
    import '@fortawesome/fontawesome-free/css/all.css'

    import TokenList from "../components/modals/token-list"
    import SettingList from "../components/modals/setting-list"
    import web3Service from "../web3";
    import SwapSuccess from '../components/modals/swap-success'
    import SwapFail from '../components/modals/swap-fail'
    // import setting from "../../assets/images/setting.png"
    // import Moralis from 'moralis';

    export default {
        name: "exchange",
        components: {TokenList, SettingList, SwapSuccess, SwapFail, AtomSpinner},
        props: {
          info: {
            type: Object,
            default: () => {}
          }
        },
        data() {
          return {
            isSwaped: false,
            selectToToken: false,
            selectFromToken: false,
            confirmingSwap: false,
            
            intervalUpdate: null,
            connectModal: false,
            web3: null,
            web3Service: web3Service,
            shortAddr: '',
            // getIsConnected: false,
            isWalletConnectProtocol: false,
            tokenContract: null,
            bnbContract: null,
            cryptoContract: null,
            presaleContract: null,

            saleRate: "1250M DYNXT/BNB",

            totalSold: 0,

            fromBalance: 0,
            toBalance: 0,

            form: {
              from: 0.0,
              to: 0.0
            },
            loading: false,
            snackbar: false,
            text: '',
            rules: {
              requiredRules: [v => !!v || 'This field is required'],
              emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
              ],
            },
            toToken: 5,
            fromToken: 1,
            showSetting: false,
            tokenLists: web3Service.tokenLists,
            inputCounts: 0,
            provider_fee: 0.25,
            confirmSwap: false,
            swapSuccess: false,
            swapFail: false,
            inputFocusIsFrom: true,
            allowance: 0,
            errorMessage: "",
            successTx: "",
            code: 0
          }
        },

        mounted: async function() {

          // Moralis.initialize("YOUR_APP_ID", "", "YOUR_MASTERKEY");
          // get a web3 instance for a specific chain

          // const web3 = Moralis.web3ByChain("0x1"); // mainnet

          // const web3 = new Moralis.Web3('https://data-seed-prebsc-1-s1.binance.org/');
          // const FACTORY_ABI = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
          // const FACTORY_ADDRESS = "0x8F9ce3b55e564586a9AaE9a37850bbf70f560F2c"

          // // create contract instance
          // const contract = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);

          // // get contract name
          // const res = await contract.methods
          //   .getPair("0xae13d989dac2f0debff460ac112a837c89baa7cd", "0x20fc2979e9c229a19710692299677f21d623887d")
          //   .call()
          //   .catch((e) => console.log(e));

          // this.update()
          // this.interval = setInterval(() => {
          //   this.update()
          // }, 10000);
        },

        computed: {
          ...mapGetters(["getIsConnected", "getCurrentAddr", "getTolerance", "getRate"]),
          validate() {
            if (this.inputFocusIsFrom) {
              return web3Service.toPlainString(this.form.from - Math.floor(this.form.from)).length < 20
            }
            else {
              return web3Service.toPlainString(this.form.to - Math.floor(this.form.to)).length < 20
            }
          },
          connectButton() {
            if(this.getIsConnected) {
              if((this.form.from > 0 || this.form.to > 0) && this.validate) {
                if(this.form.from === 0 || this.form.to === 0) {
                  return "Insufficient liquidity for this trade."
                }
                else if(parseFloat(this.form.from) > this.fromBalance) {
                  return "Insufficient "+web3Service.tokenLists[this.fromToken-1].name+" balance"
                }
                else {
                  return "Swap"
                }
              }
              else{
                return "Enter an amount"
                // this.form.from = "0.0"
              }
            }
            else{
              return "Unlock Wallet"
            }
          },
          swapable() {
            return this.getIsConnected && this.form.from > 0 && this.form.from <= this.fromBalance && this.form.to > 0 && this.validate
          },
          amountOutMin() {
            return this.vuetifyNumber(this.form.to * (1 - this.getTolerance/100))
          },
          amountInMax() {
            return this.vuetifyNumber(this.form.from * (1 + this.getTolerance/100))
          },
          priceImpact() {
            let changedRate = 0
            if(this.form.from > 0 && this.form.to > 0) {
              if(parseFloat(this.form.from) > parseFloat(this.form.to))
                changedRate = this.form.to/this.form.from
              else
                changedRate = this.form.from/this.form.to
              return (Math.abs(changedRate - this.getRate)/this.getRate*100).toFixed(2)
            }
            return 0
          }
        },

        methods: {
          ...mapMutations(["SET_CONNECT_MODAL", "SET_TOLERANCE"]),

          vuetifyNumber(val) {
            const newval = this.web3Service.toPlainString(val)
            if(newval<1) {
              const res = newval.slice(0, Math.ceil(Math.abs(Math.log10(parseFloat(val))))+6)
              return res.length>1 && res.slice(-1) === "0" ? res.slice(0, res.length-1):res
            }
            else{
              return newval.split(".").map((val, index)=>{
                if(index>0) {
                  return val.slice(0, 4)
                }
                return val
              }).join(".")
            }
          },
          setMax0() {
              this.form.to = 0
              this.form.from = this.fromBalance.toString();
              this.inputFocusIsFrom = true
              this.fromAmountInput()
          },
          // setMax1() {
          //     this.form.to = this.toBalance;
          //     this.toAmountInput()
          // },

          formFromChange() {
            
          },
          formToChange() {
            
          },
            // const desiredCoin = '0x0231f91e02DebD20345Ae8AB7D71A41f8E140cE7';
            // const bnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
            // const pairAddress = [bnb, desiredCoin];
            // //use https://bscscan.com/unitconverter to input bnb amount.
            // const amountIn = 0.1
            // const amounts = await this.dyContract.methods.getAmountsOut(
            //     amountIn,
            //     pairAddress
            // );
            // const slippage = 0.5
            // const amountOutMin = amounts[1].sub(amounts[1].div(slippage)); //slipapge set here 
            // const to = bnbwalletAdress;
            // const deadline = Math.floor(Date.now() / 1000) + 60 * 10; //this represents 10 mins of deadline, change to ur liking.
            // const tx = await this.dyContract.methods.swapExactETHForTokens(
            //     amountOutMin,
            //     pairAddress,
            //     to,
            //     deadline,
            //     {value: 1, gasPrice: 10e9}
            // )
            // const receipt = await tx.wait();
            // this.dyContract.methods.swapExactETHForTokens(0, ).call().then(res => {
            //   this.toBalance = (res/1e24).toFixed(2);
            // })
          // },
          changeTolerance(tol){
            this.SET_TOLERANCE(tol)
          },
          
          fromAmountInput(){
            this.inputCounts++
            if(this.form.from <= 0 || this.form.from == "") {
              this.form.from = 0
              this.form.to = 0
            }
            else if(this.validate) {
              // const params = {
              //         chain: "bsc",
              //         contract_address: web3Service.DYNXT_TOKEN_ADDRESS,
              //         function_name: "approve",
              //         abi: web3Service.DYNTX_ABI,
              //         body: {
              //           _spender: web3Service.ROUTER_ADDRESS,
              //           _value: this.form.from
              //         }
              //       }
              // this.$axios
              //   .setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
              // this.$axios
              //       .$post('https://deep-index.moralis.io/api/v2/contract/function', {
              //         params: params
              //       })
              //       .then(res => {
              //       })

              web3Service.getAmountsOut(this.form.from, this.fromToken, this.toToken, this.inputCounts)
              .then(res=>{
                if(res.seq == this.inputCounts) {
                  if(res.res && !(res.res[0].length<2 && res.res[1].length<2)) {
                    if(res.res.length)
                      this.form.to = web3Service.toPlainString(res.res[1]/this.tokenLists[this.toToken-1].decimals) //(fromBalance*1).toLocaleString('fullwide', { useGrouping: false })
                    else
                      this.form.to = 0
                  }
                  else {
                    this.form.to = 0
                  }
                }
              })
              this.inputFocusIsFrom = true
            }
          },
          toAmountInput(){
            this.inputCounts++
            if(this.form.to < 0 || this.form.to == "") {
              this.form.from = 0
              this.form.to = 0
            }
            else if(this.validate) {
              web3Service.getAmountsIn(this.form.to, this.fromToken, this.toToken, this.inputCounts)
              .then(res=>{
                if(res.seq == this.inputCounts) {
                  if(res.res && !(res.res[0].length<2 && res.res[1].length<2)) {
                    if(res.res.length)
                      this.form.from = web3Service.toPlainString(res.res[0]/this.tokenLists[this.fromToken-1].decimals)
                    else
                      this.form.from = 0
                  }
                  else {
                    this.form.from = 0
                  }
                }
              })
              this.inputFocusIsFrom = false
            }
          },

          async confirmSwapForExchange() {
            if (!this.getIsConnected) {
              this.SET_CONNECT_MODAL()
            }
            else {
              if(this.form.from == 0){
                alert("Amount of BNB must be more than zero");
                return;
              }
              this.confirmSwap = true
            }
          },
          
          async exchange() {
            if (!this.getIsConnected) {
              this.SET_CONNECT_MODAL()
            } 
            else {
              if(this.form.from == 0){
                alert("Amount of BNB must be more than zero");
                return;
              }

              this.confirmingSwap = true
              await this.updateAllowance()

              let allowanced = true;
              if(this.fromToken == 5) {
                if(this.allowance < parseFloat(this.form.from)) {
                  try{
                    allowanced = await web3Service.approveTokenForExchange(Math.max(this.form.from, this.amountInMax), this.getCurrentAddr)
                  }
                  catch(e) {
                    console.log(e);
                    allowanced = false
                    this.confirmingSwap = false
                    this.confirmSwap = false
                    this.swapFail = true
                    this.code = 4001
                  }
                }
              }
              if(allowanced) {
                web3Service.exchange(this.form.from, this.form.to, this.amountOutMin, this.amountInMax, this.fromToken, this.toToken, this.inputFocusIsFrom)
                  .then(res=>{
                    if(res) {
                      this.successTx = res.transactionHash
                      console.log("transaction: ", res);
                      this.swapSuccess = true
                      this.updateBalance()
                      if(this.inputFocusIsFrom) this.fromAmountInput()
                      else this.toAmountInput()
                    }
                    else {
                      this.swapFail = true
                      console.log("object", web3Service.message.code);
                      this.errorMessage = web3Service.message.message
                      this.code = web3Service.message.code
                    }
                    this.confirmingSwap = false
                    this.confirmSwap = false
                  })
                  .catch(e => {
                    console.log(e)
                    switch (e.code) {
                      case 4001:
                        this.errorMessage = e.message
                        break;
                    
                      default:
                        this.errorMessage = e.message
                        break;
                    }
                    this.confirmingSwap = false
                    this.confirmSwap = false
                    this.swapFail = true
                  })
              }
            }
          },
          getTokenItem(id){
            if(id){
              return this.tokenLists.find(item=>item.id===id)
            }else{
              return{}
            }
          },
          changeFromToken(id) {
            this.fromToken = id;
            this.selectFromToken = false

          },
          changeToToken(id) {
            this.toToken = id;
            this.selectToToken = false

          },
          swapPosition(){
            let fromToken = this.fromToken;
            this.fromToken = this.toToken;
            this.toToken = fromToken;

            let fromBalance = this.fromBalance;
            this.fromBalance = this.toBalance;
            this.toBalance = fromBalance;
            if(this.inputFocusIsFrom) {
              this.form.to = this.form.from;
              this.form.from = 0;
              this.toAmountInput()
            }
            else {
              this.form.from = this.form.to;
              this.form.to = 0;
              this.fromAmountInput()
            }
          },
          addToken() {
            web3Service.addToken(this.getTokenItem(this.toToken).addr, this.getTokenItem(this.toToken).name, Math.log10(this.getTokenItem(this.toToken).decimals))
            .then(res => {
              console.log(res);
            })
          },
          getPrice() {
            this.$axios
            .setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
            this.$axios
            .$get('https://deep-index.moralis.io/api/v2/'+this.getCurrentAddr+'/balance', {
              params: params
            })
            .then(res => {
              if(this.fromToken == 1) {
                this.fromBalance = parseFloat(res.balance)/this.tokenLists[this.fromToken-1].decimals
              }
              else {
                this.toBalance = parseFloat(res.balance)/this.tokenLists[this.toToken-1].decimals
              }
            })
            .catch(e => {
              const res = e
              if(this.fromToken == 1) {
                this.fromBalance = 0
              }
              else {
                this.toBalance = 0
              }
            })
          },
          async updateAllowance() {
            const params = {
              chain: "bsc",
              owner_address: this.getCurrentAddr,
              spender_address: web3Service.ROUTER_ADDRESS_PANCAKE
            }
            this.$axios
            .setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
            const allowance = await this.$axios
            .$get('https://deep-index.moralis.io/api/v2/erc20/'+web3Service.DYNXT_TOKEN_ADDRESS+'/allowance', {
              params: params
            })
            this.allowance = parseFloat(web3Service.web3_read.utils.fromWei(allowance.allowance))
          },
          updateBalance(val) {
            if(val) {
              /**GET BNB BALANCE OF ACCOUNT */
              const params = {
                chain: "bsc",
              }
              this.$axios
              .setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
              this.$axios
              .$get('https://deep-index.moralis.io/api/v2/'+this.getCurrentAddr+'/balance', {
                params: params
              })
              .then(res => {
                if(this.fromToken == 1) {
                  this.fromBalance = parseFloat(res.balance)/parseFloat(this.tokenLists[this.fromToken-1].decimals)
                }
                else {
                  this.toBalance = parseFloat(res.balance)/parseFloat(this.tokenLists[this.toToken-1].decimals)
                }
              })
              .catch(e => {
                const res = e
                console.log(res);
                if(this.fromToken == 1) {
                  this.fromBalance = 0
                }
                else {
                  this.toBalance = 0
                }
              })

              const params1 = {
                chain: "bsc",
              }
              /**GET ALL TOKEN BALANCE OF ACCOUNT */
              this.$axios
              .$get('https://deep-index.moralis.io/api/v2/'+this.getCurrentAddr+'/erc20', {
                params: params1
              })
              .then(res => {
                const res_item = res.filter(val => {
                  return val.token_address.toLowerCase() == web3Service.DYNXT_TOKEN_ADDRESS.toLowerCase()
                })
                if(res_item.length) {
                  if(this.fromToken == 5) {
                    this.fromBalance = parseFloat(res_item[0].balance)/this.tokenLists[this.fromToken-1].decimals
                  }
                  else {
                    this.toBalance = parseFloat(res_item[0].balance)/this.tokenLists[this.toToken-1].decimals
                  }
                }
                else {
                  if(this.fromToken == 5) {
                    this.fromBalance = 0
                  }
                  else {
                    this.toBalance = 0
                  }
                }
              })
              .catch(e => {
                const res = e
                console.log(res);
                if(this.fromToken == 5) {
                  this.fromBalance = 0
                }
                else {
                  this.toBalance = 0
                }
              })
            }
            else {
              this.fromBalance = 0
              this.toBalance = 0
            }
          }
        },
        watch: {
          getIsConnected(val) {
            this.updateBalance(val)
          }
        },
    }
</script>

<style lang="scss" scope>
  .v-text-field--outlined >>> fieldset {
    border-color: rgba(192, 0, 250, 0.986);
  }
  .v-text-field__slot{
    flex: 1 9 auto !important;
    input{
      margin-top: 1.5rem;
      min-height: 1.2rem;
      padding-left: .7rem !important;
      padding-right: 1rem !important;
    }
  }
  .balance-text{
    padding-bottom: 15px !important;
    color: lightgray !important;
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
    position: absolute;
    right: 1rem;
  }
</style>
