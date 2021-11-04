<template>
  <div class="black pl-md-70 pt-12" >
    <div>
      <div color="black" class="mx-auto rounded-xl cream-bx-2" :loading="loading">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="1">
              <v-btn text class="mt-0" @click="goBackToLPMainPage()"><v-icon dark>mdi-arrow-left</v-icon></v-btn>
            </v-col>
            <v-col cols="11">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text">Remove {{getTokenItem(fromToken).name}}-{{getTokenItem(toToken).name}} LP</div>
                <div class="grey--text">
                  <span class="sub-title">To receive {{getTokenItem(fromToken).name}} and {{getTokenItem(toToken).name}} </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-3 pa-md-7">
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
                              v-model="form.lptoken"
                              @input="fromLPTokenInput">
                  <template v-slot:append style="display: block !important">
                    <div class="">
                      <div class="text-center" style="padding-bottom: 15px !important; color: lightgray !important; text-align: right !important;">
                        balance: 
                         <span class="pl-3" style="color: white;">{{mineLPTokens}}</span>
                      </div>

                      <div>
                        <v-row>
                          <v-col v-if="getIsConnected" cols="4" class="text-left">
                            <v-btn color="cream" small class="px-0" text @click="setMax">MAX</v-btn>
                          </v-col>
                          <v-col cols="8" class="text-center pl-0 mb-5">
                            <!-- @click="selectFromToken=true" -->
                            <v-btn small text class="px-0" >
                              <v-img :src="getTokenItem(fromToken).image"
                                    contain
                                    height="25px"
                                    width="25px" class="my-auto mr-2"></v-img>
                              <v-img :src="getTokenItem(toToken).image"
                                    contain
                                    height="25px"
                                    width="25px" class="my-auto mr-2"></v-img>
                              {{getTokenItem(fromToken).name}}:{{getTokenItem(toToken).name}}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-icon color="cream" class="pr-4 component-right">mdi-arrow-down-bold</v-icon>
              </v-col>
              <v-col cols="12" class="empty-class">
                <v-text-field outlined
                              label="Output"
                              color="cream darken-2"
                              hide-details
                              class="rounded-lg"
                              placeholder="0.0"
                              type="number"
                              v-model="form.from"
                              @input="fromAmountInput">
                  <template v-slot:append style="display: block !important">
                    <div class="">
                      <v-row>
                        <v-col v-if="getIsConnected" cols="4" class="text-left">
                          <v-btn color="cream" small class="px-0" text @click="setMax">MAX</v-btn>
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
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-icon color="cream" class="pr-4 component-right">mdi-plus-thick</v-icon>
              </v-col>
              <v-col cols="12" class="empty-class">
                <v-text-field outlined
                              label="Output"
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
                      <v-row>
                        <v-col v-if="getIsConnected" cols="4" class="text-left px-0">
                          <v-btn small class="px-0" color="cream" text @click="setMax">MAX</v-btn>
                        </v-col>
                        <v-col cols="8" class="text-center pl-0 mb-5">
                          <!-- @click="selectToToken=true" -->
                          <v-btn small text class="px-0">
                            <v-img :src="getTokenItem(toToken).image"
                                  contain
                                  height="25px"
                                  width="25px" class="my-auto mr-2"></v-img>
                            {{getTokenItem(toToken).name}}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" class="text-left text-white" style="color: white; font-weight: 600;">
                <v-row class="pa-3">
                  <v-col cols="12">
                    <small class="small-larger-font">Prices</small>
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
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-btn class="rounded-lg py-7 px-4" 
                      block 
                      :disabled="getIsConnected && !(getIsConnected && form.from > 0 && form.from <= tokenAbalance) || getIsConnected && isEnable" 
                      :color="getIsConnected && form.from > 0 && form.from <= tokenAbalance && !isEnable ? 'cream' : 'darkcream'" 
                      :style="getIsConnected && !(getIsConnected && form.from > 0 && form.from <= tokenAbalance) && !isEnable && 'background-color: #a17c49 !important'" 
                      @click="enableAction">
                        {{enableButton}}
                </v-btn>
              </v-col>
              <v-col cols="6" v-if="getIsConnected">
                <v-btn class="rounded-lg py-7 px-4" 
                      block 
                      :disabled="getIsConnected && !isEnable" 
                      :color="getIsConnected && isEnable ? 'cream' : 'darkcream'" 
                      :style="getIsConnected && !isEnable && 'background-color: #a17c49 !important'" 
                      @click="confirmRemove">
                        Remove
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
      <div color="black" class="mx-auto rounded-xl cream-bx-2 pa-10 mt-12">
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

    <v-dialog v-model="confirmRemoveLiquidity" max-width="700" content-class="pl-md-70">
      <liquidity-removing :fromToken="fromToken" 
                          :toToken="toToken" 
                          :getTokenItem="getTokenItem"
                          :rateBNBToDYNXT="rateBNBToDYNXT"
                          :rateDYNXTToBNB="rateDYNXTToBNB"
                          :lpTokens="form.lptoken"
                          :getTolerance="getTolerance"
                          :fromAmount="form.from"
                          :toAmount="form.to"
                          :vuetifyNumber="vuetifyNumber"
                          @close="closeConfirmRemove()"
                          @remove="remove()">
      </liquidity-removing>
    </v-dialog>

    <v-dialog v-model="confirmingDlg" max-width="450" content-class="pl-md-70">
      <liquidity-confirming :fromToken="fromToken" 
                            :toToken="toToken" 
                            :getTokenItem="getTokenItem"
                            :fromAmount="form.from"
                            :toAmount="form.to"
                            :prefix="'Removing'"
                            @close="confirmingDlg=false">
      </liquidity-confirming>
    </v-dialog>

    <v-dialog v-model="showResultDlg" max-width="450" content-class="pl-md-70">
      <liquidity-result :supplyTransactionHash="supplyTransactionHash"
                        @close="showResultDlg=false">
      </liquidity-result>
    </v-dialog>
  </div>
