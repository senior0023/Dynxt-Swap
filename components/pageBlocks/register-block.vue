<template>
  <div style="min-height: 100vh;" class="d-flex dust">
    <v-container class="ma-auto pt-12">
      <div class="text-h4 text-center mb-12">{{info.sectionTitle}}</div>
      <v-card color="black" max-width="600px" class="mx-auto rounded-xl cream-bx-2" :loading="loading">
        <v-card-text class="pa-3 pa-md-12">
          <div class="text-h4 text-center white--text">{{info.title}}</div>
          <div class="text-center">
            {{info.subtitle}}
          </div>

          <v-form class="mt-7" ref="form">
            <v-row>
              <v-col sm="6" cols="12">
                <v-text-field outlined
                              label="Name"
                              color="cream"
                              dense
                              required
                              class="rounded-lg"
                              :rules="rules.requiredRules"
                              v-model="form.name">
                </v-text-field>
              </v-col>
              <v-col sm="6" cols="12">
                <v-text-field outlined
                              label="Discord"
                              color="cream"
                              dense
                              required
                              class="rounded-lg"
                              :rules="rules.requiredRules"
                              v-model="form.discord">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field outlined
                              label="Wallet Address"
                              color="cream"
                              dense
                              required
                              class="rounded-lg"
                              :rules="rules.requiredRules"
                              v-model="form.wallet">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field outlined
                              label="Email Address"
                              color="cream"
                              dense
                              type="email"
                              class="rounded-lg"
                              :rules="rules.emailRules"
                              v-model="form.email"
                              required
                >

                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="cream" rounded block @click="subscribe">Register</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      timeout="8000"
      @close="text=''"
      bottom right
      dark
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          small
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
    import $ from 'jquery';

    const qs = require('qs');

    export default {
        name: "register-block",
        data() {
            return {
                form: {},
                loading: false,
                snackbar: false,
                text: '',
                rules: {
                    requiredRules: [v => !!v || 'This field is required'],
                    emailRules: [
                        v => !!v || 'E-mail is required',
                        v => /.+@.+/.test(v) || 'E-mail must be valid',
                    ],
                }
            }
        },
        props: {
            info: {
                type: Object,
                default: () => {
                }
            }
        },
        methods: {
            subscribe() {
                if (this.$refs.form.validate()) {
                    try {
                        this.loading = true;
                        $.ajax({
                            url: 'https://dynxt.us6.list-manage.com/subscribe/post-json?u=5234c2d9fd72c3b46a09f8391&id=a38f229d86&c=?',
                            crossDomain: true,
                            data: this.prepareRequestData(),
                            method: "GET",
                            dataType: 'json',
                            context: this,
                            contentType: 'application/json; charset=utf-8',
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                            },
                            success: (data) => {
                                this.loading = false;
                                if (data.result === "success") {
                                    this.$refs.form.reset();
                                    console.log(data.msg);
                                } else {
                                    // Error from Mail Chimp


                                }
                            }
                        }).done(function (result) {
                            this.text = result.msg.replace('0 - ', '');
                            this.snackbar = true
                        });
                    } catch (err) {
                        console.log(err);
                        this.loading = false;
                    }
                }
            },
            prepareRequestData() {
                let data = {
                    'EMAIL': this.form.email,
                    'NAME': this.form.name,
                    'DISCORD': this.form.discord,
                    'WALLET': this.form.wallet,
                };
                return qs.stringify(data);
            },
        }
    }
</script>

<style scoped>

</style>
