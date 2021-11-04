<template>
  <div class="footer">
    <v-container>
      <v-img :src="require('~/assets/images/GateCoinPreview.jpg')"
             style="opacity: 0.6"
            contain></v-img>
      <div>
        <v-row>
          <template v-for="(comp,idx) in footer">
            <v-col md="3" cols="12" class="d-md-flex align-center d-none"
                   :key="idx"
                   v-if="comp.__component==='settings.logo'"
            >
              <v-img :src="logo" height="80px" contain @click="$router.push({name:'index'})"></v-img>
            </v-col>
            <v-col md="3" cols="12" :key="idx"
                   v-if="comp.__component==='settings.widget-menu'">
              <div class="text-h6 font-weight-bold pl-3">{{comp.title}}</div>

              <v-list color="black">
                <v-list-item v-for="(item,idx) in comp.menuItems" :key="'footer_'+idx" :href="item.link">
                    <v-list-item-content class="grey--text">
                      {{item.title}}
                    </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col md="3" cols="12" :key="idx"
                   v-if="comp.__component==='settings.widget-text'">
              <div class="text-h6 font-weight-bold pl-3">{{comp.title}}</div>
              <div class="grey--text mt-3 pl-3">
                {{comp.content}}
              </div>
            </v-col>
            <v-col md="3" cols="12" :key="idx"
                   v-if="comp.__component==='settings.widget-social'">
              <div class="text-h6 font-weight-bold pl-3">{{comp.title}}</div>
              <div class="d-flex mt-4">
                <v-btn icon class="my-2 mx-2" color="cream" :href="link.link"  target="_blank"
                       v-for="(link,idx) in comp.widgetSocials" :key="'social_'+idx">
                  <v-img :src="$imgUrl(link.icon.url)" v-if="link.icon" height="25px" width="25px" contain></v-img>
                </v-btn>
              </div>
            </v-col>
          </template>

        </v-row>
      </div>
    </v-container>
  </div>

</template>

<script>
    export default {
        name: "app-footer",
        computed: {
            footer() {
                if (this.$store.getters.getSettings) {
                    return this.$store.getters.getSettings.footerWidgets
                } else {
                    return null
                }
            },
            logo() {
                if (this.footer[0] && this.footer[0].image.url) {
                    return this.$imgUrl(this.footer[0].image.url)
                } else {
                    return null
                }
            },
        }
    }
</script>

<style scoped>
.footer{
  background: black;
}

</style>
