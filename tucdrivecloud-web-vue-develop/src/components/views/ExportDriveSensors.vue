<template>
<section class="content">
    <b-container fluid>
      <b-row class="mb-3"><b-col>
        <b-card header="General information">
          <b-container fluid>
            <div v-if="isLoadingInfo" class="text-center">
              <b-spinner type="grow" size="sm" />Loading...
            </div>
            <div v-else>
            <b-row>
              <b-col cols="2">Name:</b-col>
              <b-col>{{testDriveInfo.name}}</b-col>
            </b-row>

            <b-row>
              <b-col cols="2">Status:</b-col>
              <b-col>{{testDriveInfo.status}}</b-col>
            </b-row>

            <b-row>
              <b-col cols="2">Started:</b-col>
              <b-col>{{testDriveInfo.started | formatDateTime('dddd, YYYY/MM/DD HH:mm:ss')}}</b-col>
            </b-row>

            <b-row>
              <b-col cols="2">Ended:</b-col>
              <b-col>{{testDriveInfo.ended | formatDateTime('dddd, YYYY/MM/DD HH:mm:ss')}}</b-col>
            </b-row>
            </div>
          </b-container>
        </b-card>
    </b-col>
    <b-row align-v="end" class="mb-3">
      <b-col><b-button @click="download()" variant="primary" size="lg">Download .csv </b-button></b-col>
      <b-col cols="4"></b-col>
    </b-row></b-row>

    <!-- sensor deselection -->

    <b-row class="mb-3"><b-col>
      <b-card header="Chosen sensors">
        <b-container fluid>
          <b-row><b-col>
            <b-table striped hover responsive :busy="streams.isLoading" :fields="streams.columns" :items="streams.values">
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <b-spinner type="grow" class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>

              <template v-slot:cell(actions)="row">
                <b-button-toolbar>
                  <b-button @click="deselectSensor(row.item)" variant="danger" size="sm"> Remove </b-button>
                </b-button-toolbar>
            </template>
            </b-table>
          </b-col></b-row>
        </b-container>
      </b-card>
    </b-col></b-row>

    <!-- sensor selection -->

    <b-row class="mb-3"><b-col>
      <b-card header="NOT chosen sensors">
        <b-container fluid>
          <b-row><b-col>
            <b-table striped hover responsive :busy="deselsensors.isLoading" :fields="deselsensors.columns" :items="deselsensors.values">
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <b-spinner type="grow" class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>

              <template v-slot:cell(actions)="row">
                <b-button-toolbar>
                  <b-button @click="reselectSensor(row.item)" variant="primary" size="sm"> Add </b-button>
                </b-button-toolbar>
            </template>
            </b-table>
          </b-col></b-row>
        </b-container>
      </b-card>
    </b-col></b-row>

    <!-- TODO: add time selection -->
    <!-- <b-row class="mb-3" v-if="!isLoadingInfo"><b-col>
      <b-card header="Chosen drive time">
        <b-container fluid>
          <b-row class="mb-3">
            <b-col cols="1">
              <div style="position:absolute; right: -6px; top: 4px">
                <fa-icon icon="play" size="lg"></fa-icon>
              </div>
            </b-col>
            <b-col cols="11">
              <vue-slider style="margin-top:8px" tooltip="focus" tooltipPlacement="bottom"
                :tooltip-formatter="playbackControl.tooltipFormatter"
                :value="playbackControl.position" @change="applyPlaybackPosition" :min="playbackControl.min" :max="playbackControl.max">
                <template v-slot:dot>
                    <fa-icon icon="car-side" size="lg" transform="up-13 left-15"></fa-icon>
                </template>
              </vue-slider>

              <div style="position:absolute; right: -6px; top: -8px">
                <fa-icon icon="flag-checkered" size="lg"></fa-icon>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              End time: <fa-icon icon="clock"></fa-icon> {{ playbackControl.position | formatDateTime('HH:mm:ss') }}
            </b-col>
          </b-row>
        </b-container>
      </b-card>
    </b-col></b-row> -->
  </b-container>
</section>

</template>

