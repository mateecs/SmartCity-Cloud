<!-- based on https://alligator.io/vuejs/file-reader-component/ -->
<template>
<section class="content">
       <b-container fluid >
            <b-row align-h="center" align-v="center">
                <label class="text-reader">
                    Upload
                    <input type="file" accept=".csv" @change="loadTextFromFile">
                </label>
           </b-row>
            <b-row><b-col></b-col></b-row>
            <br>
            <b-card header="Format of .csv file:">
            <b-container>
            <b-row>
              <b-col>Sensor ID;</b-col>
              <b-col>Datetime;</b-col>
              <b-col>Sensor Value;</b-col>
            </b-row>
            <b-row>
              <b-col>Sensor ID;</b-col>
              <b-col>Datetime; </b-col>
              <b-col>Sensor Value;</b-col>
            </b-row>
            <b-row>
              <b-col>Sensor ID;</b-col>
              <b-col>Datetime; </b-col>
              <b-col>Sensor Value;</b-col>
            </b-row>
            </b-container>
            </b-card>
        </b-container>
    </section>
</template>

<script>
export default {
  methods: {
    loadTextFromFile (ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)
    }
  }
}
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button looking */
    font-size: 1.25em;
    padding: 12px 24px;
    color: white;
    background-color: #6A8A26;
    border-radius: 6px;
    cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}

.b-card{
  max-width: 900px;
}
</style>
