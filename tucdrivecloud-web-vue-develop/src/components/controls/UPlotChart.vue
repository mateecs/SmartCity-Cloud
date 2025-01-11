<template>
    <div ref="chartcontainer" />
</template>

<script>
import 'uplot/dist/uPlot.min.css'
import UPlot from 'uplot'

export default {
  name: 'UPlotChart',
  props: {
    // max position to filter x-values
    position: Number,
    legendLabel: String,
    chartHeight: Number,
    chartData: Array
  },
  watch: {
    position: function (val) {
      this.applyPositionToChart(val)
    },
    chartData: function (val) {
      this.applyPositionToChart(this.position)
    }
  },
  data: () => {
    return {
      displayData: null,
      uplotRef: null,
      opts: null
    }
  },
  mounted () {
    this.init()
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    calculateWidthInContainer (chartcontainer) {
      const hpadding = parseFloat(window.getComputedStyle(chartcontainer.parentElement).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(chartcontainer.parentElement).getPropertyValue('padding-right'))
      return chartcontainer.parentElement.clientWidth - hpadding
    },
    init () {
      // chart should fill parent element horizontally, height is user-defined
      const chartcontainer = this.$refs.chartcontainer

      this.opts = {
        title: '',
        width: this.calculateWidthInContainer(chartcontainer),
        height: this.chartHeight,
        series: [
          {},
          {
            spanGaps: false,

            // in-legend display
            label: this.legendLabel,
            value: (self, rawValue) => rawValue.toFixed(2),

            // series style
            stroke: '#6A8A26',
            width: 2,
            fill: '#6A8A264C'
          }
        ]
      }

      this.uplotRef = new UPlot(this.opts, this.getDisplayValuesForPosition(this.position), chartcontainer)
    },
    recreate () {
      const chartcontainer = this.$refs.chartcontainer
      const w = this.calculateWidthInContainer(chartcontainer)
      if (w > 0) {
        if (this.uplotRef != null) {
          this.uplotRef.destroy()
          this.uplotRef = null
        }
        this.init()
      }
    },
    handleResize (event) {
      this.$nextTick(function () {
        // for now we have to completely destroy and recreate the chart
        // since uPlot.setSize throws an exception in getIncrSpace()
        this.recreate()
      })
    },
    applyPositionToChart (value) {
      if (this.uplotRef == null || this.uplotRef.isLoading) {
        return
      }

      this.uplotRef.setData(this.getDisplayValuesForPosition(value))
    },
    getDisplayValuesForPosition (value) {
      if (this.chartData == null) {
        return []
      }

      if (value >= this.chartData[this.chartData.length - 1]) {
        // show all points
        return this.chartData
      } else {
        value = value / 1000.0 // uplot uses second precision
        return [
          this.chartData[0].filter(v => v <= value),
          this.chartData[1].filter((v, idx) => this.chartData[0][idx] <= value)
        ]
      }
    }
  }
}

</script>
