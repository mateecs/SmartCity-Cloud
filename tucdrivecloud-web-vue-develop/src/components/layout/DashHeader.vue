<template>
  <header class="main-header">
    <span class="logo-mini">
      <div class="logo img-responsive">
        <a href="/"><img src="@/assets/img/tuc_logo.png" alt="Logo" class="center-block img-fluid"></a>
      </div>
    </span>
    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
      <!-- Sidebar toggle button-->
      <a href="javascript:;" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <fa-icon icon="bars"></fa-icon>
        <span class="sr-only">Toggle navigation</span>
      </a>

      <!-- Navbar Right Menu -->
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!--<messages-menu></messages-menu>
          <notifications-menu></notifications-menu>
          <tasks-menu></tasks-menu>-->
          <user-menu :user="user"></user-menu>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'pinia'
import { useSessionStore } from 'src/stores/session'
/* import MessagesMenu from './MessagesMenu'
import NotificationsMenu from './NotificationsMenu'
import TasksMenu from './TasksMenu' */
import UserMenu from './UserMenu.vue'

export default {
  name: 'DashHeader',
  components: {
    /* MessagesMenu,
    NotificationsMenu,
    TasksMenu, */
    UserMenu
  },
  props: ['user'],
  computed: {
    ...mapState(useSessionStore, ['userInfo'])
  }
}
</script>
