<template>
  <div class="black pl-md-70 pt-12" >
    <div>
      <div color="black" class="mx-auto rounded-xl cream-bx-2" :loading="loading">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="1">
              <v-btn text class="mt-0" @click="goBackToLPMainPage()"><v-icon dark>mdi-arrow-left</v-icon></v-btn>
            </v-col>
            <v-col cols="8">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text">ADD LIQUIDITY</div>
                <div class="grey--text">
                  <span class="sub-title">Add Liquidity to receive LP tokens</span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <v-btn text class="mt-7 ml-md-10" @click="showSetting=true"><v-icon dark>fas fa-sliders-h</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-3 pa-md-7">
          <v-card class="mx-auto card-title-border" dark v-if="fromToken > 0 && toToken > 0 && !existTokenPair">
            <v-card-title>
              <v-icon left> mdi-alert-circle-outline </v-icon>
              <span class="smaller-font">You are the first liquidity provider.</span>
            </v-card-title>
            <v-card-text class="ml-8 small-larger-font"> 
              The ratio of tokens you add will set the price of this pool. 
              <br/> 
              Once you are happy with the rate click supply to review. 
              </v-card-text>
          </v-card>

          <v-form class="mt-6" ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field outlined
                              label="Input"
                              color="cream darken-2"
                              hide-details
                              class="rounded-lg"
                              placeholder="0.0"
                              type="number"
                              v-model="form.from"
                              @input="fromAmountInput">
                  <template v-slot:append style="display: block !important">
                    <div class="">
                      <div class="text-center" style="padding-bottom: 15px !important; color: lightgray !important;">balance:  <span class="pl-3" style="color: white;">{{fromBalance>1e8?(fromBalance*1).toLocaleString('fullwide', { useGrouping: false }).slice(0,7)+"...":(fromBalance*1).toLocaleString('fullwide', { useGrouping: false })}}</span></div>
                      <div v-if="fromToken">
                        <v-row>
                          <v-col v-if="getIsConnected" cols="4" class="text-left">
                            <v-btn color="cream" small class="px-0" text @click="setMax0">MAX</v-btn>
                          </v-col>
                          <v-col cols="8" class="text-center pl-0 mb-5">
                            <!-- @click="selectFromToken=true" -->
                            <v-btn small text class="px-0" >
                              <v-img :src="getTokenItem(fromToken).image"
                                    contain
                                    height="25px"
                                    width="25px" class="my-auto mr-2"></v-img>
                              {{getTokenItem(fromToken).name}}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                      <div v-else>
                        <v-btn text small class="text-center pl-0 mb-4 mt-1" @click="selectFromToken=true">
                          Select a currency
                        </v-btn>
                      </div>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-icon color="cream" class="pr-4 component-right">mdi-plus-thick</v-icon>
              </v-col>
              <v-col cols="12">
                <v-text-field outlined
                              label="Input"
                              type="number"
                              :step="0.001"
                              hide-details
                              placeholder="0.0"
                              color="cream"
                              class="rounded-lg"
                              v-model="form.to"
                              @input="toAmountInput">
                  <template v-slot:append style="display: block !important">
                    <div class="">
                      <div class="text-center" style="padding-bottom: 15px !important; color: lightgray !important;">balance:  <span class="pl-3" style="color: white;">{{toBalance>1e8?(toBalance*1).toLocaleString('fullwide', { useGrouping: false }).slice(0,7)+"...":(toBalance*1).toLocaleString('fullwide', { useGrouping: false })}}</span></div>
                      <div v-if="toToken">
                        <v-row>
                          <v-col v-if="getIsConnected" cols="4" class="text-left px-0">
                            <v-btn small class="px-0" color="cream" text @click="setMax1">MAX</v-btn>
                          </v-col>
                          <v-col cols="8" class="text-center pl-0 mb-5">
                            <!-- @click="selectToToken=true" -->
                            <v-btn small text class="px-0" @click="selectToToken=true">
                              <v-img :src="getTokenItem(toToken).image"
                                    contain
                                    height="25px"
                                    width="25px" class="my-auto mr-2"></v-img>
                              {{getTokenItem(toToken).name}}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                      <div v-else>
                        <v-btn text small class="text-center pl-0 mb-4 mt-1" @click="selectToToken=true">
                          Select a currency
                        </v-btn>
                      </div>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="text-left text-white" style="color: white; font-weight: 600;" v-if="fromToken > 0 && toToken > 0">
                <v-row class="pa-3">
                  <v-col cols="12">
                    <small class="small-larger-font">Prices and pool share</small>
                  </v-col>
                  <v-col cols="4">
                    <div class="text--center">
                      <small class="small-larger-font">{{this.rateDYNXTToBNB}}</small>
                    </div>
                    <div class="text--center">
                      <small class="small-larger-font">DYNXT to BNB</small>
                    </div>
                  </v-col>
                  <v-col cols="4">
                  </v-col>
                  <v-col cols="4">
                    <div class="text--center">
                      <small class="small-larger-font">{{this.rateBNBToDYNXT}}</small>
                    </div>
                    <div class="text--center">
                      <small class="small-larger-font">BNB to DYNXT</small>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="text--center">
                      <p class="larger-font">{{shareOfPool >= 0.01 ? shareOfPool + " %" : "&lt;0.01 %"}}</p>
                    </div>
                    <div class="text--center">
                      <small class="small-larger-font">Share of pool</small>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" v-if="getIsConnected && fromToken > 0 && toToken > 0 && form.from > 0 && form.to > 0 && !isAllow">
                <v-btn class="rounded-lg py-7 px-4" 
                      block 
                      :color="'cream'" 
                      @click="enableDYNXT">
                        Enable DYNXT
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn class="rounded-lg py-7 px-4" 
                      block 
                      :disabled="getIsConnected && !(getIsConnected && form.from > 0 && form.from <= fromBalance && form.to > 0 && form.to <= toBalance) || !isAllow" 
                      :color="getIsConnected && form.from > 0 && form.from <= fromBalance && form.to > 0 && form.to <= toBalance ? 'cream' : getIsConnected && form.from <= 0 ? 'darkcream' : 'cream'" 
                      :style="(getIsConnected && !(getIsConnected && form.from > 0 && form.from <= fromBalance && form.to > 0 && form.to <= toBalance) || !isAllow) && 'background-color: #a17c49 !important'" 
                      @click="confirmSupply">
                        {{connectButton}}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
      <div v-show="fromToken > 0 && toToken > 0 && mineLPTokens <= 0" color="black" class="mx-auto rounded-xl cream-bx-2 pa-10 mt-12" :loading="loading">
        <v-row>
          <v-col cols="12" class="text-left text-white py-1" style="color: gray; font-weight: 600;">
            <small class="smaller-font">By adding liquidity you'll earn 0.17%  of all trades on this pair proportional to your share of the pool. Fees are added to the pool.. accrue in real time and can be claimed by withdrawing your liquidity.</small>
          </v-col>
        </v-row>
      </div>
      <div v-show="fromToken > 0 && toToken > 0 && mineLPTokens > 0" color="black" class="mx-auto rounded-xl cream-bx-2 pa-10 mt-12">
        <v-row>
          <v-col cols="12" class="text-left text-white py-1" style="color: gray; font-weight: 600;">
            <p class="text-lp-title mb-0 mt-3">LP tokens in your wallet</p>
          </v-col>
          <v-col cols="12">
            <v-img :src="getTokenItem(fromToken).image"
                  contain
                  height="25px"
                  width="25px" class="my-auto mr-1 align-left"></v-img>
            <v-img :src="getTokenItem(toToken).image"
                  contain
                  height="25px"
                  width="25px" class="my-auto mr-2 align-left"></v-img>
            <p class="align-left mb-0">{{getTokenItem(fromToken).name}} - {{getTokenItem(toToken).name}} LP</p>
            <p class="align-right mb-0">{{ mineLPTokens }}</p>
          </v-col>
          <v-col cols="12">
            <p class="align-left mb-0">Share of Pool:</p>
            <p class="align-right mb-0">{{mineLPTokens / totalSupplyLPTokens >= 0.01 ? (mineLPTokens / totalSupplyLPTokens * 100).toFixed(2) + " %" : "&lt;0.01 %"}}</p>
          </v-col>
          <v-col cols="12">
            <p class="align-left mb-0">Pooled {{ getTokenItem(fromToken).name }}:</p>
            <p class="align-right mb-0">{{ (tokenAbalance * mineLPTokens / totalSupplyLPTokens).toFixed(3) }}</p>
          </v-col>
          <v-col cols="12">
            <p class="align-left mb-0">Pooled {{ getTokenItem(toToken).name }}:</p>
            <p class="align-right mb-0">{{ (tokenBbalance * mineLPTokens / totalSupplyLPTokens).toFixed(3) }}</p>
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

    <v-dialog v-model="confirmAddLiquidity" max-width="500" content-class="pl-md-70" v-if="!existTokenPair">
      <liquidity-new-pool :fromToken="fromToken" 
                          :toToken="toToken" 
                          :getTokenItem="getTokenItem"
                          :rateBNBToDYNXT="rateBNBToDYNXT"
                          :rateDYNXTToBNB="rateDYNXTToBNB"
                          :shareOfPool="shareOfPool"
                          :fromAmount="form.from"
                          :toAmount="form.to"
                          @close="confirmAddLiquidity=false"
                          @supply="supply()">
      </liquidity-new-pool>
    </v-dialog>

    <v-dialog v-model="confirmAddLiquidity" max-width="700" content-class="pl-md-70" v-if="existTokenPair">
      <liquidity-supply :fromToken="fromToken" 
                        :toToken="toToken" 
                        :getTokenItem="getTokenItem"
                        :rateBNBToDYNXT="rateBNBToDYNXT"
                        :rateDYNXTToBNB="rateDYNXTToBNB"
                        :shareOfPool="shareOfPool"
                        :getTolerance="getTolerance"
                        :lpTokens="lpTokens"
                        :fromAmount="form.from"
                        :toAmount="form.to"
                        @close="confirmAddLiquidity=false"
                        @supply="supply()">
      </liquidity-supply>
    </v-dialog>

    <v-dialog v-model="confirmingDlg" max-width="450" content-class="pl-md-70">
      <liquidity-confirming :fromToken="fromToken" 
                            :toToken="toToken" 
                            :getTokenItem="getTokenItem"
                            :fromAmount="form.from"
                            :toAmount="form.to"
                            :prefix="'Supplying'"
                            @close="confirmingDlg=false">
      </liquidity-confirming>
    </v-dialog>

    <v-dialog v-model="showResultDlg" max-width="450" content-class="pl-md-70">
      <liquidity-result :supplyTransactionHash="supplyTransactionHash"
                        @close="showResultDlg=false">
      </liquidity-result>
    </v-dialog>

    <v-dialog v-model="showSetting" max-width="500" content-class="pl-md-70">
      <setting-list @close="showSetting=false" @change="changeTolerance"></setting-list>
    </v-dialog>
  </div>
