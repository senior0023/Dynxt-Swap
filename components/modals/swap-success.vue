<template>
  <v-card class="cream-br-2 rounded-lg">
    <v-card-title class="justify-space-between" style="background-color: gray">
      Confirm Swap
      <v-btn @click="$emit('close')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="mt-4 text-center">
      <v-icon class="mt-15 text-h1 mb-12">mdi-arrow-up</v-icon>
      <div class="mb-5 cream--text text-h6">Transaction Successed!</div>
      <a :href="'https://bscscan.com/tx/' + successTx" target="_blank" style="text-decoration: none;">View on BscScan</a><br>
      <v-btn
        v-if="getTokenItem(toToken).name!='BNB'"
        color="dark-grey"
        dark
        dense
        prominent
        class="mx-auto rounded-md pa-7 mt-7"
        style="width: fit-content"
        @click="addToWallet"
      >
        Add DYNXT to Wallet
      </v-btn><br>
      <v-btn class="rounded-lg py-7 px-4 mt-10 mb-7" color="cream" @click="$emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
    import '@fortawesome/fontawesome-free/css/all.css'

    export default {
        name: "swap-fail",
        props:
          ["getTokenItem", "fromToken", "toToken", "successTx"]
        ,
        data(){
            return{
            }
        },
        methods: {
          addToWallet() {
            this.$emit("addToken")
          }
        },
    }
</script>

<style scoped>

</style>
