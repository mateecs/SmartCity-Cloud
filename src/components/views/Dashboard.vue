<template>
  <!-- Main content -->
  <section class="content">
    <b-container>
      <b-row>
        <b-col>
            <router-link to="/vehicles" style="color:black">
              <info-box color-class="bg-aqua"
                        iconName="car"
                        text="Vehicles"
                        :number="stats.vehicles"></info-box>
            </router-link>
        </b-col>
        <b-col>
          <router-link to="/sensors" style="color:black">
              <info-box color-class="bg-red"
                    iconName="satellite-dish"
                    text="Sensors"
                    :number="stats.sensors"></info-box>
            </router-link>
        </b-col>
        <b-col>
          <router-link to="/drive_setups" style="color:black">
              <info-box color-class="bg-green"
                    iconName="cogs"
                    text="Drive Setups"
                    :number="stats.drive_setups"></info-box>
            </router-link>
        </b-col>
        <b-col>
          <router-link to="/drives" style="color:black">
              <info-box color-class="bg-yellow"
                    iconName="chart-area"
                    text="Recorded Test Drives"
                    :number="stats.recorded_drives"></info-box>
            </router-link>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="5">
          <b-card header="Top contributing vehicles">
            <b-spinner v-if="vehicleChart.isLoading" type="grow"></b-spinner>
            <p v-else-if="vehicleChart.errorMessage" class="text-red"> {{ vehicleChart.errorMessage }}</p>
            <apexchart v-else type="pie" width=100% :options="vehicleChart.options" :series="vehicleChart.series" />
          </b-card>
        </b-col>
        <!--
        <b-col cols="7">
          <b-card :header="'Value contribution by week in ' + currentYear">
            <b-spinner v-if="weekChart.isLoading" type="grow"></b-spinner>
            <p v-else-if="weekChart.errorMessage" class="text-red"> {{ weekChart.errorMessage }}</p>
            <apexchart v-else type="line" width=100% :options="weekChart.options" :series="weekChart.series" />
          </b-card>
        </b-col>
        -->
      </b-row>
      
        <h2>Overview</h2>
        <p> <strong>Dataset :</strong> German Traffic Sign Recognition</p>
        <p> Total 43 classes</p>
        <p> More than 50,000 Total images</p>
        <p> Training set include <strong> 39209 </strong> Images & Test set include 12630 Images</p>


        <div class="container">
        <h2 class="mt-5">Dataset Directory Structure</h2>
        <div class="code-box">
           
            <pre>
    German-Traffic-Sign-Recognition/
        ├── Meta/
        ├── Test/
        ├── Train/
        │   ├── 0/
        │   ├── 1/
        │   ├── 2/
        │   ├── ...
        │   ├── 42/
        ├── test.csv
        └── Train.csv
    </pre>
        </div>
    </div>

     <!-- Add image below the dataset directory structure -->
        <div class="image-container mt-4">
          <img :src="frequencyImage" alt="Training Sample" class="training-sample" />
        </div>

     <!-- Add image below the dataset directory structure -->
        <div class="image-container mt-4">
          <img :src="trainingSampleImage" alt="Training Sample" class="training-sample" />
        </div>

      <h4>Evaluation</h4>
            <p>My final model results were:</p>
            <ul>
                <li>Training accuracy: 99.85%</li>
                <li>Validation accuracy: 99.92</li>
                <li>Test accuracy: 98.24%</li>
              </ul>

            <!-- Image for Predictions -->
      <div class="image-container mt-4">
        <img :src="predictionImage" alt="Prediction Sample" class="prediction-sample" />
      </div>

    </b-container>
    
    

  </section>

  

  <!-- /.content -->
</template>

<script>
import { RepositoryFactory } from 'repo/RepositoryFactory'
import numeral from 'numeral'

import apexchart from 'vue-apexcharts'
import InfoBox from 'components/widgets/InfoBox.vue'
import trainingSample from '@/assets/Training.png'
import predictionSample from '@/assets/prediction.PNG'
import frequencySample from '@/assets/frequency.png'
const StatRepository = RepositoryFactory.get('posts')

export default {
  name: 'Dashboard',
  components: {
    apexchart,
    InfoBox
  },
  data () {
    return {
      stats: {
        vehicles: null,
        sensors: null,
        drive_setups: null,
        recorded_drives: null,
        sensor_values: null
      },
      vehicleChart: {
        isLoading: false,
        errorMessage: '',
        options: {
          title: {
            text: 'Test drive share by vehicle'
          },
          labels: []
        },
        series: []
      },
      weekChart: {
        isLoading: false,
        errorMessage: '',
        options: {
          title: {
            text: 'Sensor values recorded by week'
          },
          yaxis: {
            min: 0,
            labels: {
              formatter: (val, index) => numeral(val).format('0,0')
            }
          }
        },
        series: []
      },
      trainingSampleImage: trainingSample,
      predictionImage: predictionSample,
      frequencyImage: frequencySample,
    }
  },
  computed: {
    isMobile () {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    },
    currentYear () {
      return new Date().getFullYear()
    }
  },
  created () {
    this.fetchGeneralCounts()
    this.fetchVehicleChart()
    this.fetchWeekChart()
  },
  methods: {
    async fetchGeneralCounts () {
      const { data } = await StatRepository.get()
      this.stats = data
    },
    async fetchVehicleChart () {
      try {
        this.vehicleChart.isLoading = true
        const { data } = await StatRepository.getDriveCountByVehicle()

        this.vehicleChart.options.labels = data.map(v => v.vehicle_name)
        this.vehicleChart.series = data.map(v => v.count)
      } catch (error) {
        window.console.error(error)
        this.vehicleChart.errorMessage = 'Could not load chart data'
      } finally {
        this.vehicleChart.isLoading = false
      }
    },
    async fetchWeekChart () {
      /*try {
        this.weekChart.isLoading = true
        const { data } = await StatRepository.getRecordingActivityByYear(this.currentYear)

        this.weekChart.series = [{
          name: 'contributions by week',
          data: data.map(v => ({
            x: `W${v.week}`,
            y: v.count
          }))
        }]
      } catch (error) {
        window.console.error(error)
        this.weekChart.errorMessage = 'Could not load chart data'
      } finally {
        this.weekChart.isLoading = false
      }*/
    }
  }
}
</script>
<style scoped>
.fullCanvas {
  width: 100%;
}

.image-container {
  text-align: left;
  margin-top: 10px;
}

.training-sample {
  max-width: 60%;
  height: 69%;
  border: 1px solid #ddd; /* Optional styling */
  border-radius: 5px; /* Optional styling */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Optional shadow */
}
.prediction-sample {
  max-width: 40%;
  height: 69%;
  border: 1px solid #ddd; /* Optional styling */
  border-radius: 5px; /* Optional styling */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Optional shadow */
}
.frequeny {
  max-width: 60%;
  height: 69%;
  border: 1px solid #ddd; /* Optional styling */
  border-radius: 5px; /* Optional styling */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Optional shadow */
}


</style>
