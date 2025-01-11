<template>
  <footer class="main-footer">
    <strong>Copyright &copy; {{ year }}
    <a href="https://www.tu-chemnitz.de/cs/ce/">Professorship of Computer Engineering, University of Technology Chemnitz</a>.</strong> All rights reserved.
  </footer>
</template>

<script>
export default {
  name: 'DashFooter',
  data: function () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>
