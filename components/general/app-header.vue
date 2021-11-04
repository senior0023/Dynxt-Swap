<template>
  <div>
    <div class="d-none d-md-block">
      <v-navigation-drawer
        :mini-variant="miniVariant"
        :clipped="false"
        fixed
        temporary
        hide-overlay
        permanent
        color="secondary"
        floating
        class="menu-bar"
        mini-variant-width="70"
      >

        <v-list dense>
          <v-list-item style="margin-bottom: 40px">
            <v-list-item-action>
              <v-img :src="require('~/assets/images/menu.svg')"
                     @click="miniVariant=false"
                     max-width="30px"
                     max-height="30px"
                     contain
                     class="cursor-pointer"
                     v-if="miniVariant"></v-img>
              <v-img :src="require('~/assets/images/menu_close.svg')" @click="miniVariant=true"
                     v-else
                     max-width="30px"
                     max-height="30px"
                     class="cursor-pointer"
                     contain></v-img>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-for="(item, i) in nav_links"
            :key="i"
            :to="item.link"
            router
            exact
            height="60"
            active-class="primary--text active"
          >
            <v-list-item-action>
              <img :src="$imgUrl(item.icon.url)" class="nav-img" alt="" width="21px">
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" v-text="item.title"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="text-center pa-5">
            <v-btn @click="connectClick" color="cream" block tile v-if="!miniVariant">
              {{txtButtonText}}
            </v-btn>
            <v-btn @click="connectClick" color="cream" icon block v-else-if="miniVariant">
              <v-icon>mdi-wallet</v-icon>
            </v-btn>
          </div>
          <div>
            <v-btn color="cream" text class="mx-auto" block href="https://discord.com/invite/dynxt">
              <v-icon>mdi-discord</v-icon>
            </v-btn>
            <v-btn color="cream" text class="mx-auto" block href="https://t.me/dynastyXToken">
              <v-icon>mdi-telegram</v-icon>
            </v-btn>
            <v-btn color="cream" text class="mx-auto" block href="https://twitter.com/dynastyxproject/">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
          </div>

          <div class="mb-4 mt-7">
            <v-img :src="logo" height="40px"
                   contain
                   @click="$router.push({name:'index'})">

            </v-img>
          </div>
        </template>
      </v-navigation-drawer>
    </div>
    <div class="d-block d-md-none">
      <v-navigation-drawer
        v-model="menu"
        fixed
        app
        color="secondary"
        class="menu-bar"
      >

        <v-list dense>
          <v-list-item style="margin-bottom: 40px">
            <v-list-item-action>
              <v-img :src="require('~/assets/images/menu_close.svg')" @click="menu=false"
                     height="30px"
                     class="cursor-pointer"
                     contain>
              </v-img>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-for="(item, i) in nav_links"
            :key="i"
            :to="item.link"
            router
            exact
            height="60"
            active-class="primary--text active"
          >
            <v-list-item-action>
              <img :src="$imgUrl(item.icon.url)" class="nav-img" alt="" width="21px">
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold" v-text="item.title"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="text-center pa-5">
            <v-btn @click="connectClick" color="cream" block tile >
              {{txtButtonText}}
            </v-btn>
            <!-- <v-btn @click="connectModal=true" color="cream" icon block v-else-if="isNotConnected">
              <v-icon>mdi-wallet</v-icon>
            </v-btn> -->
            <!-- <v-btn color="cream" icon block v-else-if="miniVariant && !isNotConnected">
              <v-icon>mdi-wallet</v-icon>
            </v-btn> -->
          </div>
          <div>
            <v-btn color="cream" text class="mx-auto" block href="https://discord.com/invite/dynxt">
              <v-icon>mdi-discord</v-icon>
            </v-btn>
            <v-btn color="cream" text class="mx-auto" block href="https://twitter.com/dynastyxproject/">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
          </div>
          <div class="mt-7" style="margin-bottom: 80px">
            <v-img :src="logo" height="40px" contain @click="$router.push({name:'index'})"></v-img>
          </div>
        </template>
      </v-navigation-drawer>
    </div>
    <v-app-bar
      :clipped-left="false"
      flat
      color="transparent"
      v-if="logo"
      class="pl-md-70 mt-2 mt-md-5"
    >
      <div class="d-block d-md-none" style="position: absolute">
        <v-img :src="require('~/assets/images/menu.svg')"
               @click="menu=true"
               height="23px"
               contain
               class="cursor-pointer"
        ></v-img>
      </div>
      <!-- <div class="mx-auto" style="">
        <img :src="logo" height="50px" contain @click="$router.push({name:'index'})"/>
      </div> -->
      <v-row>
        <v-col cols="3" class="text-left" style="color: white; font-weight: 600;">
          <div class="d-none d-md-block">{{toPlainString(getRate).slice(0,20)}}</div>
          <div color="cream" class="d-none d-md-block" style="color: #FFC473 !important;">{{getTokenItem(1).name}} per {{getTokenItem(5).name}}</div>
        </v-col>
        <v-col cols="6" class="text-center" style="color: white; font-weight: 600;">
          <div class="mx-auto" style="">
            <img :src="logo" height="40px" contain @click="$router.push({name:'index'})"/>
          </div>
        </v-col>
        <v-col cols="3" class="text-right" style="color: white; font-weight: 600;">
          <div class="mx-auto" style="">
            <v-btn class="d-none d-md-inline-block rounded-lg py-3 py-md-3 px-4" color="cream" style="font-weight: 600;" @click="connectClick"><span>{{txtButtonText}}</span></v-btn>
            <!--
            <v-btn class="d-block d-md-none text-right" @click="connectModal=true" color="cream" icon block v-if="!getIsConnected">
              <v-icon>mdi-wallet</v-icon>
            </v-btn>
            <v-btn class="d-block d-md-none text-right" color="cream" icon block v-else>
              <v-icon>mdi-wallet</v-icon>
            </v-btn>
            -->
          </div>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-row class="d-flex d-md-none text-center pa-0 mx-auto mt-1 cream" style="width: 100vw;">
      <v-col cols="12" class="mx-auto pa-2 pt-0 pb-3" style="color: white; font-weight: 600;">
        <span class="black-text" style="color: black">{{toPlainString(getRate).slice(0,20)}}</span>
        <span class="text-gray" style="font-size: 0.7rem;color: gray">{{getTokenItem(1).name}} per {{getTokenItem(5).name}}</span>
      </v-col>
    </v-row>
    <v-dialog max-width="500" v-model="connectModal">
      <v-card class="cream-br-2 rounded-xl" >
        <v-card-text class="black pa-7">
          <div class="cream--text text-h6 font-weight-bold"> Connect to a wallet</div>
          <v-list rounded color="transparent">

            <v-list-item class="justify-space-between d-flex my-3 dust py-2" @click="connectMetamask">
              <v-list-item-content>
                <v-list-item-title class="cream--text text-h6 font-weight-bold">Metamask</v-list-item-title>
              </v-list-item-content>
              <div>
                <v-img :src="require('~/assets/images/metamask.png')" height="40px" width="40px"
                       contain></v-img>
              </div>
            </v-list-item>
            <v-list-item class="justify-space-between d-flex my-3 dust py-2" @click="connectTrust">
              <v-list-item-content>
                <v-list-item-title class="cream--text text-h6 font-weight-bold">Trust Wallet</v-list-item-title>
              </v-list-item-content>
              <div>
                <v-img :src="require('~/assets/images/trust.png')" height="40px" width="40px"
                       contain></v-img>
              </div>
            </v-list-item>
            <v-list-item class="justify-space-between d-flex my-3 dust py-2" @click="connectWalletConnect">
              <v-list-item-content>
                <v-list-item-title class="cream--text text-h6 font-weight-bold">WalletConnect</v-list-item-title>
              </v-list-item-content>
              <div>
                <v-img :src="require('~/assets/images/wlconnect.svg')" height="40px" width="40px"
                       contain></v-img>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import ConnectModal from "../modals/connect-modal.vue";
    import web3Service from "../../web3"
    import Web3 from 'web3';
    import WalletConnectProvider from "@walletconnect/web3-provider";
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'app-header',
        components: {ConnectModal},
        data() {
            return {
                menu: false,
                connectModal: false,
                miniVariant: true,

                isNotConnected: true,
                isWrongNetwork: true,
                intervalUpdate: null,
		            tokenLists: web3Service.tokenLists,
            }
        },
        mounted: async function(){
          await web3Service.init();
          if(window.localStorage.getItem("connectorId") == "injected")
            web3Service.Connect().then(res => this.connectResult());
          this.intervalUpdate = setInterval(this.update, 5000);

          this.getAppState()
          // if (window.ethereum) {
          //   this.web3 = new Web3(window.ethereum)
          //   window.ethereum.on("accountsChanged", accounts => {
              
          //     if (web3Service.currNetworkID == web3Service.NETWORK && accounts.length > 0 && accounts[0].length > 30) {
          //       this.SET_CURRENT_ADDR(accounts[0]);
          //       web3Service.currentAddr = accounts[0]
          //     }
          //     else {
          //       this.SET_CURRENT_ADDR("");
          //       web3Service.currentAddr = ""
          //     }
          //   });
          // }
          
          // await web3Service.runAPP()
          
          // window.ethereum.on('chainChanged', (chainId) => {
          //   this.currNetworkID = chainId
          //   if(chainId != web3Service.NETWORK) {
          //     this.SET_CURRENT_ADDR("");
          //     localStorage.removeItem("connectorId")
          //   }
          //   // window.location.reload();
          // });
        },

        beforeDestroy: function(){
          clearInterval(this.intervalUpdate);
        },

        methods: {
          ...mapMutations(["SET_CURRENT_ADDR", "SET_CONNECT_MODAL", "SET_RATE"]),
          update(){
            web3Service.update();
            this.getAppState();
          },
          getAppState() {
            web3Service.getAppState()
            .then(async res=>{
              // if(web3Service.lp_crypto_balance > 0){
              //   console.log("SET_RATE", web3Service.lp_bnb_balance/web3Service.lp_crypto_balance);
              //   this.SET_RATE(web3Service.lp_bnb_balance/web3Service.lp_crypto_balance);
              // }
              // else{
              //   this.SET_RATE(0);
              // }

              if(!res) return
              this.SET_RATE(parseFloat(res))
              /**GET BNB BALANCE OF LP */

              // const params = {
              //   chain: "bsc",
              // }
              // this.$axios
              // .setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
              // const bnb_lp_res = await this.$axios
              //   .$get('https://deep-index.moralis.io/api/v2/'+res+'/erc20', {
              //     params: params
              //   })
              // const res_item0 = bnb_lp_res.filter(val => {
              //   return val.token_address.toLowerCase() == web3Service.BNB_TOKEN_ADDRESS.toLowerCase()
              // })
              // console.log(res_item0);
              // if(res_item0.length) {
              //   this.lp_bnb_balance = parseInt(res_item0[0].balance)/this.tokenLists[0].decimals
              // }
              // else {
              //   this.lp_bnb_balance = 0
              // }

              // const params = {
              //   chain: "bsc",
              // }
              // this.$axios
              // .setHeader('X-API-Key', '7xA1dBDe9HpxOqfrJDGANjNkeBjLvh3BwyXsoAcxcM6rjOj1HM5fp0kMW7NdOkQl')
              // const bnb_lp_res = await this.$axios
              //   .$get('https://deep-index.moralis.io/api/v2/'+res+'/erc20', {
              //     params: params
              //   })
              // const res_item0 = bnb_lp_res.filter(val => {
              //   return val.token_address.toLowerCase() == web3Service.BNB_TOKEN_ADDRESS.toLowerCase()
              // })
              // console.log(res_item0);
              // if(res_item0.length) {
              //   this.lp_bnb_balance = parseInt(res_item0[0].balance)/this.tokenLists[0].decimals
              // }
              // else {
              //   this.lp_bnb_balance = 0
              // }

              // const params1 = {
              //   chain: "bsc",
              // }
              // /**GET BNB BALANCE OF LP */
              // const dynxt_lp_res = await this.$axios
              //   .$get('https://deep-index.moralis.io/api/v2/'+res+'/erc20', {
              //     params: params1
              //   })
              
              // const res_item = dynxt_lp_res.filter(val => {
              //   return val.token_address.toLowerCase() == web3Service.DYNXT_TOKEN_ADDRESS.toLowerCase()
              // })
              // console.log(res_item);
              // if(res_item.length) {
              //   this.lp_dynxt_balance = parseInt(res_item[0].balance)/this.tokenLists[4].decimals
              // }
              // else {
              //   this.lp_dynxt_balance = 0
              // }
              // console.log(this.lp_bnb_balance);
              // console.log(this.lp_dynxt_balance);
              // console.log(this.lp_bnb_balance > 0 && this.lp_dynxt_balance > 0);
              // if(this.lp_bnb_balance > 0 && this.lp_dynxt_balance > 0) {
              //   this.SET_RATE(this.lp_bnb_balance/this.lp_dynxt_balance)
              // }
            })
          },
          disConnect() {
            // web3Service.disConnect()
            this.SET_CURRENT_ADDR("")
            localStorage.removeItem('connectorId');

            var currentUrl = window.location.pathname;
            if (currentUrl == "/vaults-deposit" || currentUrl == "/vaults-reward") {
              this.$router.push("/vaults");
            }
          },
          toPlainString(num) {
            return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
              function(a,b,c,d,e) {
                return e < 0
                  ? b + '0.' + Array(1-e-c.length).join(0) + c + d
                  : b + c + d + Array(e-d.length+1).join(0);
              });
          },
          connectClick() {
            if(this.getIsConnected){
              this.disConnect()
            }
            else{
              this.SET_CONNECT_MODAL()
            }
          },
          connectMetamask(){
            this.connectModal = false;
            web3Service.connectMetamask()
            .then(res => this.connectResult())
          },
          connectTrust(){
            this.connectModal = false;
            web3Service.connectTrust()
            .then(res => this.connectResult());
          },
          connectWalletConnect(){
            this.connectModal = false;
            web3Service.connectWalletConnect()
            .then(res => this.connectResult());
          },
          connectResult() {
            console.log(web3Service.NETWORK);
            if(web3Service.currentAddr && web3Service.currNetworkID == web3Service.NETWORK) {
              this.SET_CURRENT_ADDR(web3Service.currentAddr);
              localStorage.setItem('connectorId', 'injected');
            }
          },
          getTokenItem(id){
            if(id){
              return this.tokenLists.find(item=>item.id===id)
            }else{
              return{}
            }
          },
        },

        computed: {
            ...mapGetters(["getIsConnected", "getCurrentAddr", "getConnectModalShow", "getRate"]),
            logo() {
                if (this.$store.getters.getSettings.header && this.$store.getters.getSettings.header.logo) {
                    return this.$imgUrl(this.$store.getters.getSettings.header.logo.url)
                } else {
                    return null
                }
            },
            nav_links() {
                if (this.$store.getters.getSettings.header) {
                    return this.$store.getters.getSettings.header.menuItems
                } else {
                    return []
                }
            },
            // rate() {
            //   if (this.lp_bnb_balance>0 && this.lp_crypto_balance>0) return this.lp_bnb_balance/this.lp_crypto_balance
            //   return 0.0000000008
            // },
            txtButtonText() {
              if(this.getIsConnected){
                  return this.getCurrentAddr.slice(0, 2) + "..." + this.getCurrentAddr.slice(-4) + " (Disconnect)"
              }
              else{
                  return "Connect Wallet"
              }
          }
        },
        watch: {
          getConnectModalShow(value) {
            this.connectModal = true
          }
        },
    }
</script>
<style lang="scss">
  .menu-bar {
    a.v-list-item.v-list-item--link.theme--dark {
      min-height: 60px;
    }
  }

</style>
