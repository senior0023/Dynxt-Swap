<template>
  <v-container v-if="info">
    <div class="mt-12 mb-md-7 mb-3 text-h5 text-md-h3 cream-first">{{info.title}}</div>
    <div v-html="$md.render(info.description)" class="grey--text mb-5 break-word" v-if="info.description"></div>
    <v-row class="my-12">
      <v-col cols="12" class="d-block d-md-none">
        <v-card height="100%" width="100%" class="d-flex" color="black">
          <v-img :src="$imgUrl(info.image.url)"
                 contain
                 class="ma-auto"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
      <v-col md="6" cols="12" class="pr-md-0 ">
        <div v-for="(usp,idx) in info.usp" :key="idx" class="my-3 d-flex align-center">
          <div>
            <div class="vault-icon">{{usp.number}}</div>
          </div>
          <div class="flex-1">
            <div class="text-h6 pl-3 py-2">{{usp.title}}</div>
            <v-divider class="cream-hr"></v-divider>
            <div class="grey--text pl-3 py-2">{{usp.date}}</div>
          </div>

        </div>
      </v-col>
      <v-col md="6" cols="12" class="pa-md-0 d-none d-md-block cream-br-2">
        <v-card  width="100%" class="black d-flex" height="100%">
          <v-img :src="$imgUrl(info.image.url)"

          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
    export default {
        name: "block-coin",
        props: {
            info: {
                type: Object,
                default: () => {
                }
            }
        },
    }
</script>

<style scoped>

</style>
