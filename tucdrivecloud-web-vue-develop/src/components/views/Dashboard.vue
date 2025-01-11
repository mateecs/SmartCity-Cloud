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
    </b-container>
  </section>
  <!-- /.content -->
</template>

<script>
import { RepositoryFactory } from 'repo/RepositoryFactory'
import numeral from 'numeral'

import apexchart from 'vue-apexcharts'
import InfoBox from 'components/widgets/InfoBox.vue'
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
      }
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
</style>
