<template>
  <v-container v-if="info">
    <v-row align="center" class="suffle-row">
      <v-col cols="12" md="6" class="py-md-12 py-3">
        <div class="mt-12 mb-md-7 mb-3 text-h5 text-md-h3 cream-first">{{info.title}}</div>
        <div v-html="$md.render(info.content)" class="grey--text mb-5 break-word" v-if="info.content"></div>
      </v-col>
      <v-col cols="12" md="6">
        <v-img :src="$imgUrl(info.image.url)"
               min-height="300px"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    export default {
        name: "block-intro",
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
