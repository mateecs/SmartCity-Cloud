<!--
    Uses a line chart to display the recorded values of a sensor for a test drive
-->

<template>
     <b-spinner v-if="isLoading" type="grow" size="sm" />
     <UPlotChart v-else :legendLabel="sensor.name" :chartData="chart.data" :chartHeight=400 :position="position" />
</template>

<script>
import TestDriveRepository from 'repo/TestDriveRepository'
import dayjs from 'dayjs'
import UPlotChart from './UPlotChart.vue'

export default {
  name: 'SensorChart',
  components: {
    UPlotChart
  },
  props: {
    testDriveId: String,
    sensor: null,
    // current playback position
    position: Number
  },
  data: () => {
    return {
      isLoading: true,

      chart: {}
    }
  },
  mounted () {
    if (this.sensor.datatype === 'FLOAT') {
      // FLOAT values a shown in a line chart using the SensorChart component
      this.retrieveChartData()
    } else {
      this.isLoading = false
    }
  },
  methods: {
    async retrieveChartData () {
      try {
        this.isLoading = true

        const { data } = await TestDriveRepository.getStream(this.testDriveId, this.sensor.id)

        // x and y are separate arrays
        var values = []
        values.push([])
        values.push([])

        for (var i = 0; i < data.values.length; i++) {
          values[0].push(dayjs(data.values[i].timestamp).valueOf() / 1000.0) // uplot uses second precision
          values[1].push(data.values[i].value)
        }

        this.chart.data = values
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
