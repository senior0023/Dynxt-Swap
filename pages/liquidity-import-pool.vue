<template>
  <div class="black pl-md-70 pt-12" >
    <div>
      <!----------------->
      <!-- Import pool -->
      <!----------------->
      <div color="black" class="mx-auto rounded-xl cream-bx-2">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="1">
              <v-btn text class="mt-0" @click="goBackToLPMainPage()"><v-icon dark>mdi-arrow-left</v-icon></v-btn>
            </v-col>
            <v-col cols="8">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text">IMPORT POOL</div>
                <div class="grey--text">
                  <span class="sub-title">Import an existing pool</span>
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
          <v-form class="mt-0" ref="form">
            <v-row>
              <v-col cols="12">
                 <!-- @click="selectFromToken=true" -->
                <div class="pl-4 pt-4 pb-4 rounded-lg cursor-pointer form-border">
                  <div v-if="fromToken">
                    <v-btn small text class="px-0">
                      <v-img :src="getTokenItem(fromToken).image"
                            contain
                            height="25px"
                            width="25px" class="my-auto mr-2"></v-img>
                      {{getTokenItem(fromToken).name}}
                    </v-btn>
                    <v-icon color="cream" class="pr-4 component-right">mdi-chevron-down</v-icon>
                  </div>
                  <div v-else>
                    <v-btn text small class="mt-1">
                      Select a currency
                    </v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" class="text-center">
                <v-icon color="cream">mdi-plus-thick</v-icon>
              </v-col>
              <v-col cols="12">
                 <!-- @click="selectToToken=true" -->
                <div class="pl-4 pt-4 pb-4 rounded-lg cursor-pointer form-border">
                  <div v-if="toToken">
                    <v-btn small text class="px-0" @click="selectToToken=true" :disabled="!getIsConnected">
                      <v-img :src="getTokenItem(toToken).image"
                            contain
                            height="25px"
                            width="25px" class="my-auto mr-2"></v-img>
                      {{getTokenItem(toToken).name}}
                    </v-btn>
                    <v-icon color="cream" class="pr-4 component-right">mdi-chevron-down</v-icon>
                  </div>
                  <div v-else>
                    <v-btn text small class="mt-1" @click="selectToToken=true" :disabled="!getIsConnected">
                      Select a currency
                    </v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="mt-5 mb-0">
                  <p class="txt-white">{{ resultText }}</p>
                </div>
                <div class="mb-0" v-if="fromToken > 0 && toToken > 0" >
                  <p class="txt-action-white" @click="manageAction">{{ actionText }}</p>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div v-show="getIsConnected && findResult" color="black" class="mx-auto rounded-xl form-border pa-6">
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
                      <p class="align-right mb-0">{{shareOfPool >= 0.01 ? shareOfPool + " %" : "&lt;0.01 %"}}</p>
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
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
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

  </div>
</template>

<script>
  import web3Service from "../web3";
  import TokenList from "../components/modals/token-list";
  import SettingList from "../components/modals/setting-list";
  import {mapGetters, mapMutations} from 'vuex';
  import liquidityShareToken from "../mixins/liquidity-share-token";

  export default {
    name: "liquidity-import-pool",
    components: {TokenList, SettingList},

    data() {
      return {
        selectToToken: false,
        selectFromToken: false,
        
        showSetting: false,

        fromToken: 1,
        toToken: 0,
        tokenLists: web3Service.tokenLists,

        resultText: "Select A Token To Find Your Liquidity",
        actionText: "",
        findResult: false,

        params: {
          chain: "bsc",
        },

        existTokenPairAddr: "",
        totalSupplyLPTokens: 0, 
        mineLPTokens: 0, 
        tokenAaddr: "", 
        tokenAbalance: 0, 
        tokenBaddr: "", 
        tokenBbalance: 0,
        shareOfPool: 0,
      }
    },

    computed: {
      ...mapGetters(["getIsConnected", "getCurrentAddr", "getTolerance", "getRate"]),
    },

    methods: {
      ...mapMutations(["SET_TOLERANCE"]),

      goBackToLPMainPage() {
        this.$router.push("/liquidity");
      },

      changeTolerance(tol){
        this.SET_TOLERANCE(tol)
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
        if (id == 5) {
          this.toToken = id;
          this.selectToToken = false;

          this.findPool()
        } 
        else {
          alert("Only support BNB / DNYXT pair");
        }
      },

      async findPool() {
        const {existTokenPairAddr, rate1, rate2} = await liquidityShareToken.getExistTokenPair(this.fromToken, this.toToken, this.getRate);
        this.existTokenPairAddr = existTokenPairAddr;

        if (existTokenPairAddr != "0x0000000000000000000000000000000000000000" && existTokenPairAddr != "") {
          this.$axios.setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
          const {totalSupplyLPTokens, mineLPTokens, tokenAaddr, tokenAbalance, tokenBaddr, tokenBbalance} = 
                  await liquidityShareToken.getLPThings(this.existTokenPairAddr, this.getCurrentAddr, this.$axios, this.params);

          this.totalSupplyLPTokens = totalSupplyLPTokens 
          this.mineLPTokens = mineLPTokens
          this.tokenAaddr = tokenAaddr 
          this.tokenAbalance = tokenAbalance
          this.tokenBaddr = tokenBaddr
          this.tokenBbalance = tokenBbalance

          if (this.mineLPTokens > 0) {
            this.shareOfPool = (this.mineLPTokens / this.totalSupplyLPTokens * 100).toFixed(2)

            this.findResult = true
          }
          else {
            this.findResult = false
          }
        } 
        else {
          this.findResult = false
        }

        if (!this.findResult) {
          this.resultText = "You don’t have liquidity in this pool yet";
          this.actionText = "Add Liquidity";
        }
        else {
          this.resultText = "Pool Found";
          this.actionText = "Manage this pool";
        }
      },

      manageAction() {
        if (!this.getIsConnected) {
          this.$router.push("/liquidity");
        } 
        else {
          if (this.findResult) {
            this.$router.push("/liquidity");
          } 
          else {
            this.$router.push("/liquidity-add");
          }
        }
      },
    },

    watch: {
      getIsConnected(val) {
        if(val) {
          
        }
        else {
          this.resultText = "Connect to a wallet to find pools";
          this.actionText = "Back to liquidity";
        }
      }
    },
  }
</script>

<style lang="scss" scope>
  .txt-white {
    text-align: center; 
    color: white;
    font-size: 14px;
  }
  .txt-action-white {
    text-align: center; 
    cursor: pointer;
    text-decoration: underline;
    color: white;
    font-size: 14px;
  }
  .form-border {
    border: thin solid #FFC473;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .component-right {
    float:right;
  }
  .text-lp-title {
    color: #FFC473;
    font-weight: bold;
    font-size: 1rem;
  }
  .align-right {
    float: right;
  }
  .align-left {
    float: left;
  }
</style>
