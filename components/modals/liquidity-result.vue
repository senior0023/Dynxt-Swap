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
      <v-row class="text-center mt-12 mb-0 px-5">
        <v-col cols="12" class="px-0 d-flex justify-center">
          <v-icon left class="result-up-icon"> mdi-arrow-up </v-icon>
        </v-col>
      </v-row>
      <v-row class="text-center mt-6 mb-2 px-5">
        <v-col cols="12" class="px-0">
          <h2>Transaction Submitted</h2>
        </v-col>
      </v-row>   
      <v-row class="text-center mt-0 mb-0 px-5">
        <v-col cols="12" class="px-0">
          <a :href="'https://bscscan.com/tx/' + supplyTransactionHash" target="_blank">View on BscScan</a>
        </v-col>
      </v-row>
      <v-row class="text-center mt-0 mb-0 px-5">
        <v-col cols="12" class="px-0">
          <v-btn class="rounded-lg py-7 px-4 mt-6" color="cream" @click="showResultDlg=false">Close</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.css'

  export default {
    name: "liquidity-result",
    props: ["supplyTransactionHash"],
    data(){
      return{}
    },
    methods: {
      
    },
  }
</script>

<style scoped>

</style>
