<template>
  <v-card class="cream-br-2 rounded-lg">
    <v-card-title class="justify-space-between">
      Select A token
      <v-btn @click="$emit('close')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-radio-group v-model="selectedToken" class="radio-none" @change="$emit('change',selectedToken)">
        <v-radio :value="item.id" v-for="(item,idx) in tokenLists" :key="idx">
          <template v-slot:label>
            <div class="d-flex">
              <v-img :src="item.image"
                      contain
                      height="30px"
                      width="30px" class="my-auto mr-2"></v-img>
              <span :class="{'cream--text':token===item.id}">
                {{item.name}}<br><small>{{item.sub_name}}</small>
              </span>

            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "token-list",
        props:{
            tokenLists:{
                type:Array,
                default:()=>[]
            },
            token:{
                type:[String,Number],
                default:()=>[]
            }
        },
        data(){
            return{
                selectedToken:this.token
            }
        }
    }
</script>

<style scoped>

</style>
