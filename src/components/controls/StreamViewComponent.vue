<!--

This component takes a testDriveId and sensor object and displays the corresponding data values (i.e. the values which have been recorded
by the given sensor during the given test drive).
The visualization method depends on the datatype of the sensor.
Basically this components selects the appropriate component to display the sensor values.
Components are lazy loaded

-->

<template>
    <component :is="currentComponent" :testDriveId="testDriveId" :sensor="sensor" :position="position" :playbackSpeed="playbackSpeed" :isPlaying="isPlaying" />
</template>

<script>
export default {
  name: 'StreamViewComponent',
  components: {
    'no-chart': () => import('./NoChart.vue'),
    'sensor-chart': () => import('./SensorChart.vue'),
    'label-chart': () => import('./LabelChart.vue'),
    'image-view': () => import('./ImageFrameView.vue'),
    'lidar-view': () => import('./LidarFrameView.vue'),
    'video-view': () => import('./VideoView.vue'),
  },
  props: {
    testDriveId: String,
    sensor: null,
    // current playback position
    position: Number,
    playbackSpeed: Number,
    isPlaying: Boolean
  },
  computed: {
    currentComponent() {
      switch(this.sensor.datatype) {
        case 'FLOAT': return 'sensor-chart'
        case 'IMG_SEQ': return 'image-view'
        case 'POINT_CLOUD_XYZI': return 'lidar-view'
        case 'VIDEO': return 'video-view'
        case 'STRING': return 'label-chart'
        default: return 'no-chart'
      }
    }
  }
}
</script>
