<template>
  <v-container v-if="info">
    <div class="my-12 text-h5 text-md-h3 cream-first">{{info.title}}</div>
    <v-row>
      <v-col xl="3" lg="4" sm="6" cols="12" v-for="(road,idx) in info.quaters" :key="idx">
        <div class="pl-7 mb-4">
          <span>{{road.title}}</span>
          <span class="cream--text">{{road.date}}</span>
        </div>
        <div class="step-box-2">
          <v-stepper
            vertical
            class="black"
            disabled
          >
            <template v-for="(step,idx) in road.list">
              <v-stepper-step
                :step="step.id"
                :key="'stepper-step-'+idx"
                error-icon="mdi-rhombus-outline"
                color="transparent"
                :complete="step.checked"
                :rules="[() => step.checked]"
                edit-icon="mdi-rhombus"
                editable
              >
                {{step.title}}
              </v-stepper-step>
              <v-stepper-content
                :step="step.id"
                :key="'stepper-content-'+idx"
                v-if="idx!==road.list.length-1"
                :class="{'complete':step.checked}"
              >
              </v-stepper-content>
            </template>
          </v-stepper>
        </div>
      </v-col>
      <v-col cols="12" v-if="info.actionButtons.length>0" class="text-center">
        <v-btn color="cream" :to="info.actionButtons[0].link">{{info.actionButtons[0].title}}</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
    export default {
        name: "task-stepper",
        props: {
            info: {
                type: Object,
                default: () => {
                }
            }
        }
    }
</script>

<style lang="scss">
  .step-box-2 {

    .v-stepper__step {
      padding: 12px 24px 4px !important;
      cursor: default!important;
      pointer-events: none!important;
    }

    .v-stepper__step__step {
      .v-icon {
        color: #FFC473 !important;
      }
    }

    .v-stepper__step--inactive {
      .v-stepper__step__step {
        color: transparent !important;
      }
    }

    .v-stepper__content {
      border-left: 1px solid gray !important;

      &.complete {
        border-left: 1px solid #FFC473 !important;
      }
    }

    .v-stepper__step--error.error--text {
      color: white !important;
    }

  }
</style>
