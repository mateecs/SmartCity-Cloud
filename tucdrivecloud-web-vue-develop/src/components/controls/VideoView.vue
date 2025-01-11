<!--
  Displays individual frames of an image sequence (IMG_SEQ) sensor
-->

<template>
    <div id="video">
      <video :key="videoUrl" ref="videoRef" style="width: 100%; height: 100%;"  controls>
        <source :src="videoUrl" type="video/mp4" media="" >
        Your browser does not support the video tag.
      </video>
    </div>

</template>

<script>
import TestDriveRepository from '../../repo/TestDriveRepository'

export default {
  name: 'TestDriveDetails',
  props: {
    testDriveId: String,
    sensor: null,
    position: Number,
    isPlaying: Boolean,
    playbackSpeed: Number
  },
  watch: {
    position: function (val) {
      this.setVideoTime(val)
    },
    isPlaying: function (playing) {
      if (playing) {
        this.play()
      } else {
        this.stop()
      }
    },
    playbackSpeed: function (speed) {
      this.setVideoSpeed(speed)
    }
  },
  data: () => {
    return {
      isLoading: true,
      videoUrl: null
    }
  },
  mounted () {
    this.playing = false
    this.loadVideo(this.position)
  },
  methods: {
    async stop () {
      this.$refs.videoRef.pause()
    },
    async play () {
      this.$refs.videoRef.play()
    },
    async loadVideo (position) {
      try {
        this.isLoading = true

        const { data } = await TestDriveRepository.getStream(this.testDriveId, this.sensor.id)
        this.videoUrl = data.values[0].value
        this.videostart = new Date(data.values[0].timestamp).getTime()

        const response = await TestDriveRepository.get(this.testDriveId)
        const drivedata = response.data

        this.min = new Date(drivedata.started).getTime()
        this.max = new Date(drivedata.ended).getTime()

        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    },
    setVideoTime (position) {
      const vidtime = (Math.max(this.min, Math.min(this.max, position - (this.videostart - this.min))) - this.min) * 0.001
      this.$refs.videoRef.pause()
      console.log(vidtime)
      console.log((position - this.min))
      this.$refs.videoRef.currentTime = vidtime
    },
    setVideoSpeed (speed) {
      this.$refs.playbackSpeed = speed * 0.001
      console.log('video speed: ' + this.$refs.playbackSpeed)
    }

  }
}
</script>
