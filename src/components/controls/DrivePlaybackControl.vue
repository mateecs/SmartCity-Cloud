<template>
    <b-container fluid>
          <b-row class="mb-3">
            <b-col cols="1">
              <b-button v-if="internal_isPlaying" @click="pause" size="sm"><fa-icon icon="pause"></fa-icon></b-button>
              <b-button v-else @click="play" size="sm"><fa-icon icon="play"></fa-icon></b-button>
            </b-col>
            <b-col cols="11">
              <vueslider style="margin-top:8px" tooltip="focus" tooltipPlacement="bottom"
                :tooltip-formatter="tooltipFormatter"
                :modelValue="this.position" @change="handleSliderPosChanged" :min="min" :max="max">
                <template v-slot:dot>
                    <fa-icon icon="car-side" size="lg" transform="up-13 left-15"></fa-icon>
                </template>
              </vueslider>

              <div style="position:absolute; right: -6px; top: -8px">
                <fa-icon icon="flag-checkered" size="lg"></fa-icon>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
             <b-form-group>
                <b-form-radio-group size="sm" buttons v-model="playbackSpeed" :options="availablePlaybackSpeeds" @change="handleSpeedChange"></b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col>
              Current position: <fa-icon icon="clock"></fa-icon> {{ position | formatDateTime('HH:mm:ss') }}
            </b-col>
          </b-row>
        </b-container>
</template>

<script>
import { formatDateTime } from 'src/filters'

import vueslider from 'components/controls/vue-slider-component-fix'
// import { getKeyboardHandleFunc } from 'vue-slider-component/typings/utils'
import 'assets/css/vue-slider-custom.scss'

export default {
  components: {
    vueslider
  },
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    position: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isPlaying () {
      return this._isPlaying
    }
  },
  data: () => {
    return {
      internal_isPlaying: false,
      sliderIsAdjusting: false,
      sliderAdjustingTargetPosition: 0,
      tooltipFormatter: (value) => {
        return formatDateTime(value, 'HH:mm:ss')
      },
      refreshInterval: 250,
      playbackSpeed: 1000,
      availablePlaybackSpeeds: [
        { text: '⅛x', value: () => 125 },
        { text: '¼x', value: 250 },
        { text: '½x', value: 500 },
        { text: '1x', value: 1000 },
        { text: '2x', value: 2000 },
        { text: '4x', value: 4000 },
        { text: '8x', value: 8000 },
        { text: '16x', value: 16000 },
        { text: '32x', value: 32000 },
        { text: '64x', value: 64000 },
        { text: '128x', value: 128000 }
      ]
    }
  },
  methods: {
    handleSliderPosChanged (value) {
      // do not update every value change when the user is dragging the slider thumb
      // as it results in slowdowns, instead use the default playback refresh rate to update

      // Fix seeking bug
      if (this.internal_isPlaying) {
        return
      }

      this.sliderAdjustingTargetPosition = value

      if (!this.sliderIsAdjusting) {
        this.sliderIsAdjusting = true

        setTimeout(() => {
          if (!this.internal_isPlaying) {
            this.$emit('position-change-committed', this.sliderAdjustingTargetPosition)
            this.sliderIsAdjusting = false
          }
        }, this.refreshInterval)
      }
    },
    handleSpeedChange (value) {
      this.$emit('speed-change-committed', value)
    },
    play () {
      if (this.position >= this.max) {
        this.$emit('position-change-committed', this.min)
      }

      if (this.internal_isPlaying !== true) {
        this.internal_isPlaying = true
        this.$emit('isplaying-change-committed', this.internal_isPlaying)
      }

      this.step()
    },
    pause () {
      if (this.internal_isPlaying !== false) {
        this.internal_isPlaying = false
        this.$emit('isplaying-change-committed', this.internal_isPlaying)
      }
    },
    step () {
      setTimeout(() => {
        // check if playback was already cancelled
        if (this.internal_isPlaying) {
          // step by value depending on playback speed
          this.$emit('position-change-committed', this.position + (this.playbackSpeed / (1000 / this.refreshInterval)))
        }

        if (this.position === this.max) {
          if (this.internal_isPlaying !== false) {
            this.internal_isPlaying = false
            this.$emit('isplaying-change-committed', this.internal_isPlaying)
          }
        }

        if (this.internal_isPlaying) {
          this.play()
        }
      }, this.refreshInterval)
    }
  }
}
</script>

<!--
<style scoped>
 .custom-tooltip {
    width: 100px;
    transform: translateY(-6px);
  }
  .custom-tooltip.focus {
    font-weight: bold;
  }
</style>
-->
