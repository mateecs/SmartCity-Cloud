<template>
  <li class="dropdown user user-menu">
    <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
      <!-- The user image in the navbar-->
      <div v-if="this.sessionStore.user != null">
        <img :src="user.avatar" class="user-image" alt="User Image">
        <!-- hidden-xs hides the username on small devices so only the image appears. -->
        <span class="hidden-xs">{{this.sessionStore.displayName}}</span>
      </div>
      <div v-else>
        <fa-icon icon="user" class="user-image" alt="Anonymous User" />
      </div>
    </a>
    <!-- Account Info and Menu -->
    <ul class="dropdown-menu">
      <div v-if="this.sessionStore.user != null">
        <li class="user-header" style="height:auto;padding-top:5px; padding-bottom:5px;border: 1px solid #ddd;">
          <div style="text-align: center;margin-bottom: 0">
            <span>{{this.sessionStore.displayName}}</span><br>
            <small>{{this.sessionStore.user}}</small>
          </div>
        </li>
        <li class="user-footer">
          <button class="btn btn-default btn-block btn-flat">
            <fa-icon icon="user-cog"></fa-icon>
            <span>Account Settings</span>
          </button>
        </li>
        <li class="user-footer">
          <button v-on:click="logout" class="btn btn-default btn-block btn-flat">
            <fa-icon icon="sign-out-alt"></fa-icon>
            <span>Logout</span>
          </button>
        </li>
      </div>
      <div v-else>
        <li class="user-header" style="height:auto;padding-bottom:55px;border: 1px solid #ddd;text-align:center;padding-top:5px;">
            <span style="color: white; margin-top:10px">You are not logged in</span>
        </li>
        <li class="user-footer">
          <button v-on:click="logout" class="btn btn-default btn-block btn-flat">
            <fa-icon icon="sign-in-alt"></fa-icon>
            <span style="margin-left:5px;">Login</span>
          </button>
        </li>
      </div>
    </ul>
  </li>
</template>

<script>
import UserRepository from 'repo/UserRepository'
import { useSessionStore } from 'src/stores/session'

export default {
  name: 'UserMenu',
  props: ['user'],
  data: () => {
    return {
      sessionStore: useSessionStore()
    }
  },
  methods: {
    async logout () {
      try {
        // inform server that we want to end our session
        await UserRepository.logout()
      } finally {
        // logout under all circumstances
        this.sessionStore.logout()
        this.$router.push('/login')
      }
    }
  }
}
</script>
