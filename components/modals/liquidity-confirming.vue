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
        <v-col cols="12" class="px-0 d-flex justify-center">
          <v-img :src="require('../../assets/images/confirming.gif')"
                  contain class="my-auto" />
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 mb-2 px-5">
        <v-col cols="12" class="px-0">
          <h3>Waiting For Confirmation</h3>
        </v-col>
      </v-row>   
      <v-row class="text-center mt-0 mb-0 px-5">
        <v-col cols="12" class="px-0">
          <span style="font-weight: bold"> {{prefix}} {{ fromAmount }} {{ getTokenItem(fromToken).name }} and {{ toAmount }} {{ getTokenItem(toToken).name }}</span>
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 px-5">
        <v-col cols="12" class="px-0">
          <span>Confirm this transaction in your wallet</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.css'

  export default {
    name: "liquidity-comfirming",
    props: ["fromToken", "toToken", "getTokenItem", "fromAmount", "toAmount", "prefix"],
    data(){
      return{}
    },
    methods: {
      
    },
  }
</script>

<style scoped>

</style>
