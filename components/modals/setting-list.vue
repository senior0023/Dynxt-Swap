<template>
  <v-card class="cream-br-2 rounded-lg">
    <v-card-title class="justify-space-between" style="background-color: gray">
      Settings
      <v-btn @click="$emit('close')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="mt-4">
      <!-- <v-radio-group v-model="radios" :mandatory="false">
        <v-radio label="Radio 1" value="radio-1"><v-chip class="px-7" @click="$emit('changeTolerant')">0.1%</v-chip></v-radio>
        <v-radio label="Radio 2" value="radio-2"><v-chip class="px-7" @click="$emit('changeTolerant')">0.1%</v-chip></v-radio>
      </v-radio-group> -->
      <!-- <v-text-field solo style="border-radius:  50px;background-color: white"></v-text-field> -->
      Slippage Tolerance 
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            mdi-help-circle-outline
          </v-icon>
        </template>
        <span>Setting a high slippage tolerance can <br>help transactions succeed, but you may <br>not get such a good price. <br>Use with caution.</span>
      </v-tooltip>
      <v-row class="text-center mt-2" style="text-align: center">
        <v-col cols="3" class="px-0">
          <v-chip :color="toleranceValue == toleranceValues[0]?'primary':''" class="px-md-7 mx-auto" @click="toleranceValue=toleranceValues[0]">{{toleranceValues[0]}}%</v-chip>
        </v-col>
        <v-col cols="3" class="px-0">
          <v-chip :color="toleranceValue == toleranceValues[1] ?'primary':''" class="px-md-7 mx-auto" @click="toleranceValue=toleranceValues[1]">{{toleranceValues[1]}}%</v-chip>
        </v-col>

        <v-col cols="3" class="px-0">
          <v-chip :color="toleranceValue == toleranceValues[2] ?'primary':''" class="px-md-7 mx-auto" @click="setToleranceValue(toleranceValues[2])">{{toleranceValues[2]}}%</v-chip>
        </v-col>
        <v-col cols="3" class="px-0">
          <v-chip class="px-md-7 mx-auto">
            <input
              class="roundedInput"
              type="number"
              v-model="customTolerance"
              @change="toleranceValue=customTolerance"
            >
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
    import '@fortawesome/fontawesome-free/css/all.css'

    export default {
        name: "setting-list",
        props:{
        },
        data(){
            return{
                toleranceValue: 12,
                customTolerance: 0,
                toleranceValues: [12, 13, 14]
            }
        },
        methods: {
          setToleranceValue(val) {
            this.toleranceValue = val
          }
        },
        watch: {
          toleranceValue(tol){
            this.$emit("change", tol);
          },
          customTolerance(tol){
            this.customTolerance = parseFloat(tol)
          }
        }
    }
</script>

<style scoped>
input[type=number]{
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
     border-radius: 20px;
     border: 1px solid #2d9fd9;
     color: #a0d18c;
     padding: auto;
    }
    
input[type=number]:focus {
     outline: none;
     border: 1px solid #a0d18c;
     color: #2d9fd9;
}
input[type=number] {
    -moz-appearance: textfield;
    color: #FFC473 !important;
    /* font-family: sitka banner; */
    font-size: large;
}
.roundedInput {
    border-radius: 30%;
    width: 50px;
    height: 150px;
    border-width: 0 !important;
}
</style>
