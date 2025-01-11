<template>
  <aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

      <!-- Sidebar TUC SmartCityCloud Logo -->
      <div style="padding: 10px 2px;">
        <div style="text-align:center;color:white;">
          <img id="sidebar-logo" src="@/assets/img/tuc_smartcitycloud_logo.png" class="img-fluid center-block" />
          <br>
          <b>TUC<wbr>SmartCity<wbr>Cloud</b>
        </div>
      </div>

      <!-- search form (Optional) -->
      <form v-on:submit.prevent class="sidebar-form" id="searchForm">
        <div class="input-group" id="searchContainer">
          <span class="input-group-btn">
            <input type="text"
            name="search"
            id="search"
            class="search form-control"
            data-toggle="hideseek"
            placeholder="Search Menus"
            data-list=".sidebar-menu">
            <button type="submit" name="search" id="search-btn" class="btn btn-flat">
              <fa-icon icon="search"></fa-icon>
            </button>
          </span>
        </div>
      </form>
      <!-- /.search form -->

      <!-- Sidebar Menu -->
      <sidebar-menu />
      <!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>
<script>
import SidebarMenu from './SidebarMenu.vue'

export default {
  name: 'Sidebar',
  components: { SidebarMenu },
  /*mounted: function () {
    window
      .jQuery('[data-toggle="hideseek"]')
      .off()
      .hideseek()
  }*/
}
</script>
<style scope="local">
#searchForm {
  padding-left: 0em;
  padding-right: 0em;
}
#searchContainer {
  height: 100%;
  padding-bottom: 0em;
}
#search {
  width: 80%;
  float: right;
}

#search-btn {
  width: 20%;
}
#sidebar-logo {
  max-width: 150px;
  width:100%;
}
</style>
