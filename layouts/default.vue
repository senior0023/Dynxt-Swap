<template>
  <v-app dark>
    <app-header></app-header>
    <div>
      <Nuxt/>
    </div>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import AppFooter from '~/components/general/app-footer.vue';
import AppHeader from "~/components/general/app-header.vue";

    export default {
        components: {AppHeader, AppFooter},
        data() {
            return {

            }
        },

    }
</script>

