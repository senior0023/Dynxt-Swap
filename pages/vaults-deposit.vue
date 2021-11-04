<template>
  <div class="pl-md-70" style="min-height: 100vh">
    <v-row class="fill-height ma-0">
      <v-col md="6" cols="12"
             class="fill-height black pa-md-12"
             style="min-height: 100vh">
        <div class="mt-12 mb-md-7 mb-3 text-h5 text-md-h3 cream-first font-weight-bold">
          {{vaultName}}
        </div>
        <!-- <div
          v-html="$md.render('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam at beatae deleniti dolore est et id illum ipsum mollitia necessitatibus, quibusdam quos repudiandae saepe sapiente, sequi sit unde? Obcaecati, quidem!')"
          class="grey--text mb-5"></div> -->
        <div class="mb-3">&nbsp;</div>
        <v-form class="my-7">
          <v-text-field outlined label="Amount To Invest" class="rounded-lg"
                        :disabled="!avaiableToDeposit"
                        color="cream"
                        type="number"
                        v-model="currentStake">
            <template v-slot:append>
              <div class="d-flex align-center">
                <v-img src="https://admin.dynxt.com/uploads/Satoshi_Timeline_9587903ce2.png"
                       contain
                       height="30px"
                       width="30px" class="my-auto mr-2"></v-img>
                DYNXT
              </div>
            </template>
          </v-text-field>
          <v-text-field outlined label="Term" class="rounded-lg"
                        color="cream"
                        disabled
                        v-model="selectedTerm">
          </v-text-field>                    
          <div class="d-flex align-end grey--text my-7">
            <span class="text-h4 font-weight-bold mx-2">{{day}}</span>
            <span class="text-h5  px-2 hr">d
            </span>

            <span class="text-h4 font-weight-bold mx-2">{{hour}}</span>
            <span class="text-h5  px-2 grey--text hr">h</span>
            <span class="text-h4 font-weight-bold mx-2">{{min}}</span>
            <span class="text-h5  px-2 grey--text hr">m</span>
            <span class="text-h4 font-weight-bold mx-2">0</span>
            <span class="text-h5  px-2 grey--text">s</span>
          </div> 
          <div class="pt-12 pb-7 text-center" v-if="avaiableToDeposit">
            <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg" x-large v-if="isApprovalRequired" @click="approve">
              <span class="ml-3 font-weight-bold">Approve DYNXT</span>
            </v-btn>

            <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg" x-large v-else @click="confirmDeposit">
              <span class="ml-3 font-weight-bold">Deposit DYNXT</span>
            </v-btn>
            <br>
          </div>
          <div class="pt-12 pb-7 text-center" v-if="!avaiableToDeposit">
            <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg" x-large :disabled="!currentCanWithdraw" :style="!currentCanWithdraw && 'background-color: #a17c49 !important'" @click="withdraw">
              <v-icon>mdi-lock</v-icon>
              <span class="ml-3 font-weight-bold" >Claim Your Vault</span>
            </v-btn>
            <!-- <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg" x-large @click="withdraw" :disabled="!currentCanWithdraw">
              <span class="ml-3 font-weight-bold">Claim tokens</span>
            </v-btn> -->
          </div>
        </v-form>
      </v-col>
      <v-col md="6" cols="12"
             style="min-height: 100vh;"
             class="fill-height text-center pt-12 flex-column d-flex justify-space-between vault-background">
        <div>
          <div class="mb-md-7 mb-3 text-h4 text-md-h3 font-weight-bold white--text" style="margin-top:400px;">
            Your reward in Vault
          </div>
          <div class="mt-12 mb-md-7 mb-3 text-h3 text-md-h1 font-weight-bold cream--text">
            {{currentPendingReward}}
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="showDeposite" max-width="500" content-class="md-70">
      <div class="mx-auto rounded-xl cream-bx-2 black-background">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="12">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text text-center">DEPOSIT</div>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-3 pa-md-7 text-center">
          <v-form class="mt-0" ref="form">
            <v-row>
              <v-col cols="12" style="padding: 0;" class="pb-4">
                <div class="grey--text text-center">
                  <span class="sub-title">Your tokens will be locked in the vault for the remainder of the term.</span><br/>
                  <span class="sub-title">Once your vault matures you can withdraw your rewards and unlock your investment.</span>
                </div>
              </v-col>
              <v-col cols="12" style="padding: 0;">
                <p class="white--text text-center">Tokens inserted in the vault</p>
              </v-col>
              <v-col cols="12" style="padding: 0;" class="pb-4">
                <p class="text-h3 cream--text text-center font-weight-bold">{{formatDepositeAmount(currentStake)}}</p>
              </v-col>
              <v-col cols="12" style="padding: 0;" class="pb-4">
              <v-card color="black px-15">
                <!--
                <v-row>
                <v-col cols="6" class="py-0"></v-col>
                <v-col cols="6" class="py-0">
                  <v-switch
                    v-model="isCompound"
                    @change="setCompound"
                    :false-value="false" :true-value="true"
                    color="cream"
                    value="red"
                    class="v-input--reverse">
                      <template #label>
                        <small style="font-size:70%">Auto-reinvest tokens</small>
                      </template>
                  </v-switch>
                </v-col>
                </v-row>
                -->
                <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg" style="width: 100%" x-large @click="deposit">
                  <span class="ml-3 font-weight-bold">Confirm</span>
                </v-btn>
              </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
    </v-dialog>

    <v-dialog v-model="showReinvest" max-width="500" content-class="md-70">
      <div class="mx-auto rounded-xl cream-bx-2 black-background">
        <v-card-title style="border-bottom: #58473E solid 1px">
          <v-row>
            <v-col cols="12">
              <div class="px-md-7">
                <div class="text-h5 card-title white--text text-center">CLAIM TOKENS</div>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-3 pa-md-7 text-center">
          <v-form class="mt-0" ref="form">
            <v-row>
              <v-col cols="12" style="padding: 0;" class="pb-4">
                <!--
                <div class="grey--text text-center">
                  <span class="sub-title">Claim your rewards or have option to reinvest all of your tokens to start</span><br/>
                  <span class="sub-title">Compounding your interest</span>
                </div>
                -->
              </v-col>
              <v-col cols="12" style="padding: 0;">
                <p class="white--text text-center">Tokens to be claimed</p>
              </v-col>
              <v-col cols="12" style="padding: 0;" class="pb-4">
                <p class="text-h3 cream--text text-center font-weight-bold">{{formatDepositeAmount(currentStake)}}</p>
              </v-col>
              <v-col cols="12" style="padding: 0;" class="pb-4 mt-5">
                <v-card color="black px-15">
                  <!-- <v-row>
                    <v-col md="6" class="py-0 mt-1">
                      <v-btn class="rounded-lg py-2 lp-button" style="width:160px;" @click="claimRewards"><small>Claim rewards</small></v-btn>  
                    </v-col>
                    <v-col md="6" class="py-0 mt-1">
                      <v-btn class="rounded-lg py-2 lp-button" style="width:160px;" @click="reinvestAllTokens"><small>Reinvest all tokens</small></v-btn>
                    </v-col>
                  </v-row> -->
                  <v-btn color="cream" light class="text-none my-3 px-3 rounded-lg mt-6" style="width: 100%" x-large @click="claimAllTokens">
                    <span class="ml-3 font-weight-bold">Claim all tokens</span>
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
    </v-dialog>
  </div>
