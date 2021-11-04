<template>
  <div class="black pl-md-70 pt-12" >
    <div class="white--text text-md-h2 text-h6 font-weight-bold mb-5 mt-12 text-center">
      Lock DYNXT tokens
    </div>
    <div class="grey--text pb-5 text-center">choose your vault</div>
    <div class="d-flex justify-center py-7 flex-wrap">
      <token-card lockid="1" v-bind:index="vault1Index" userCompoundStr="7 days"></token-card>
      <token-card lockid="2" v-bind:index="vault2Index" userCompoundStr="30 days"></token-card>
      <token-card lockid="3" v-bind:index="vault3Index" userCompoundStr="90 days"></token-card>
      <token-card lockid="4" v-bind:index="vault4Index" userCompoundStr="180 days"></token-card>
    </div>
  </div>
</template>

<script>
    import web3Service from "../web3";

    import TokenCard from "../components/cards/token-card";

    export default {
        name: "vaults",
        components: {TokenCard},
        data() {
            return {
                vault1Index: -1,
                vault2Index: -1,
                vault3Index: -1,
                vault4Index: -1,
            }
        },
        mounted: function(){
          this.update();
          this.intervalUpdate = setInterval(this.update, 5000);
        },
        beforeDestroy: function(){
          clearInterval(this.intervalUpdate);
        },

        methods: {
          update(){
            if(web3Service.currentAddr != null){ 
              this.vault1Index = parseInt(web3Service.vault1Index);
              this.vault2Index = parseInt(web3Service.vault2Index);
              this.vault3Index = parseInt(web3Service.vault3Index);
              this.vault4Index = parseInt(web3Service.vault4Index);
            }
          }
        }
    }
</script>

<style scoped>

</style>
