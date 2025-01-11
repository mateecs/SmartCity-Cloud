<template>
<div id="notFound">
      <img id="logo">

      <b-container class="box">
        <b-row><b-col>
          <h1>Make U-turn when possible.</h1>
        </b-col></b-row>
        <b-row><b-col>
          <h4>Sorry, this page does not exist.</h4>
        </b-col></b-row>
        <b-row><b-col>
          <router-link to="/" class="vertical-5p lead">Go into reverse.</router-link>
        </b-col></b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
@media (min-width: 1200px) {
    .container{
        max-width: 600px;
    }
}
.container {
  padding:20px 10px;background-color:rgba(255, 255, 255, 0.5);
}
#notFound {
  padding: 10em 0;
  text-align: center;
  width: 100%;
  height: 100vh;
  background: url('assets/img/login_bg.jpg');
  background-size: cover;
}
#logo {
  margin: 0 auto;
  content: url('assets/img/tuc_smartcitycloud_logo.png');
}
</style>