</template>

<script>
    import web3Service from "../web3"
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "vaults-deposit",
        data() {
            return {
                terms: [
                  {text: 'Term 1: Lock 7days, min 10M, 0.5%'},
                  {text: 'Term 2: Lock 30days, min 100M, 3%'},
                  {text: 'Term 3: Lock 90days, min 1B, 10%'},
                  {text: 'Term 4: Lock 180days, min 10B, 22%'},

                ],
                selectedTerm: 'Term 1: Lock 7days, min 10M, 0.5%',

                isApprovalRequired: true,
                isCompound: false,

                vaultName: "Vault",

                avaiableToDeposit: true,

                day: 0,
                hour: 0,
                min: 0,
                second: 0,

                currentCanWithdraw: false,
                currentWithdrawAt: 0,
                currentPendingReward: 0,
                currentStake: 0,

                showDeposite: false,
                showReinvest: false
            }
        },
        beforeDestroy: function(){
          clearInterval(this.intervalUpdate);
        },
        mounted: function(){
          if(web3Service.currentVault < 1){
            this.$router.push("/vaults");
          }

          if(web3Service.currentVault == 1){
            this.selectedTerm = 'Term 1: Lock 7days, min 10M, 0.5%';
          }else if(web3Service.currentVault == 2){
            this.selectedTerm = 'Term 2: Lock 30days, min 100M, 3%';
          }else if(web3Service.currentVault == 3){
            this.selectedTerm = 'Term 3: Lock 90days, min 1B, 10%';
          }else if(web3Service.currentVault == 4){
            this.selectedTerm = 'Term 4: Lock 180days, min 10B, 22%';
          }

          this.vaultName = "Vault " + web3Service.currentVault;
          this.update();
          this.intervalUpdate = setInterval(this.update, 5000);
        },

        methods: {
          update(){
            if(web3Service.currentAddr != null && web3Service.currNetworkID == web3Service.NETWORK){
              this.isApprovalRequired = web3Service.isApprovalRequired,
              //his.currentReward = web3Service.pendingReward;
              this.isCompound = web3Service.userCompound;
            }

            if(web3Service.currentIndex == -1){
              this.avaiableToDeposit =  true;
              web3Service.currentPendingReward = 0;
              if(web3Service.currentVault == 1){
                this.day = 7;
                this.hour = 0;
                this.min = 0;
                this.second = 0;
              }else if(web3Service.currentVault == 2){
                this.day = 30;
                this.hour = 0;
                this.min = 0;
                this.second = 0;
              }else if(web3Service.currentVault == 3){
                this.day = 90;
                this.hour = 0;
                this.min = 0;
                this.second = 0;
              }else if(web3Service.currentVault == 4){
                this.day = 180;
                this.hour = 0;
                this.min = 0;
                this.second = 0;
              }
            }else {
              this.avaiableToDeposit =  false;

              web3Service.getUserInfo(web3Service.currentAddr, web3Service.currentIndex, web3Service.currentVault);
              web3Service.rewardOf(web3Service.currentAddr, web3Service.currentVault, web3Service.currentIndex)

              this.currentCanWithdraw = web3Service.currentCanWithdraw;
              this.currentWithdrawAt = web3Service.currentWithdrawAt;
              this.currentPendingReward = (web3Service.currentPendingReward/ 1e18).toFixed(0);
              this.currentStake =  web3Service.currentStake/ 1e18;

              if(this.currentWithdrawAt > 0 && this.currentCanWithdraw == false){
                var now = (new Date().getTime() / 1000).toFixed(0); 
                console.log("Now: " + now)
                var timeDiff = this.currentWithdrawAt - now;
                console.log("WithdrawAt: " + timeDiff)

                this.day = this.divide(timeDiff, ( 24 * 60 * 60));
                this.hour = this.divide((timeDiff - this.day * 24 * 60 * 60), ( 60 * 60));
                this.min = this.divide((timeDiff - this.day * 24 * 60 * 60 - this.hour * 60 * 60), (60));

                this.second = timeDiff - this.day * 24 * 60 * 60 - this.hour * 60 * 60 - this.min * 60;
              }else if (this.currentCanWithdraw == true){
                this.day = 0;
                this.hour = 0;
                this.min = 0;
                this.second = 0;
              }
            }
          
          },
          setCompound() {
            web3Service.changeUserCompound();
          },

          approve() {
            web3Service.approveToken();
          },
          deposit() {
            web3Service.deposit(this.currentStake, web3Service.currentVault);
            this.showDeposite = false;
          },
          confirmDeposit() {
            if (this.currentStake > 0) {
              this.showDeposite = true;
            }
            else {
              alert("Deposit amount should be more than zero.");
            }
          },
          withdraw() {
            this.showReinvest = true;
          },
          harvest(){
            if(web3Service.currentIndex >= 0)
              web3Service.harvest(web3Service.currentVault, web3Service.currentIndex);
          },
          formatDepositeAmount(amount) {
            var dividerAmount = amount;
            let strAmount = "";
            let modVal = 0;
            if (amount > 0) {
              let i = 0;
              while (dividerAmount > 0) {
                if (i > 0) {
                  strAmount = ',' + strAmount;
                }

                if (dividerAmount < 1000) {
                  strAmount = dividerAmount + strAmount;
                  break;
                } else {
                  modVal = dividerAmount % 1000;

                  strAmount = this.stringifyNumber(modVal) + strAmount;
                  dividerAmount = Math.trunc(dividerAmount / 1000);
                  i++;
                }
              }
            }

            return strAmount;
          },
          stringifyNumber(num) {
            if (num === 0) {
              return "000";
            }
            else {
              if (num.length == 1) {
                return "00" + num;
              } else if (num.length == 2) {
                return "0" + num;
              } else {
                return "" + num;
              }
            }
          },

          claimAllTokens() {
            alert("claimAllTokens");
            web3Service.withdraw(web3Service.currentVault, web3Service.currentIndex);
            this.showReinvest = false;
          },
          reinvestAllTokens() {
            alert("reinvestAllTokens");
            this.deposit();
          },
          claimRewards() {
            alert("claimRewards");
            this.harvest();
          },          

          divide(a, b) {
            return (a - a%b)/b;
          }
        },
        computed: {
            ...mapGetters(["getIsConnected"]),
        }
    }
</script>

<style lang="scss" scoped>
  .hr {
    border-right: 1px solid grey;
  }
  .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #f5f5f5 !important;
  }
  .vault-background {
    background: url("~/assets/images/VaultBG.png");
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: cover;
  }
  .v-text-field__slot{
    flex: 1 9 auto !important;
    input{
      margin-top: 1.5rem;
      min-height: 1.2rem;
      padding-left: .7rem !important;
      padding-right: 1rem !important;
    }
  }

  .black-background {
    background-color: black;
  }
  .text-center {
    text-align: center;
  }
  .v-input--reverse .v-input__slot {
    flex-direction: row-reverse !important;
    justify-content: flex-end !important;
  }
  .lp-button {
    font-size: 12px !important;
    border: thin solid #FFC473 !important;
  }
</style>