</template>

<script>
  import TokenList from "../components/modals/token-list";
  import SettingList from "../components/modals/setting-list";
  import '@fortawesome/fontawesome-free/css/all.css';
  import {mapGetters, mapMutations} from 'vuex';
  import web3Service from "../web3"

  import liquidityShareToken from "../mixins/liquidity-share-token";

  import LiquidityNewPool from '../components/modals/liquidity-new-pool'
  import LiquiditySupply from '../components/modals/liquidity-supply'
  import LiquidityConfirming from '../components/modals/liquidity-confirming'
  import LiquidityResult from '../components/modals/liquidity-result'

  export default {
    name: "liquidity-add",
    components: {TokenList, SettingList, LiquidityNewPool, LiquiditySupply, LiquidityConfirming, LiquidityResult},
    props: {
      info: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        selectToToken: false,
        selectFromToken: false,

        params: {
          chain: "bsc",
        },
        
        fromBalance: 0,
        toBalance: 0,

        form: {
          from: 0.0,
          to: 0.0
        },
        loading: false,
        text: '',
        
        fromToken: 1,
        toToken: 0,
        rateBNBToDYNXT: 0,
        rateDYNXTToBNB: 0,
        allowance: 0,
        isAllow: true,
        existTokenPair: true,
        existTokenPairAddr: "",
        confirmAddLiquidity: false,
        confirmingDlg: false,
        showResultDlg: false,

        lpTokens: 13.005,
        shareOfPool: 0.00,

        totalSupplyLPTokens: 0, 
        mineLPTokens: 0, 
        tokenAaddr: "", 
        tokenAbalance: 0, 
        tokenBaddr: "", 
        tokenBbalance: 0,

        inputCounts: 0,
        showSetting: false,
        tokenLists: web3Service.tokenLists,

        web3Service: web3Service,

        supplyTransactionHash: "",
      }
    },

    mounted: function() {
      setTimeout(() => {
        const workingState = this.getWorkingTokens;
        if (workingState.fromToken > 0) {
          this.fromToken = workingState.fromToken
        } 
        else {
          // this.fromToken = 0;
        }

        this.changeFromToken(this.fromToken);
        this.getFromBalance();

        if (workingState.toToken > 0) {
          this.toToken = workingState.toToken;
          this.changeToToken(this.toToken);
          this.getToBalance();
        }
        else {
          this.toToken = 0;
        }
      }, 1000);
    },

    computed: {
      ...mapGetters(["getIsConnected", "getCurrentAddr", "getTolerance", "getRate", "getWorkingTokens"]),
      connectButton() {
        if(this.getIsConnected) {
          // TODO:
          if (this.form.to > this.toBalance) {
            return "Insufficient DYNXT balance";
          }
          if (this.form.from > this.fromBalance) {
            return "Insufficient BNB balance";
          }
          if (this.form.to > 0 && this.form.to < this.toBalance && this.form.from > 0 && this.form.from < this.fromBalance){
            return "Supply";
          } 
          else { 
            return "Enter an amount";
          }
        }
        else {
          return "Unlock Wallet"
        }
      },
      amountOutMin() {
        return (this.form.to * (1 - this.getTolerance/100)).toFixed(5)
      },
    },

    methods: {
      ...mapMutations(["SET_CONNECT_MODAL", "SET_TOLERANCE"]),

      goBackToLPMainPage() {
        this.$router.push("/liquidity");
      },

      setMax0() {
        this.form.from = this.fromBalance;
        this.fromAmountInput()
      },

      setMax1() {
        this.form.to = this.toBalance;
        this.toAmountInput()
      },

      changeTolerance(tol){
        this.SET_TOLERANCE(tol)
      },
      
      fromAmountInput(){
        this.inputCounts++;
        if (this.existTokenPair) {
          web3Service.getAmountsOutWithLP(this.form.from, this.fromToken, this.toToken, this.inputCounts)
          .then(res=>{
            if(res.seq == this.inputCounts) {
              if(res.res && !(res.res[0].length<2 && res.res[1].length<2)) {
                if(res.res.length) {
                  console.log(res.res[0])
                  console.log(res.res[1] + ", " + res.res[1].length)
                  this.form.to =  web3Service.sliceStringWithPlaceCount(res.res[1]/this.tokenLists[this.toToken-1].decimals, 14) //(fromBalance*1).toLocaleString('fullwide', { useGrouping: false })
                  // this.form.to =  web3Service.toPlainString(res.res[1]/this.tokenLists[this.toToken-1].decimals) //(fromBalance*1).toLocaleString('fullwide', { useGrouping: false })
                  this.calcRate()

                  if (this.allowance / 1e18 < this.form.to) {
                    this.isAllow = false;
                  }
                }
                else
                  this.form.to = 0
              }
              else {
                this.form.to = 0
              }
            }
          });
        }
        else {
          this.calcFirstRate();
        }
      },

      toAmountInput(){
        if (this.allowance / 1e18 < this.form.to) {
          this.isAllow = false;
        }

        this.inputCounts++;
        if (this.existTokenPair) {
          web3Service.getAmountsInWithLP(this.form.to, this.fromToken, this.toToken, this.inputCounts)
          .then(res=>{
            if(res.seq == this.inputCounts) {
              if(res.res && !(res.res[0].length<2 && res.res[1].length<2)) {
                if(res.res.length) {
                  this.form.from =  web3Service.sliceStringWithPlaceCount(res.res[0]/this.tokenLists[this.fromToken-1].decimals, 14)
                  // this.form.from =  web3Service.toPlainString(res.res[0]/this.tokenLists[this.fromToken-1].decimals)
                  this.calcRate()
                }
                else
                  this.form.from = 0
              }
              else {
                this.form.from = 0
              }
            }
          });
        }
        else {
          this.calcFirstRate();
        }
      },

      calcFirstRate() {
        // TODO: change with tokens
        if (this.form.from > 0 && this.form.to > 0) {
          this.rateBNBToDYNXT = web3Service.toPlainString(this.form.to / this.form.from).slice(0,14);
          this.rateDYNXTToBNB = web3Service.toPlainString(this.form.from / this.form.to).slice(0,14);

          this.shareOfPool = 100;
        }
      },

      calcRate() {
        if (this.totalSupplyLPTokens > 0) {
          const fromAmount = this.form.from * 100 / 100
          const newTotalATokenAmount = fromAmount + this.tokenAbalance
          this.shareOfPool = (fromAmount / newTotalATokenAmount * 100).toFixed(2)
          this.lpTokens = (this.form.from * this.totalSupplyLPTokens / this.tokenAbalance).toFixed(2)
        }
      },
      
      getTokenItem(id){
        if(id){
          return this.tokenLists.find(item=>item.id===id)
        }else{
          return{}
        }
      },

      async changeFromToken(id) {
        // if (id == 5) {
          this.fromToken = id;
          this.selectFromToken = false;

          this.getFromBalance();

          if (this.fromToken == 5) {
            await this.getAllowance();
          }
          
          if (this.fromToken > 0 && this.toToken > 0) {
            this.getExistLPthings();
          }
        // } 
        // else {
        //   alert("Only support BNB / DNYXT pair");
        // }
      },

      async changeToToken(id) {
        if (id == 5) {
          this.toToken = id;
          this.selectToToken = false;

          this.getToBalance();
          await this.getAllowance();
        
          if (this.fromToken > 0 && this.toToken > 0) {
            this.getExistLPthings();
          }

          this.fromAmountInput();
        } 
        else {
          alert("Only support BNB / DNYXT pair");
        }
      },

      async getExistLPthings() {
        const {existTokenPair, rateBNBToDYNXT, rateDYNXTToBNB} = await liquidityShareToken.getExistTokenPair(this.fromToken, this.toToken, this.getRate);
        this.existTokenPairAddr = existTokenPair;
        this.rateBNBToDYNXT = rateBNBToDYNXT;
        this.rateDYNXTToBNB = rateDYNXTToBNB;

        if (this.existTokenPairAddr != "0x0000000000000000000000000000000000000000" && this.existTokenPairAddr != "") {
          this.existTokenPair = true;

          this.$axios.setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
          const {totalSupplyLPTokens, mineLPTokens, tokenAaddr, tokenAbalance, tokenBaddr, tokenBbalance} = 
                  await liquidityShareToken.getLPThings(this.existTokenPairAddr ,this.getCurrentAddr, this.$axios, this.params);

          this.totalSupplyLPTokens = totalSupplyLPTokens 
          this.mineLPTokens = mineLPTokens
          this.tokenAaddr = tokenAaddr 
          this.tokenAbalance = tokenAbalance
          this.tokenBaddr = tokenBaddr
          this.tokenBbalance = tokenBbalance
        } 
        else {
          this.existTokenPair = false;
        }

        this.calcRate();
      },

      getFromBalance() {
        /**GET BNB BALANCE OF ACCOUNT */
        this.$axios.setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
        this.$axios.$get('https://deep-index.moralis.io/api/v2/'+this.getCurrentAddr+'/balance', {
          params: this.params
        })
        .then(res => {
          if(this.fromToken == 1) {
            this.fromBalance = parseFloat(res.balance)/parseFloat(this.tokenLists[this.fromToken-1].decimals);
          }
          else {
            this.toBalance = parseFloat(res.balance)/parseFloat(this.tokenLists[this.toToken-1].decimals);
          }
        })
        .catch(e => {
          if(this.fromToken == 1) {
            this.fromBalance = 0;
          }
          else {
            this.toBalance = 0;
          }
        });
      },

      getToBalance() {
        this.$axios.setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
        this.$axios.$get('https://deep-index.moralis.io/api/v2/'+this.getCurrentAddr+'/erc20', {
          params: this.params
        })
        .then(res => {
          const res_item = res.filter(val => {
            return val.token_address.toLowerCase() == web3Service.DYNXT_TOKEN_ADDRESS.toLowerCase();
          })
          if(res_item.length) {
            if(this.fromToken == 5) {
              this.fromBalance = parseInt(res_item[0].balance)/this.tokenLists[this.fromToken-1].decimals;
            }
            else {
              this.toBalance = parseInt(res_item[0].balance)/this.tokenLists[this.toToken-1].decimals;
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
          if(this.fromToken == 5) {
            this.fromBalance = 0;
          }
          else {
            this.toBalance = 0;
          }
        })
      },

      async getAllowance() {
        this.allowance = await web3Service.getLiquidityAllowance();

        console.log("Liquidity allowance: " + this.allowance);

        if (this.allowance == 0) {
          this.isAllow = false;
        }
      },

      async enableDYNXT() {
        if (await web3Service.approveRouterForExchange(this.getCurrentAddr)) {
          this.isAllow = true;

          this.getAllowance();
        }
        else {
          this.isAllow = false;
        }
      },

      confirmSupply() {
        if (!this.getIsConnected) {
          this.SET_CONNECT_MODAL()
        }
        else {
          this.confirmAddLiquidity = true;
        }
      },

      async supply() {
        this.confirmAddLiquidity = false;

        if (!this.getIsConnected) {
          this.SET_CONNECT_MODAL()
        }
        else {
          this.confirmingDlg = true;

          // TODO: add with BNB, modify with several currency
          const supplyRes = await web3Service.supplyLP(this.form.from, this.form.to);
          if (supplyRes == null) {
            this.confirmingDlg = false;
            this.confirmAddLiquidity = true;
          } else {
            this.confirmingDlg = false;
            this.showResultDlg = true;

            this.supplyTransactionHash = supplyRes;
          }
        }
      }
    },

    watch: {
      getIsConnected(val) {
        if(val) {
          this.getFromBalance();
          this.getToBalance();
        }
        else {
          this.fromBalance = 0;
          this.toBalance = 0;
        }
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
  .smaller-font {
    font-size: 70%;
    line-height: 1;
  }
  .text--center {
    text-align: center;
  }
  .small-larger-font {
    font-size: 90%;
  }
  .larger-font {
    font-size: 150%;
  }
  .confirm-title {
    font-size: 2.7em;
  }
  .align-right {
    float: right;
  }
  .align-left {
    float: left;
  }
  .font-120 {
    font-size: 120%;
  }
  .card-title-border {
    border: thin solid #FFC473 !important;
    border-radius: 10px !important;
  }
  .result-up-icon {
    font-size: 5em !important;
    color: #FFC473 !important;
  }
</style>
