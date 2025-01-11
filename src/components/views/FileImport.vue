<!-- based on https://medium.com/@vipinc.007/how-to-handle-file-upload-in-vue-js-e910c63e7569 -->
<template>
<section class="content">
       <b-container fluid >
            <b-row align-h="center" align-v="center">
              <input type="file" accept=".csv" @change="Files_onFileChanged"><b-button variant="primary" @click="Files_onUpload()">Upload!</b-button>
              <!-- For more accepted file formats, add them to "accept" -->
           </b-row>
            <b-row><b-col></b-col></b-row>
             <b-row align-h="center" align-v="center">
              <div class="success" v-if="savingSuccessful">
                <strong>{{ this.text }}</strong>
              </div></b-row>
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

import FileImportRepository from '../../repo/FileImportRepository.vue'

export default {
  data: () => {
    return {
      File: {
        selectedFile: null
      },
      savingSuccessful: false,
      text: 'Upload successful'
    }
  },
  methods: {
    Files_onFileChanged (event) {
      this.File.selectedFile = event.target.files[0]
      this.savingSuccessful = false
    },
    async Files_onUpload () {
      const mypostparameters = new FormData()
      mypostparameters.append('file', this.File.selectedFile, this.File.selectedFile.name)
      const { data } = await FileImportRepository.uploadFile(mypostparameters)
      if (data.url === 'Upload successful') {
        this.savingSuccessful = true
      }
    }
  }
}
</script>

<style>

</style>
