<template>
  <div id="importfield">
    <b-container fluid>
      <b-row align-h="center" align-v="center">
        <label class="control-label" for="drive_name"> File Name: </label>
        <div class="col-xs-4">
          <input
            class="form-control"
            id="drive_name"
            type="file"
            @change="handleFileChange"
          />
        </div>
      </b-row>

      <!-- Button Row -->
      <b-row align-h="center" class="mt-3">
        <button @click="texttojson" class="custom-button">
          Upload
        </button>
      </b-row>
    </b-container>

    <!-- Modals -->
    <b-modal ref="success-modal-upl" title="Upload Successful">
      File uploaded successfully!
    </b-modal>
    <b-modal ref="fail-modal" title="Data Entry Failed">
      Please upload your file again.
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios for making HTTP requests

export default {
  name: 'App',
  data() {
    return {
      file: null, // Store the selected file
      text: '',
      drivedata: {
        name: 'Imported Drive',
        vals: '',
      },
    };
  },
  methods: {
    // Handle file selection
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        // Check if the selected file is a ZIP file based on its MIME type or file extension
        if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
          this.file = selectedFile;
          this.drivedata.name = selectedFile.name; // Store the file name in drivedata
        } else {
          alert('Please upload a valid ZIP file.');
          // Reset the file input if not a valid ZIP file
          event.target.value = '';
        }
      }
    },

    // Navigate to SuccessView with a 5-second delay
    async texttojson() {
      // Add a delay of 5 seconds before navigating
      setTimeout(() => {
        this.$router.push('/upload-success');
      }, 5000);
    },
  },
};
</script>

<style scoped>
.custom-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: green; /* Green background */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.custom-button:hover {
  background-color: darkgreen; /* Darker green on hover */
}

.custom-button:active {
  background-color: forestgreen; /* Forest green on click */
}
</style>
