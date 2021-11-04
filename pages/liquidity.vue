<template>
  <div class="black pl-md-70 pt-12" >
    <div>
      <div color="black" class="mx-auto rounded-xl cream-bx-2">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="9">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text">YOUR LIQUIDITY</div>
                <div class="grey--text">
                  <span class="sub-title">Remove liquidity to receive tokens back</span>
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
          <v-form class="mx-auto" ref="form">
            <v-row class="mx-auto">
              <v-col cols="12">
                <div class="mt-0 mb-4" v-if="getIsConnected">
                  <div
                    v-if="existLP"
                    class="mb-6 mx-2 rounded-xl" 
                    color="gray"
                    dark>
                    <v-expansion-panels
                      v-model="detailpool"
                      color="cream"
                      class="rounded-xl"
                      active-class="rounded-xl">
                      <v-expansion-panel class="pa-3 grey darken-3"
                                          v-for="(item, index) in mineLPPairs" 
                                          :key="index">
                        <v-expansion-panel-header>
                          <div>
                            <div class="lp-row mx-auto mb-2">
                              <div>
                                <v-img :src="getTokenItem(item.fromToken).image"
                                  contain
                                  height="25px"
                                  width="25px"
                                  class="mr-1 align-left"/>
                                <v-img :src="getTokenItem(item.toToken).image"
                                  contain
                                  height="25px"
                                  width="25px"
                                  class="mr-2 align-left"/>
                              </div>
                              <div>
                                <span color="cream" class="cream--text">
                                  <b>{{ item.fromTokenName }} / {{ item.toTokenName }}</b>
                                </span>
                              </div>
                            </div>
                            <small class="ml-2 font-120">{{ item.mineLPTokens }}</small>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="pb-0" :key="1">
                          <div class="mt-4 pb-0">
                            <div class="lp-row mx-auto mb-2">
                              <div>
                                <v-img :src="getTokenItem(item.fromToken).image"
                                  contain
                                  height="25px"
                                  width="25px"
                                  class="mr-1 align-left"/>
                              </div>
                              <div>
                                <span color="cream" class="cream--text"><b>Pooled {{item.fromTokenName}}</b></span>
                              </div>
                              <div style="margin-left: auto">
                                <span color="cream" class="cream--text"><b>{{ item.tokenAbalance }}</b></span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="lp-row mx-auto mb-2">
                              <div>
                                <v-img :src="getTokenItem(item.toToken).image"
                                  contain
                                  height="25px"
                                  width="25px"/>
                              </div>
                              <div>
                                <span color="cream" class="cream--text"><b>Pooled {{item.toTokenName}}</b></span>
                              </div>
                              <div style="margin-left: auto">
                                <span color="cream" class="cream--text"><b>{{ item.tokenBbalance }}</b></span>
                              </div>
                            </div>
                          </div>
                          <div class="mb-4">
                            <div class="lp-row mx-auto mb-2">
                              <div>
                                <span color="cream" class="cream--text"><b>Share of pool</b></span>
                              </div>
                              <div style="margin-left: auto">
                                <span color="cream" class="cream--text"><b>{{item.shareOfPool >= 0.01 ? item.shareOfPool + " %" : "&lt;0.01 %"}}</b></span>
                              </div>
                            </div>
                          </div>
                          <v-btn class="rounded-lg py-7 px-4" :color="'cream'" style="font-weight: 600;" block @click="removeLiquidity(item.fromToken, item.toToken, item.lpAddress)">remove</v-btn>
                          <v-btn text class="rounded-lg py-7 px-4 mt-2" :color="'cream'" style="font-weight: 600;" block @click="addLiquidityInstead(item.fromToken, item.toToken, item.lpAddress)">+ Add Liquidity instead</v-btn>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                  <p v-else class="txt-gray">No Liquidity Found</p>
                  <p class="txt-gray">Don't see a pool you joined?</p>
                  <div class="mt- align-center">
                    <v-btn class="rounded-lg py-2 px-2 lp-button" @click="importPool">Find other LP tokens</v-btn>
                  </div>
                </div>
                <div v-else>
                  <p class="txt-gray">Connect to a wallet to view your liquidity.</p>
                </div>
              </v-col>
              <v-col cols="12">
                <v-btn class="rounded-lg py-7 px-4" :color="'cream'" style="font-weight: 600;" block @click="addLiquidity">{{addBtn}}</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
    </div>

    <v-dialog v-model="showSetting" max-width="500" content-class="pl-md-70">
      <setting-list @close="showSetting=false" @change="changeTolerance"></setting-list>
    </v-dialog>
  </div>
