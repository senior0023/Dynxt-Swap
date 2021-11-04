<template>
  <v-container v-if="info">
    <div class="my-12 text-h5 text-md-h3 cream-first">{{info.title}}</div>
    <v-row>
      <v-col cols="6" sm="4" md="3" v-for="(member,idx) in info.teamMembers" :key="idx">
        <v-card max-width="100%" min-height="150px"
                class="cream-br-2 pa-0   mx-auto d-flex justify-space-between flex-column" height="100%">
          <v-img :src="$imgUrl(member.image.url)" contain >
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
            <div class="text-center text-subtitle-6 mt-2 member-name font-weight-bold">{{member.name}}<br />
            <span class="font-weight-light">{{member.title}}</span>
            </div>
          </v-img>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    export default {
        name: "team-member",
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
  .member-name {
    position: absolute;
    bottom: 0;
    left: 50%;
    background: #00000021;
    transform: translateX(-50%);
    width: 100%;
  }
  .member-function{
    opacity: 0.6;
  }
</style>
