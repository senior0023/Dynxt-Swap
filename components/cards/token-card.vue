<template>
  <v-card class="ma-3 rounded-lg" width="290px">
    <span class="cream font-weight-bold black--text px-2 py-1 badge rounded-lg">
      {{userCompoundStr}}
    </span>
    <v-img :src="require('~/assets/images/Vault.png')" height="150px" class="img-cls" contain></v-img>
    <v-card-text class="text-center">
      <div class="white--text text-h6 mt-3">{{vaultName}}</div>
      <div v-if="getIsConnected">
        <NuxtLink to="/vaults-deposit">
          <v-btn rounded color="cream" light class="text-none my-3 px-3" small @click="click">
            <v-icon small>mdi-lock</v-icon>
            <span class="ml-3 font-weight-bold">Enter Vault</span>
          </v-btn>
        </NuxtLink>
      </div>
      <div v-else>
        <v-btn rounded color="cream" light class="text-none my-3 px-3" small @click="connectWallet">
          <v-icon small>mdi-lock</v-icon>
          <span class="ml-3 font-weight-bold">Connect Wallet</span>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
    import web3Service from "../../web3"
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "token-card",
        props: {
            lockid: String,
            index: Number,
            userCompoundStr: String
        },
        data() {
            return {
                intervalUpdate: null,
                vaultName: "Vault",
                userCompound: "Manual",
            }
        },
        mounted: function(){
          this.vaultName = "Vault " + this.lockid;
          this.update();
          this.intervalUpdate = setInterval(this.update, 5000);
        },

        beforeDestroy: function(){
          clearInterval(this.intervalUpdate);
        },

        methods: {
          ...mapMutations(["SET_CONNECT_MODAL"]),

          update(){
            if(web3Service.userCompound == true){
              this.userCompound = "Automatic";
            }else {
              this.userCompound = "Manual";
            }
          },
          click(){
            console.log("Click-------");
            web3Service.currentVault = parseInt(this.lockid);
            web3Service.currentIndex = parseInt(this.index);
            console.log("Click-------" + this.lockid + " - " + this.index);
          },
          connectWallet() {
            if (!this.getIsConnected) {
              this.SET_CONNECT_MODAL()
            }
          }
        },
        computed: {
            ...mapGetters(["getIsConnected"]),
        }
    }
</script>

<style scoped>
  .badge {
    position: absolute;
    top: 20px;
    left: -10px;
  }
  .img-cls {
    margin-top: 20px;
  }
</style>