</template>

<script>
  import SettingList from "../components/modals/setting-list";
  import web3Service from "../web3";
  import {mapGetters, mapMutations} from 'vuex';
  import liquidityShareToken from "../mixins/liquidity-share-token";

  export default {
    name: "liquidity",
    components: {SettingList},

    data() {
      return {
        showSetting: false,
        tokenLists: web3Service.tokenLists,
        existLP: false,
        allLPPairs: [],
        mineLPPairs: [],
        detailpool: [],
        addBtn: "+ Add Liquidity",

        params: {
          chain: "bsc",
        },
      }
    },

    mounted: function() {
      setTimeout(() => {
        this.findAllLPPairs();
      }, 1000);
    },

    computed: {
      ...mapGetters(["getIsConnected", "getCurrentAddr", "getTolerance", "getRate"]),
    },

    methods: {
      ...mapMutations(["SET_CONNECT_MODAL", "SET_TOLERANCE", "SET_WORKING_TOKENS"]),

      changeTolerance(tol){
        this.SET_TOLERANCE(tol)
      },

      addLiquidity() {
        if (!this.getIsConnected) {
          this.SET_CONNECT_MODAL()
        }
        else {
          this.SET_WORKING_TOKENS({
            fromToken: 1, 
            fromTokenName: this.getTokenItem(1).name, 
            toToken: 0,
            fromTokenName: this.getTokenItem(0).name, 
            lpTokenAddr: "0x0000000000000000000000000000000000000000",
          });

          this.$router.push("/liquidity-add");
        }
      },

      removeLiquidity(fromToken, toToken, lpAddress) {
        this.SET_WORKING_TOKENS({
          fromToken: fromToken, 
          fromTokenName: this.getTokenItem(fromToken).name, 
          toToken: toToken,
          fromTokenName: this.getTokenItem(toToken).name, 
          lpTokenAddr: lpAddress,
        });

        this.$router.push("/liquidity-remove");
      },

      addLiquidityInstead(fromToken, toToken, lpAddress) {
        this.SET_WORKING_TOKENS({
          fromToken: fromToken, 
          fromTokenName: this.getTokenItem(fromToken).name, 
          toToken: toToken,
          fromTokenName: this.getTokenItem(toToken).name, 
          lpTokenAddr: lpAddress,
        });
        
        this.$router.push("/liquidity-add");
      },

      importPool() {
        this.SET_WORKING_TOKENS({
          fromToken: 1, 
          fromTokenName: this.getTokenItem(1).name, 
          toToken: 0,
          fromTokenName: this.getTokenItem(0).name, 
          lpTokenAddr: "0x0000000000000000000000000000000000000000",
        });

        this.$router.push("/liquidity-import-pool");
      },

      getTokenItem(id) {
        if(id){
          return this.tokenLists.find(item=>item.id===id)
        }else{
          return{}
        }
      },

      async findAllLPPairs() {
        this.$axios.setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')

        this.allLPPairs = await web3Service.findAllLPPairs();
        this.mineLPPairs = await liquidityShareToken.findAllMineLPPairs(this.allLPPairs, this.getCurrentAddr, this.$axios, this.params);

        if (this.mineLPPairs.length == 0) {
          this.existLP = false
        }
        else {
          this.existLP = true
        }
      },
    },

    watch: {
      getIsConnected(val) {
        if(val) {
          this.findAllLPPairs();
          this.addBtn = "+ Add Liquidity"
        }
        else {
          this.addBtn = "Connect wallet"
        }
      }
    },
  }
</script>

<style lang="scss" scope>
  .txt-gray {
    text-align: center; 
    color: gray;
    font-size: 12px;
  }
  .lp-button {
    font-size: 12px !important;
    border: thin solid #FFC473 !important;
  }
  .align-center {
    text-align: center; 
  }
  .lp-row {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .lp-row>div{
    margin-right: 10px
  }
  .lp-row>div:last-child{
    margin-right: 0px
  }
  .v-expansion-panel-content__wrap {
    padding-bottom: 0;
  }
  .font-120 {
    font-size: 120%;
  }
</style>
