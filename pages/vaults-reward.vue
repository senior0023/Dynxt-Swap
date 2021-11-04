<template>
  <div class="pl-md-70" style="min-height: 100vh">
    <v-row
      class="fill-height ma-0"
    >
      <v-col md="6" cols="12"
             class="fill-height black pa-md-12 text-center"
             style="min-height: 100vh"
      >
        <div class="mt-12 mb-md-7 mb-3 text-h4 text-md-h3 font-weight-bold cream-first">
          Your reward in Vault
        </div>
        <!-- <div
          v-html="$md.render('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam at beatae deleniti dolore est et id illum ipsum mollitia necessitatibus, quibusdam quos repudiandae saepe sapiente, sequi sit unde? Obcaecati, quidem!')"
          class="grey--text mb-5"></div> -->
        <div class="mb-3"></div>
        <div class="mt-12 mb-md-7 mb-3 text-h3 text-md-h1 font-weight-bold cream--text">
          {{currentReward}}
        </div>
        <v-form class="my-12">
          <!--
          <div class="d-flex align-end grey--text my-7 justify-center">
            <span class="text-h4 font-weight-bold mx-2">161</span>
            <span class="text-h5  px-2 hr">days
            </span>

            <span class="text-h4 font-weight-bold mx-2">10</span>
            <span class="text-h5  px-2 grey--text hr">hours</span>
            <span class="text-h4 font-weight-bold mx-2">33</span>
            <span class="text-h5  px-2 grey--text hr">minutes</span>
            <span class="text-h4 font-weight-bold mx-2">34</span>
            <span class="text-h5  px-2 grey--text">seconds</span>
          </div> -->
          <div class="pt-12 pb-7 text-center">
            <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg" x-large enable dark @click="harvest">
              <v-icon>mdi-lock</v-icon>
              <span class="ml-3 font-weight-bold" v-if="isCompound">Compound Your Reward</span>
              <span class="ml-3 font-weight-bold" v-else>Claim Your Reward</span>
            </v-btn>
          </div>
        </v-form>

      </v-col>
      <v-col md="6" cols="12"
             style="min-height: 100vh"
             class="fill-height text-center pt-12 flex-column d-flex justify-center vault-background">
      </v-col>
    </v-row>
  </div>
</template>

<script>
    import web3Service from "../web3"

    export default {
        name: "vaults-reward",
        data() {
            return {
                currentReward: 0,
                isCompound: false,
            }
        },
        mounted: function(){
          if(web3Service.currentVault < 1){
            this.$router.push("/vaults");
          }
          console.log("web3Service")
          this.update();
        },

        methods: {
          update(){
            this.currentReward = (web3Service.currentPendingReward/1e18).toFixed(0);
            this.isCompound = web3Service.userCompound;
          },
          harvest(){
            if(web3Service.currentIndex >= 0)
              web3Service.harvest(web3Service.currentVault, web3Service.currentIndex);
          }
        }
    }
</script>

<style scoped>
  .hr {
    border-right: 1px solid grey;
  }
  .vault-background {
    background: url("~/assets/images/VaultBG.png");
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: cover;
  }
</style>