<script>
import TestDriveRepository from 'repo/TestDriveRepository'
import dayjs from 'dayjs'
import { formatDateTime } from 'src/filters'

export default {
  name: 'TestDriveDetails',
  data: () => {
    return {
      isLoadingInfo: false,
      testDriveInfo: {},
      playbackControl: {
        isPlaying: false,
        min: 0,
        max: 100,
        position: 0,
        tooltipFormatter: (value) => {
          return formatDateTime(value, 'HH:mm:ss')
        }
      },
      streams: {
        isLoading: false,
        columns: [
          {
            key: 'name',
            sortable: true
          },
          {
            key: 'value_count',
            label: 'No. of values',
            sortable: true
          },
          {
            key: 'actions',
            label: '',
            sortable: false
          }
        ],
        values: []
      },
      deselsensors: {
        isLoading: false,
        columns: [
          {
            key: 'name',
            sortable: true
          },
          {
            key: 'value_count',
            label: 'No. of values',
            sortable: true
          },
          {
            key: 'actions',
            label: '',
            sortable: false
          }
        ],
        values: []
      },
      route: {
        isLoading: false,
        noRouteData: false,
        points: [],
        points_all: []
      }
    }
  },
  created () {
    this.fetch()
    this.fetchStreams()
  },
  computed: {
    testDriveId () {
      return this.$router.currentRoute.params.id
    }
  },
  methods: {
    async fetch () {
      try {
        this.isLoadingInfo = true
        const { data } = await TestDriveRepository.get(this.testDriveId)

        this.testDriveInfo = data

        this.playbackControl.min = dayjs(data.started).valueOf()
        this.playbackControl.max = dayjs(data.ended).valueOf()
        this.applyPlaybackPosition(this.playbackControl.max)
      } finally {
        this.isLoadingInfo = false
      }
    },
    async fetchStreams () {
      try {
        this.streams.isLoading = true
        const { data } = await TestDriveRepository.getRecordedStreams(this.testDriveId)

        this.streams.values = data
      } finally {
        this.streams.isLoading = false
      }
    },
    step () {
      setTimeout(() => {
        // check if playback was already cancelled
        if (this.playbackControl.isPlaying) {
          // add one second
          // todo: custom playback speed
          this.applyPlaybackPosition(this.playbackControl.position + 1000)
        }

        if (this.playbackControl.position === this.playbackControl.max) {
          this.playbackControl.isPlaying = false
        }

        if (this.playbackControl.isPlaying) {
          this.play()
        }
      }, this.playbackControl.playbackSpeed)
    },
    applyPlaybackPosition (value) {
      this.playbackControl.position = value

      // filter route points
      this._applyPlaybackPositionToRoute(value)
    },
    _applyPlaybackPositionToRoute (value) {
      if (value === this.playbackControl.max) {
        // show all points
        this.route.points = this.route.points_all
      } else {
        this.route.points = this.route.points_all.filter(p => p[2] <= value)
      }
    },
    deselectSensor (sensor) {
      this.deselsensors.values.push(sensor)
      const index = this.streams.values.indexOf(sensor)
      this.streams.values.splice(index, 1)
    },
    reselectSensor (sensor) {
      this.streams.values.push(sensor)
      const index = this.deselsensors.values.indexOf(sensor)
      this.deselsensors.values.splice(index, 1)
    },

    /*    async getdownloaddata () {
      const { data } = await TestDriveRepository.getRecordedStreams(this.testDriveId)
      var filename = 'hello.txt'
      this.download(data, filename)
    }, */

    async download () {
      var text = ''
      var filename = this.testDriveId + '.csv'
      for (var item of this.streams.values) {
        var senID = item.id.valueOf()
        const { data } = await TestDriveRepository.getStream(this.testDriveId, senID)
        for (var i = 0; i < data.values.length; i++) {
          text += senID + ';' + data.values[i].timestamp + ';' + data.values[i].value + ';' + '\n'
        }
        text += '\n'
      }
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }
  }
}
</script>

<style scoped>
 .custom-tooltip {
    width: 100px;
    transform: translateY(-6px);
  }
  .custom-tooltip.focus {
    font-weight: bold;
  }
</style>
