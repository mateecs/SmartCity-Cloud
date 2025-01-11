<template>

  <div id="login">
    <b-container>
      <b-row class="text-center"><b-col>
        <img class="logo">
        <h2 class="text-center">TUC SmartCityCloud</h2>
      </b-col></b-row>
    </b-container>
    <b-container class="box" style="padding:20px 10px;background-color:rgba(255, 255, 255, 0.5);">
      <b-row><b-col class="text-center">
        <p class="text-center">Please provide your user credentials to login</p>
      </b-col></b-row>
      <b-row v-if=error_message><b-col class="text-center">
        <p class="text-red">{{error_message}}</p>
      </b-col></b-row>

      <b-row><b-col>
        <b-form @submit.prevent="checkCreds">
          <b-form-row> <b-col>
            <b-input-group>
              <template v-slot:prepend>
                <b-input-group-text><fa-icon icon="envelope"></fa-icon></b-input-group-text>
              </template>

              <b-form-input v-model="username" type="text" placeholder="Email address"></b-form-input>
            </b-input-group>
          </b-col></b-form-row>

          <b-form-row> <b-col>
            <b-input-group>
              <template v-slot:prepend>
                <b-input-group-text><fa-icon icon="lock"></fa-icon></b-input-group-text>
              </template>

              <b-form-input v-model="password" type="password" placeholder="Password"></b-form-input>
            </b-input-group>
          </b-col> </b-form-row>

          <b-form-row> <b-col class="text-center">
            <b-spinner v-if="isBusy" variant="primary" type="grow" />
            <b-button v-else type="submit" variant="primary" size="lg">Login</b-button>
          </b-col> </b-form-row>
        </b-form>
      </b-col></b-row>
      <b-row style="margin-top:10px">
        <b-col style="text-align:right">
          <router-link tag="a" class="pageLink" to="/imprint">
            Imprint
          </router-link>
          /
          <router-link tag="a" class="pageLink" to="/privacystatement">
            Data Privacy Statement
          </router-link>
        </b-col>
      </b-row>
    </b-container>
  </div>

</template>

<script>
import { RepositoryFactory } from '../repo/RepositoryFactory'
const UserRepository = RepositoryFactory.get('user')
import { useSessionStore } from 'src/stores/session'

export default {
  name: 'Login',
  data: () => {
    return {
      section: 'Login',
      loading: '',
      isBusy: false,
      username: '',
      password: '',
      error_message: ''
    }
  },
  methods: {
    async checkCreds () {
      const target = this.$route.query.redirect
      this.$router.push(target ?? '/dashboard')

    },
    toggleLoading () {
      this.isBusy = !this.isBusy
      this.loading = this.loading === '' ? 'loading' : ''
    },
    resetResponse () {
      this.error_message = ''
    }
  }
}
</script>

<style scoped>
/* make the login box smaller on large resolutions */
@media (min-width: 1200px) {
    .container{
        max-width: 600px;
    }
}

#login {
  padding: 10em;
  width: 100vw;
  height: 100vh;
  background: url('assets/img/login_bg.jpg');
  background-size: cover;
}

.logo {
  width: 15em;
  padding: 0.5em;
  content: url('assets/img/tuc_smartcitycloud_logo.png');
}
.input-group {
  padding-bottom: 1em;
}
.input-group-addon {
  display: flex;
  align-items: center;
  margin-top: 1px;
  height: calc(1.5em + .75rem);
  color: gray;
  padding: 0 5px;
}
.input-group-addon i {
  width: 32px;
}
</style>
