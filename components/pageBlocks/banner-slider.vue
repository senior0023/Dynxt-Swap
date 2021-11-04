<template>
  <div style="position: relative;max-height: 100vh" v-if="info" id="home">
    <v-carousel
      v-model="slide"
      :height="$vuetify.breakpoint.mdAndUp?'100vh':'calc(100vh - 180px)'"
      style="width: 100%"
      hide-delimiter-background
      :show-arrows="false"
      hide-delimiters>
      <v-carousel-item
        v-for="(slide, i) in info.heroItems"
        :key="i"
        min-height="100vh">
        <v-row class="fill-height ma-0">
          <v-col md="6" cols="12"
                 class="d-flex flex-column justify-space-between h-carousel pa-0"
                 :class="{'hero-carousel':$vuetify.breakpoint.mdAndUp}">
            <div class="d-flex bg-image justify-center relative align-end mb-12 pt-0" style="flex:1">
              <v-img class="header-img" :src="$imgUrl(slide.image.url)"
                     :height="$vuetify.breakpoint.mdAndUp?'100vh':'50vh'"
                     cover>
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center">
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5">
                    </v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <!-- <v-img :src="require('~/assets/images/triangle.svg')" contain max-height="20vh"
                     class="mx-auto item-img"></v-img> -->
            </div>
            <div class="d-none d-md-block">
              <div class="d-flex justify-center mb-7 mt-12">
                <v-btn icon @click="prevSlide" class="mx-3" color="cream" x-large>
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-divider vertical class="gray"></v-divider>
                <v-btn icon @click="nextSlide" class="mx-3" color="cream" x-large>
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col md="6" cols="12" class="black fill-height pa-0 d-box">
            <v-card class="d-flex flex-column justify-space-between  transparent"
                    :class="{'fill-height':$vuetify.breakpoint.mdAndUp}"
                    :max-width="$vuetify.breakpoint.mdAndUp?'80%':'100%'"
                    flat>
              <v-card-text class="flex-1 d-flex">
                <v-container class="my-auto text-center-sm">
                  <div class="grey--text font-weight-bold">{{slide.date}}</div>
                  <div class="white--text text-md-h2 text-h6 font-weight-bold mb-5 mt-3">{{slide.title}}</div>
                  <div v-html="$md.render(slide.description)" class="normalClass" v-if="slide.description && i != 0"></div>
                  <div v-if="i==0" class="txt-cursor">Contract Address:</div>
                  <div v-if="i==0" class="txt-cursor">
                    0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396
                    <v-icon v-if="i==0" @click="copyAddress(i)" class="icon-cls">mdi-content-copy</v-icon>
                  </div>
                  <div class="mt-6" v-if="slide.actionButtons.length>0">
                    <v-btn color="cream" class="font-weight-bold"
                           tile
                           :href="slide.actionButtons[0].link"
                           v-if="slide.actionButtons[0].newTab">{{slide.actionButtons[0].title}}
                    </v-btn>
                    <v-btn color="cream" class="font-weight-bold"
                           tile
                           :to="slide.actionButtons[0].link"
                           v-else>{{slide.actionButtons[0].title}}
                    </v-btn>
                  </div>
                </v-container>
              </v-card-text>
              <div class="px-3 d-none d-md-block">
                <v-img :src="require('~/assets/images/dynxt-rocks.png')" style="opacity: 0.6" contain></v-img>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
    <div class="step-box">
      <v-stepper
        v-model="slide"
        :vertical="$vuetify.breakpoint.mdAndUp"
        tile
        class="black step-box-item">
        <v-divider v-if="$vuetify.breakpoint.smAndDown" class="complete"></v-divider>
        <v-stepper-content
          v-if="$vuetify.breakpoint.mdAndUp"
          :step="-1"
          class="complete">
        </v-stepper-content>

        <template v-for="(step,idx) in info.heroItems" @click="slide=idx">
          <v-stepper-step
            :step="idx"
            :key="'hero'+idx"
            complete-icon=""
            color="cream"
            :complete="slide >= idx"
            editable
            edit-icon="">
            <v-img :src="$imgUrl(step.icon.url)"
                   :width="$vuetify.breakpoint.mdAndUp?40:30"
                   :height="$vuetify.breakpoint.mdAndUp?40:30"></v-img>
          </v-stepper-step>
          <v-divider v-if="$vuetify.breakpoint.smAndDown"
                     :class="{'complete':checkComplete(slide,idx,info.heroItems.length)}"
                     :key="'herodivider'+idx">
          </v-divider>
          <v-stepper-content
            v-if="$vuetify.breakpoint.mdAndUp"
            :step="idx"
            :class="{'complete':checkComplete(slide,idx,info.heroItems.length)}"
            :key="'herostepper'+idx">
          </v-stepper-content>
        </template>
      </v-stepper>
    </div>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout">
      {{ copiedText }}
    </v-snackbar>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "banner-slider",
        props: {
            info: {
                type: Object,
                default: () => {
                }
            }
        },
        data() {
            return {
                slide: 0,
                normalClass: 'grey--text mb-5 break-word',
                snackbar: false,
                copiedText: 'Contract address copied on clipboard',
                timeout: 2000,
            }
        },
        computed: {
          ...mapGetters(["getCurrentAddr"]),
        },
        methods: {
            nextSlide() {
                if (this.slide < this.info.heroItems.length - 1) {
                    this.slide += 1
                } else {
                    this.slide = 0
                }
            },
            prevSlide() {
                if (this.slide > 0) {
                    this.slide = this.slide - 1
                } else {
                    this.slide = this.info.heroItems.length - 1
                }
            },
            checkComplete(slide, idx, length) {
                if (idx === length - 1 && slide === length - 1) {
                    return true
                } else return slide > idx;
            },
            copyAddress(pageIndex) {
              if (pageIndex == 0) {
                navigator.clipboard.writeText('0x9128D0a29c89d4Ed520A36f8A4154B0bc64b6396');
                this.snackbar = true;
              }
            }
        }
    }
</script>

<style lang="scss">
  .item-img {
    position: absolute !important;
    bottom: -9%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1 !important;
  }
  .header-img {
    z-index: 1;

    .v-image__image--cover {
      background-size: cover;
      z-index: 1;
    }
  }
  .icon-cls {
    font-size: 20px !important;
    color: #FFC473 !important;
    margin-left: 5px;
    cursor: pointer;
  }
  .txt-cursor {
    color: #FFC473 !important;
  }
  
  @media only screen and (max-width: 920px) {
    .header-img .v-image__image--cover {
      background-size: contain;
      z-index: 1;
    }
  }

</style>
