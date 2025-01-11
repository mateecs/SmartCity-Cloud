<template>
  <!-- Main content -->
  <section class="content">
    <b-container fluid>
      <b-row class="mb-3">
        <b-col cols="6">
          <b-card header="Person in Charge">
              <a href="https://www.tu-chemnitz.de/informatik/ce/professur/professor.php.en">Prof. Dr. Dr. h. c. Wolfram Hardt</a><br/>
              +49 371 531-25550<br/>
              hardt@cs.tu-chemnitz.de<br/>
              <br/>
              Technische Universität Chemnitz<br/>
              Fakultät für Informatik<br/>
              Professur Technische Informatik<br/>
              Straße der Nationen 62<br/>
              D-09111 Chemnitz<br/>
          </b-card>
        </b-col>

        <b-col cols="6">
          <b-card header="Institution">
              Technical University Chemnitz<br/>
              Department of Computer Science<br/>
              Professorship Computer Engineering<br/>
              D-09107 Chemnitz<br/>

              <a href="https://www.tu-chemnitz.de/informatik/ce/index.php.en">https://www.tu-chemnitz.de/informatik/ce/</a>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="6">
          <b-card header="Data Privacy Statement">
              <router-link tag="a" class="pageLink" to="/privacystatement">
                See here
              </router-link>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
</script>
