<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { useSessionStore } from 'src/stores/session'

export default {
  name: 'App',
  data () {
    return {
      section: 'Head'
    }
  },
  methods: {
    logout () {

      const sessionStore = useSessionStore()
      sessionStore.logout()

      this.$router.push('/login')
    }
  }
}
</script>
