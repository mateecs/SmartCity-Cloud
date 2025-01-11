<!-- based on https://alligator.io/vuejs/file-reader-component/ -->
<template>
  <div id="importfield">
    <b-container fluid >
      <b-row align-h="center" align-v="center">
        <label class="control-label" for="drive_name"> Drive Name : </label>
        <div class="col-xs-4">
          <input class="form-control" id="drive_name" placeholder="" type="text" v-model="drivedata.name">
        </div>
      </b-row>
      <b-row><b-col></b-col></b-row>
    </b-container>
    <text-reader @load="text = $event; texttojson()" ></text-reader>
    <b-modal ref="success-modal-upl" title="Upload Successful">
    </b-modal>
    <b-modal ref="success-modal" title="Data Entry Failed, please upload your file again">
    </b-modal>

  </div>
</template>

<script>
import TextReader from './FileReader.vue'
import FileImportRepository from 'repo/FileImportRepository'

export default {
  name: 'app',
  data: () => ({
    text: '',
    drivedata: {
      name: 'Imported Drive',
      vals: ''
    }
  }),
  components: {
    TextReader
  },
  methods: {
    async texttojson () {
      function DBLine (senID, time, value) {
        this.SensorID = senID
        this.Datetime = time
        this.Value = value
      }
      var values = this.text.split('\n')
      var arrayForJSON = []
      for (var i = 0; i < values.length; i++) {
        var linevalues = values[i].split(';')
        if (linevalues.length > 1) {
          var objectline = new DBLine(linevalues[0], linevalues[1], linevalues[2])
          arrayForJSON.push(objectline)
        }
      }
      this.drivedata.vals = arrayForJSON
      this.$refs['success-modal-upl'].show()
      const { data } = await FileImportRepository.uploadFile(this.drivedata)
      if (data.Status !== 'Upload successful') {
        this.$refs['fail-modal'].show()
      }
    }
  }
}
</script>
