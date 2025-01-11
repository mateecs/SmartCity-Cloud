<template>
    <l-map  ref="routeMap" style="width:100%;height:300px">
        <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        <l-polyline :latLngs="displayPoints"></l-polyline>
    </l-map>
</template>

<script>
import { LMap, LTileLayer, LPolyline } from 'vue2-leaflet'
// import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  components: {
    LMap,
    LTileLayer,
    // LMarker,
    LPolyline
  },
  props: {
    // max timestamp to show
    position: Number,
    // [ [lat] [lon] [timestamp] ]
    routeData: Array
  },
  mounted () {
    this.fitMapToRoute()
    this.applyPositionToRoute(this.position)
  },
  watch: {
    position: function (val) {
      this.applyPositionToRoute(val)
    },
    routeData: function (val) {
      this.fitMapToRoute()
      this.applyPositionToRoute(this.position)
    }
  },
  data: () => {
    return {
      displayPoints: []
    }
  },
  methods: {
    fitMapToRoute () {
      this.$nextTick(() => {
        if (this.$refs.routeMap) {
          // fit the map to the complete route, not only visible parts
          this.$refs.routeMap.mapObject.fitBounds(this.routeData)
        }
      })
    },
    applyPositionToRoute (value) {
      if (value >= this.routeData[this.routeData.length - 1]) {
        // show all points
        this.displayPoints = this.routeData
      } else {
        this.displayPoints = this.routeData.filter(p => p[2] <= value)
      }
    }
  }
}
</script>
