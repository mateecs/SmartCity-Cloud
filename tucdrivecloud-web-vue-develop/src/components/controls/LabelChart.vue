<template>
  <b-spinner v-if='labelChart.isLoading' type='grow'></b-spinner>
  <p v-else-if='labelChart.errorMessage' class='text-red'>{{ labelChart.errorMessage }}</p>
  <apexchart
    v-else
    type='line'
    width='100%'
    height='500px'
    :options='labelChart.options'
    :series='labelChart.series'
  />
</template>

<script>
import apexchart from 'vue-apexcharts'
import TestDriveRepository from 'repo/TestDriveRepository'
// import numeral from 'numeral'

export default {
  name: 'LabelChart',
  components: {
    apexchart
  },
  props: {
    testDriveId: String,
    sensorId: String,
    // max position to filter x-values
    position: Number
  },
  watch: {
    position: function (val) {
      this.applyPositionToChart(val)
    }
  },
  data: () => {
    return {
      labelChart: {
        isLoading: false,
        errorMessage: '',
        options: {
        },
        series: []
      }
    }
  },
  mounted () {
    this.init()
  },
  // destroyed() {
  // },
  methods: {
    async init () {
      try {
        this.labelChart.isLoading = true
        const { data } = await TestDriveRepository.getStream(this.testDriveId, this.sensorId)

        const response = await TestDriveRepository.get(this.testDriveId)
        const drivedata = response.data

        this.min = new Date(drivedata.started).getTime()
        this.max = new Date(drivedata.ended).getTime()

        this.list = data.values.map(v => ({
          x: new Date(v.timestamp).getTime(),
          strokeDashArray: 0,
          borderColor: '#6A8A26',
          label: {
            borderColor: '#6A8A26',
            style: {
              fontSize: '15px',
              color: '#fff',
              background: '#6A8A26'
            },
            text: v.value
          }
        }))

        this.datapoints = data.values.map(v => ({
          x: new Date(v.timestamp).getTime(),
          y: (100 * (new Date(v.timestamp).getTime() - this.min)) / (this.max - this.min)
        }))

        this.datapoints.push({
          x: this.min,
          y: 0
        })

        this.datapoints.push({
          x: this.max,
          y: 100
        })

        console.log(this.datapoints)

        this.allseries = [{
          name: 'progress',
          data: this.datapoints
        }]

        this.labelChart.options = {
          colors: ['#6A8A26', '#46AF78', '#A93F55', '#8C5E58', '#2176FF', '#33A1FD', '#7A918D', '#BAFF29'],
          annotations: {
            xaxis: this.list
          },
          xaxis: {
            type: 'datetime',
            labels: {
              formatter: (val, index) => {
                var date = new Date(val)
                return date.toTimeString().split(' ')[0]
              }
            }
          },
          yaxis: {
            title: {
              text: 'TestDrive progress'
            },
            min: 0,
            max: 100,
            labels: {
              formatter: (val, index) => val + '%'
            }
          }
        }

        this.labelChart.series = this.allseries
      } catch (e) {
        console.log(e)
      }
      this.labelChart.isLoading = false
    },
    applyPositionToChart (value) {
      const maxtime = new Date(value).getTime()

      const yval = (100 * (value - this.min)) / (this.max - this.min)
      console.log(yval)

      this.labelChart.options = {
        annotations: {
          points: [{
            x: maxtime,
            y: yval,
            marker: {
              size: 8,
              fillColor: '#fff',
              strokeColor: '#6A8A26',
              radius: 2
            },
            label: {
              borderColor: 'black',
              offsetY: 0,
              style: {
                color: '#fff',
                background: 'black'
              },
              text: 'Time'
            }
          }],
          xaxis: this.list
        },
        xaxis: {
          type: 'datetime',
          labels: {
            formatter: (val, index) => {
              var date = new Date(val)
              return date.toTimeString().split(' ')[0]
            }
          }
        },
        yaxis: {
          min: 0,
          max: 100,
          labels: {
            formatter: (val, index) => val + '%'
          }
        }
      }
    }
  }
}
</script>
