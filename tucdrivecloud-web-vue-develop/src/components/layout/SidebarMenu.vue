<template>
  <ul class="sidebar-menu" data-widget="tree">
    <li class="header">OVERVIEW</li>
    <router-link tag="li" class="pageLink" to="/dashboard">
      <a>
        <fa-icon icon="desktop"></fa-icon>
        <span class="page">Dashboard</span>
      </a>
    </router-link>

    <li class="header">CONFIGURATION</li>
    <router-link tag="li" class="pageLink" to="/vehicles">
      <a>
        <fa-icon icon="car"></fa-icon>
        <span class="page">Vehicles</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/sensors">
      <a>
        <fa-icon icon="satellite-dish"></fa-icon>
        <span class="page">Sensors</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/setting">
      <a>
        <fa-icon icon="cogs"></fa-icon>
        <span class="page">Drive Setups</span>
      </a>
    </router-link>
    <!--
    <li class="treeview">
      <a href="#">
        <fa-icon icon="folder-o"></fa-icon>
        <span class="treeview-title">Files</span>
        <span class="pull-right-container pull-right">
          <fa-icon icon="angle-left fa-fw"></fa-icon>
        </span>
      </a>
      <ul class="treeview-menu">
        <li>
          <a href="#">
            <fa-icon icon="file-word-o"></fa-icon> Item 1
          </a>
        </li>
        <li>
          <a href="#">
            <fa-icon icon="file-picture-o"></fa-icon> Item 2
          </a>
        </li>
        <li>
          <a href="#">
            <fa-icon icon="file-pdf-o"></fa-icon> Item 3
          </a>
        </li>
      </ul>
    </li>
  -->

    <li class="header">DATA</li>
    <router-link tag="li" class="pageLink" to="/drives">
      <a>
        <fa-icon icon="chart-area"></fa-icon>
        <span class="page">Recorded Drives</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/import">
      <a>
        <fa-icon icon="cloud-upload-alt"></fa-icon>
        <span class="page">Data Import</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/export">
      <a>
        <fa-icon icon="cloud-download-alt"></fa-icon>
        <span class="page">Data Export</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/tokens">
      <a>
        <fa-icon icon="flag"></fa-icon>
        <span class="page">Access Tokens</span>
      </a>
    </router-link>

    <li class="header">INFORMATION</li>
    <router-link tag="li" class="pageLink" to="/help">
      <a>
        <fa-icon icon="question-circle"></fa-icon>
        <span class="page">Help</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/licenses">
      <a>
        <fa-icon icon="copyright"></fa-icon>
        <span class="page">Licenses</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/imprint">
      <a>
        <fa-icon icon="info-circle"></fa-icon>
        <span class="page">Imprint</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/privacystatement">
      <a>
        <fa-icon icon="balance-scale"></fa-icon>
        <span class="page">Data Privacy Statement</span>
      </a>
    </router-link>

<!--
    <li class="header">PAGES</li>
    <router-link tag="li" class="pageLink" to="/login">
      <a>
        <fa-icon icon="circle-o text-yellow"></fa-icon>
        <span class="page"> Login</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/404">
      <a>
        <fa-icon icon="circle-o text-red"></fa-icon>
        <span class="page"> 404</span>
      </a>
    </router-link>
    -->
  </ul>
</template>
<script>
export default {
  name: 'SidebarMenu'
}
</script>
<style>
/* override default */
.sidebar-menu > li > a {
  padding: 12px 15px 12px 15px;
}

.sidebar-menu li.active > a > .fa-angle-left,
.sidebar-menu li.active > a > .pull-right-container > .fa-angle-left {
  animation-name: rotate;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
}

.treeview-title {
  z-index: 1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-90deg);
  }
}
a > span {
  /* spacing between icon and menu entry text */
  margin-left: 5px;
}
</style>
