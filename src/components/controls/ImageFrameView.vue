<!--
  Displays individual frames of an image sequence (IMG_SEQ) sensor
-->

<template>
    <div>
      <img :src="currentFrameUrl" style="width: 100%; height: 100%;" />
    </div>

</template>

<script>
import TestDriveRepository from 'repo/TestDriveRepository'
import dayjs from 'dayjs'

export default {
  name: 'ImageFrameView',
  props: {
    testDriveId: String,
    sensorId: String,
    position: Number
  },
  watch: {
    position: function (val) {
      this.retrieveFrame(val)
    }
  },
  data: () => {
    return {
      isLoading: false,
      currentFrameUrl: null
    }
  },
  mounted () {
    this.retrieveFrame(this.position)
  },
  methods: {
    async retrieveFrame (position) {
      if (this.isLoading) return

      try {
        this.isLoading = true

        const { data } = await TestDriveRepository.getFrame(this.testDriveId, this.sensorId, dayjs(this.position).valueOf())
        this.currentFrameUrl = data.url

        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
