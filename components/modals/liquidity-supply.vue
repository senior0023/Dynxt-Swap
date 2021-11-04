<template>
  <v-card class="cream-br-2 rounded-lg">
    <v-card-title class="justify-space-between" style="background-color: gray">
      You will receive
      <v-btn @click="$emit('close')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="mt-4">
      <v-row class="text-center mt-2 mb-0 px-5">
        <v-col cols="12" class="px-0" style="text-align: left">
          <h1 class="confirm-title align-left mr-4">{{lpTokens}}</h1>
          <v-img :src="getTokenItem(fromToken).image"
                  contain
                  height="25px"
                  width="25px" class="my-auto mr-1 align-left"></v-img>
          <v-img :src="getTokenItem(toToken).image"
                  contain
                  height="25px"
                  width="25px" class="my-auto align-left"></v-img>
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 mb-2 px-5">
        <v-col cols="12" class="px-0">
          <h3 class="align-left">{{ getTokenItem(fromToken).name }} / {{ getTokenItem(toToken).name }} Pool Tokens</h3>
        </v-col>
      </v-row>   
      <v-row class="text-center mt-4 mb-2 px-5">
        <v-col cols="12" class="px-0">
          <span>Output is estimated. If the price changes by more than {{getTolerance}}% your transaction will revert.</span>
        </v-col>
      </v-row>          
      <v-row class="text-center mt-4 px-5">
        <v-col cols="5" class="px-0" style="text-align: left">
          <span class="font-120">{{ getTokenItem(fromToken).name }} Deposited</span>
        </v-col>
        <v-col cols="7" class="px-0" style="text-align: right">
          <span class="align-right font-120">{{ fromAmount }}</span>
          <v-img :src="getTokenItem(fromToken).image"
                  contain
                  height="20px"
                  width="20px" 
                  class="my-auto mr-2 align-right" />
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 px-5">
        <v-col cols="5" class="px-0" style="text-align: left">
          <span class="font-120">{{ getTokenItem(toToken).name }} Deposited</span>
        </v-col>
        <v-col cols="7" class="px-0">
          <span class="align-right font-120">{{ toAmount }}</span>
          <v-img :src="getTokenItem(toToken).image"
                  contain
                  height="20px"
                  width="20px" 
                  class="my-auto mr-2 align-right" />
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 px-5">
        <v-col cols="3" class="px-0" style="text-align: left">
          <span class="font-120">Rates</span>
        </v-col>
        <v-col cols="9" class="px-0">
          <span class="align-right font-120">1 {{ getTokenItem(fromToken).name }} = {{ rateBNBToDYNXT }} {{ getTokenItem(toToken).name }}</span>
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 px-5">
        <v-col cols="3" class="px-0" style="text-align: left">
        </v-col>
        <v-col cols="9" class="px-0">
          <span class="align-right font-120">1 {{ getTokenItem(toToken).name }} = {{ rateDYNXTToBNB }} {{ getTokenItem(fromToken).name }}</span>
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 px-5">
        <v-col cols="3" class="px-0" style="text-align: left">
          <span class="align-left font-120">Share of Pool:</span>
        </v-col>
        <v-col cols="9" class="px-0">
          <span class="align-right font-120">{{shareOfPool}}%</span>
        </v-col>
      </v-row>
      <v-btn class="rounded-lg py-7 px-4 mt-6" color="cream" @click="$emit('supply')">Confirm Supply</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.css'

  export default {
    name: "liquidity-supply",
    props: ["lpTokens", "fromToken", "toToken", "getTokenItem", "rateBNBToDYNXT", "rateDYNXTToBNB", 
            "shareOfPool", "getTolerance", "fromAmount", "toAmount"],
    data(){
      return{}
    },
    methods: {
      
    },
  }
</script>

<style scoped>

</style>