</template>

<script>
  import TokenList from "../components/modals/token-list";
  import '@fortawesome/fontawesome-free/css/all.css';
  import {mapGetters, mapMutations} from 'vuex';
  import web3Service from "../web3"

  import liquidityShareToken from "../mixins/liquidity-share-token";

  import LiquidityRemoving from '../components/modals/liquidity-removing'
  import LiquidityConfirming from '../components/modals/liquidity-confirming'
  import LiquidityResult from '../components/modals/liquidity-result'

  export default {
    name: "liquidity-add",
    components: {TokenList, LiquidityConfirming, LiquidityRemoving, LiquidityResult},
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

        form: {
          lptoken: 0.0,
          from: 0.0,
          to: 0.0
        },
        loading: false,
        text: '',
        
        fromToken: 1,
        toToken: 0,
        fromTokenName: "",
        toTokenName: "",
        rateBNBToDYNXT: 0,
        rateDYNXTToBNB: 0,
        existTokenPairAddr: "",
        confirmRemoveLiquidity: false,
        confirmingDlg: false,
        showResultDlg: false,

        isEnable: false,
        totalSupplyLPTokens: 0, 
        mineLPTokens: 0, 
        tokenAaddr: "", 
        tokenAbalance: 0, 
        tokenBaddr: "", 
        tokenBbalance: 0,

        rsvVal: null,

        tokenLists: web3Service.tokenLists,
        web3Service: web3Service,

        supplyTransactionHash: "",
      }
    },

    mounted() {
      this.init()
    },

    computed: {
      ...mapGetters(["getIsConnected", "getCurrentAddr", "getTolerance", "getWorkingTokens", "getRate"]),
      enableButton() {
        if(this.getIsConnected) {
          return "Enable";
        }
        else {
          return "Unlock Wallet"
        }
      },
    },

    methods: {
      ...mapMutations(["SET_CONNECT_MODAL", "SET_WORKING_TOKENS"]),

      goBackToLPMainPage() {
        this.$router.push("/liquidity");
      },

      init() {
        const workingState = this.getWorkingTokens;
      
        if (workingState.lpTokenAddr == undefined) {
          this.$router.push("/liquidity");
          return;
        }

        if (workingState.fromToken > 0) {
          this.fromToken = workingState.fromToken
        } 
        else {
          this.fromToken = 0;
        }

        if (workingState.toToken > 0) {
          this.toToken = workingState.toToken;
        }
        else {
          this.toToken = 0;
        }

        this.existTokenPairAddr = workingState.lpTokenAddr;

        setTimeout(() => {
          this.getExistLPthings()
        }, 1000);
      },
      
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

      setMax() {
        this.form.lptoken = this.mineLPTokens;
        this.form.from = this.tokenAbalance;
        this.form.to = this.tokenBbalance;
      },

      fromLPTokenInput() {
        if (this.form.lptoken > 0 && this.form.lptoken < parseFloat(this.mineLPTokens)) {
          this.form.from = web3Service.sliceStringWithPlaceCount(parseFloat(this.tokenAbalance) * (this.form.lptoken / parseFloat(this.mineLPTokens)), 12)
          this.form.to = web3Service.sliceStringWithPlaceCount(parseFloat(this.tokenBbalance) * (this.form.lptoken / parseFloat(this.mineLPTokens)), 12)
        } 
        else {
          this.form.from = 0
          this.form.to = 0
        }

        this.isEnable = false;
      },
      
      fromAmountInput() {
        if (this.form.from > 0 && this.form.from < parseFloat(this.tokenAbalance)) {
          this.form.lptoken = web3Service.sliceStringWithPlaceCount(parseFloat(this.mineLPTokens) * (this.form.from / parseFloat(this.tokenAbalance)), 12)
          this.form.to = web3Service.sliceStringWithPlaceCount(parseFloat(this.tokenBbalance) * (this.form.from / parseFloat(this.tokenAbalance)), 12)
        } 
        else {
          this.form.lptoken = 0
          this.form.to = 0
        }

        this.isEnable = false;
      },

      toAmountInput() {
        if (this.form.to > 0 && this.form.to < parseFloat(this.tokenBbalance)) {
          this.form.from = web3Service.sliceStringWithPlaceCount(parseFloat(this.tokenAbalance) * (this.form.to / parseFloat(this.tokenBbalance)), 12)
          this.form.lptoken = web3Service.sliceStringWithPlaceCount(parseFloat(this.mineLPTokens) * (this.form.to / parseFloat(this.tokenBbalance)), 12)
        } 
        else {
          this.form.from = 0
          this.form.lptoken = 0
        }

        this.isEnable = false;
      },
      
      getTokenItem(id) {
        if(id){
          return this.tokenLists.find(item=>item.id===id)
        }else{
          return{}
        }
      },

      async getExistLPthings() {
        this.$axios.setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
        const {totalSupplyLPTokens, mineLPTokens, tokenAaddr, tokenAbalance, tokenBaddr, tokenBbalance} = 
                await liquidityShareToken.getLPThings(this.existTokenPairAddr ,this.getCurrentAddr, this.$axios, this.params);

        this.totalSupplyLPTokens = totalSupplyLPTokens 
        this.mineLPTokens = mineLPTokens
        this.tokenAaddr = tokenAaddr 
        this.tokenAbalance = tokenAbalance
        this.tokenBaddr = tokenBaddr
        this.tokenBbalance = tokenBbalance

        this.rateBNBToDYNXT = web3Service.toPlainString(1 / this.getRate).slice(0, 14);
        this.rateDYNXTToBNB = web3Service.toPlainString(this.getRate).slice(0, 14);
      },

      async enableAction() {
        if (!this.getIsConnected) {
          this.SET_CONNECT_MODAL()
        }
        else {
          let rsv = await web3Service.signDataForRemoveLP(this.existTokenPairAddr, this.form.lptoken)
          if (rsv != null) {
            this.isEnable = true;
            this.rsvVal = rsv;
          }
          else {
            this.isEnable = false;
          }
        }
      },

      closeConfirmRemove() {
        this.confirmRemoveLiquidity=false
        this.isEnable = false;
      },

      confirmRemove() {
        if (!this.getIsConnected) {
          this.SET_CONNECT_MODAL()
        }
        else {
          this.confirmRemoveLiquidity = true;
        }
      },

      async remove() {
        this.confirmRemoveLiquidity = false;

        if (!this.getIsConnected) {
          this.SET_CONNECT_MODAL()
        }
        else {
          this.confirmingDlg = true;

          // TODO: add with BNB, modify with several currency
          const supplyRes = await web3Service.removeLP(this.existTokenPairAddr, this.form.lptoken, this.form.from, this.form.to, this.rsvVal);
          if (supplyRes == null) {
            this.confirmingDlg = false;
            this.confirmRemoveLiquidity = true;
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
          this.init()
        }
        else {
          
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
  .empty-class .v-text-field__slot{
    flex: 1 9 auto !important;
    input{
      margin-top: 0;
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
