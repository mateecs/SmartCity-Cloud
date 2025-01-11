<template>
  <div :class="['wrapper', classes]">

    <!-- Horizontal bar at top. Contains messages, notifications, tasks and user menu -->
    <dash-header :user="user"></dash-header>

    <!-- Left side column. contains the logo and sidebar -->
    <sidebar />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          <!-- show name of last route element which is not empty (so for default child elements show the parent name) -->
          {{ this.$router.currentRoute.matched.filter(x => x.name).slice(-1)[0].name }}
          <small>{{ $route.meta.description }}</small>
        </h1>
        <ol class="breadcrumb">
          <li>
            <router-link to="/">
            <!-- <fa-icon size="xs" icon="home" style="margin-right:5px;"></fa-icon> -->
              Home&nbsp;
            </router-link>
          </li>
          <li v-for="(b, index) in this.$router.currentRoute.matched.filter(x => x.name)" v-bind:key="index">
            <router-link :to="b.path" style="margin-right:5px;">
              {{b.name&nbsp;}}
            </router-link>
          </li>
        </ol>
      </section>

      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->

    <!-- Horizontal bar at bottom. Contains copy right -->
    <dash-footer></dash-footer>
  </div>
</template>

<script>
import config from '@/config'
import DashFooter from './layout/DashFooter.vue'
import DashHeader from './layout/DashHeader.vue'
import Sidebar from './layout/Sidebar.vue'
// import 'hideseek'

import defaultUserImageurl from '@/assets/img/default_user_avatar.png'

import { useSessionStore } from 'src/stores/session'

export default {
  name: 'Dash',
  components: {
    DashFooter,
    DashHeader,
    Sidebar
  },
  data: () => {
    return {
      sessionStore: useSessionStore(),
      // section: 'Dash',
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      }
    }
  },
  computed: {
    user () {
      return {
        displayName: this.sessionStore.user,
        avatar: defaultUserImageurl,
        roles: ['TUC SmartCityCloud User']
      }
    }
  }
}
</script>

<style scoped>
.wrapper.fixed_layout .main-header {
  position: fixed;
  width: 100%;
}
.wrapper.fixed_layout .content-wrapper {
  padding-top: 50px;
}
.wrapper.fixed_layout .main-sidebar {
  position: fixed;
  height: 100vh;
}

@media (max-width: 767px) {
  .wrapper.hide_logo .main-header .logo {
    display: none;
  }
}

.logo-mini,
.logo-lg {
  text-align: left;
}
.logo-mini img,
.logo-lg img {
  padding: 0.4em !important;
}

.logo-lg img {
  display: -webkit-inline-box;
  width: 25%;
}

.user-panel {
  height: 4em;
}

hr.visible-xs-block {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  height: 1px;
  border-color: transparent;
}
</style>
