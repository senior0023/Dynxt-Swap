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
          <h1 class="confirm-title align-left mr-4">{{vuetifyNumber(fromAmount)}}</h1>
          <h1 class="confirm-title align-right mr-4">{{getTokenItem(fromToken).name}}</h1>
          <v-img :src="getTokenItem(fromToken).image"
                  contain
                  height="25px"
                  width="25px" class="my-auto mr-1 align-right"></v-img>
        </v-col>
        <v-col cols="12">
            <v-icon color="cream" class="pr-4 component-right align-left">mdi-plus-thick</v-icon>
        </v-col>
        <v-col cols="12" class="px-0" style="text-align: left">
          <h1 class="confirm-title align-left mr-4">{{vuetifyNumber(toAmount)}}</h1>
          <h1 class="confirm-title align-right mr-4">{{getTokenItem(toToken).name}}</h1>
          <v-img :src="getTokenItem(toToken).image"
                  contain
                  height="25px"
                  width="25px" class="my-auto mr-1 align-right"></v-img>
        </v-col>
      </v-row>
      <v-row class="text-center mt-4 mb-2 px-5">
        <v-col cols="12" class="px-0">
          <span>Output is estimated. If the price changes by more than {{getTolerance}}% your transaction will revert.</span>
        </v-col>
      </v-row>          
      <v-row class="text-center mt-4 px-5">
        <v-col cols="5" class="px-0" style="text-align: left">
          <span class="font-120">{{ getTokenItem(fromToken).name }} / {{ getTokenItem(toToken).name }} Burned</span>
        </v-col>
        <v-col cols="7" class="px-0" style="text-align: right">
          <span class="align-right font-120">{{ lpTokens }}</span>
          <v-img :src="getTokenItem(toToken).image"
                  contain
                  height="20px"
                  width="20px" 
                  class="my-auto mr-2 align-right" />
          <v-img :src="getTokenItem(fromToken).image"
                  contain
                  height="20px"
                  width="20px" 
                  class="my-auto mr-2 align-right" />
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 px-5">
        <v-col cols="3" class="px-0" style="text-align: left">
          <span class="font-120">Price</span>
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
      <v-btn class="rounded-lg py-7 px-4 mt-6" color="cream" @click="$emit('remove')">Confirm</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.css'

  export default {
    name: "liquidity-removing",
    props: ["lpTokens", "fromToken", "toToken", "getTokenItem", "rateBNBToDYNXT", "rateDYNXTToBNB", 
            "fromAmount", "toAmount", "vuetifyNumber", "getTolerance"],
    data(){
      return{}
    },
    methods: {
      
    },
  }
</script>

<style scoped>

</style>
