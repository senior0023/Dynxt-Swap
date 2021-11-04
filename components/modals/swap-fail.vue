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
      <v-icon class="mt-15 text-h1 mb-12" color="cream" aria-hidden="true">mdi-alert-circle-outline</v-icon>
      <div class="mb-5 cream--text text-h6">Transaction {{code === 4001?"rejected":"failed"}}</div>
      <div>{{errorMessage}}</div>
      <v-btn class="rounded-lg py-7 px-4 mt-10 mb-7" color="cream" @click="$emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
    import '@fortawesome/fontawesome-free/css/all.css'

    export default {
        name: "swap-success",
        props:
          ["getTokenItem", "errorMessage", "code"]
        ,
        data(){
            return{
            }
        },
        methods: {
          
        },
    }
</script>

<style scoped>

</style>
