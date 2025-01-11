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
            <b-row align-v="center">
              <b-col cols="2">Labels:</b-col>
              <b-col>
                <b-form-tags input-id="labels-basic" tag-variant="success" v-model="labels" class="mb-2" separator="," placeholder="Add label"></b-form-tags>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="2">
                <b-button @click="save_labels" size="sm" variant="success">Save</b-button>
              </b-col>
            </b-row>
            </div>
          </b-container>
        </b-card>
    </b-col></b-row>

    <!-- map with route view -->
    <b-row class="mb-3"><b-col>
      <b-card header="Route">
        <b-container fluid>
          <b-row><b-col>
            <div v-if="route.isLoading" class="text-center">
              <b-spinner type="grow" size="sm" />Loading...
            </div>
            <div v-else>
              <p v-if="route.noRouteData" class="text-red">
                No route data has been recorded
              </p>
              <component v-else :is='"route-map"' :routeData="route.points" :position="playbackControl.position" />
            </div>
          </b-col></b-row>
        </b-container>
      </b-card>
    </b-col></b-row>

    <!-- playback control -->
    <b-row class="mb-3" v-if="!isLoadingInfo"><b-col>
      <b-card header="Playback control">
        <PlaybackControl @position-change-committed="applyPlaybackPosition"  @isplaying-change-committed="applyPlaybackIsPlaying"  @speed-change-committed="applyPlaybackSpeedCahnge" :position="playbackControl.position" :min="playbackControl.min" :max="playbackControl.max" :isPlaying="playbackControl.isPlaying" />
      </b-card>
    </b-col></b-row>

    <!-- sensor stream charts -->
    <b-row class="mb-3">
        <b-col v-for="chart in charts" v-bind:key="chart.id" class="mb-3" cols="6">
          <b-card :header="chart.sensor.name">
            <StreamViewComponent :testDriveId="testDriveId" :sensor="chart.sensor" :position="playbackControl.position" :isPlaying="playbackControl.isPlaying"  :playbackSpeed="playbackControl.speed" />
          </b-card>
        </b-col>
    </b-row>

    <b-row class="mb-3"><b-col>
      <b-card header="Recorded sensor streams">
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
                  <b-button-group class="mx-1">
                    <b-button @click="addChartForSensor(row.item)" variant="primary" size="sm"> <fa-icon icon="chart-area"></fa-icon> Show </b-button>
                  </b-button-group>
                  <b-button-group class="mx-1">
                    <b-button @click="showProcessingTasksForSensor(row.item)" variant="outline-primary" size="sm">
                      <fa-icon icon="microchip"></fa-icon> Run Data Processing
                    </b-button>

                    <b-modal ref="processingModal" title="Run Data Processing" size="lg" @ok="runSelectedComputeTasks">
                      <p class="my-4">The following processing tasks are available for sensor stream '{{ dataProcessingModal.selectedSensor?.name }}'.<br>Select the ones you want to run.</p>
                      <div v-if="dataProcessingModal.isLoading" class="text-center my-2">
                        <b-spinner type="grow" class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                      </div>
                      <b-table-simple v-else hover responsive>
                        <b-thead>
                          <b-tr>
                            <b-th>Task</b-th>
                            <b-th>Description</b-th>
                            <b-th>Parameters</b-th>
                          </b-tr>
                        </b-thead>
                        <b-tbody>
                          <b-tr v-for="task in dataProcessingModal.availableComputeTasks" v-bind:key="task.taskId">
                            <b-td><b-form-checkbox v-model="task.isSelected"> {{task.taskId}} </b-form-checkbox></b-td>
                            <b-td> {{ task.description }} </b-td>
                            <b-td>none</b-td>
                          </b-tr>
                        </b-tbody>
                      </b-table-simple>
                    </b-modal>
                  </b-button-group>
                </b-button-toolbar>
            </template>
            </b-table>
          </b-col></b-row>
        </b-container>
      </b-card>
    </b-col></b-row>

    <b-row class="mb-3"><b-col>
      <b-card header="Data Processing Tasks">
        <b-container fluid>
          <b-row><b-col>
            <b-table striped hover responsive :busy="computeTasks.isLoading" :fields="computeTasks.columns" :items="computeTasks.values">
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <b-spinner type="grow" class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>
            </b-table>
          </b-col></b-row>
          <b-row>
            <b-col>
              <b-button @click="updateComputeTasks" size="sm" variant="primary"><fa-icon icon="cogs"></fa-icon> Refresh</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card>
    </b-col></b-row>

    </b-container>
</section>

</template>

<script>
import TestDriveRepository from 'repo/TestDriveRepository'
import ComputeTaskRepository from 'repo/ComputeTaskRepository'
import dayjs from 'dayjs'

import { BFormTags } from 'bootstrap-vue'

import PlaybackControl from 'components/controls/DrivePlaybackControl.vue'
import StreamViewComponent from 'components/controls/StreamViewComponent.vue'

export default {
  name: 'TestDriveDetails',
  components: {
    BFormTags,
    'route-map': () => import('components/controls/RouteMap.vue'),
    PlaybackControl,
    StreamViewComponent,
  },
  data: () => {
    return {
      isLoadingInfo: false,
      testDriveInfo: {},
      original_labels: [],
      labels: [],
      dataProcessingModal: {
        isLoading: false,
        availableComputeTasks: [
        {
          "isSelected": false,
          "taskId": "sample-task",
          "description": "sample text"
        }
      ],
      },
      playbackControl: {
        isPlaying: false,
        min: 0,
        max: 100,
        position: 0,
        speed: 1000
      },
      route: {
        isLoading: false,
        noRouteData: false,
        points: []
      },
      charts: [],
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
      computeTasks: {
        isLoading: false,
        columns: [
          {
            key: 'status',
            label: 'Status',
            sortable: true
          },
          {
            key: 'name',
            label: 'Task name',
            sortable: true
          },
          {
            key: 'started',
            label: 'Started',
            sortable: true
          },
          {
            key: 'ended',
            label: 'Ended',
            sortable: true
          },
          {
            key: 'result',
            label: 'Result',
            sortable: false
          }
        ],
        values: []
      }
    }
  },
  created () {
    this.fetch()
    this.fetchStreams()
    this.fetchRoute()
    this.updateComputeTasks()
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

        const [responseInfo, responseLabels] = await Promise.all([TestDriveRepository.get(this.testDriveId), TestDriveRepository.getLabels(this.testDriveId)])

        this.testDriveInfo = responseInfo.data
        this.labels = responseLabels.data.labels
        if (!this.labels) {
          this.labels = []
        }
        // keep a copy for change detection
        this.original_labels = [...this.labels]

        this.playbackControl.min = dayjs(this.testDriveInfo.started).valueOf()
        this.playbackControl.max = dayjs(this.testDriveInfo.ended).valueOf()
        // this.applyPlaybackPosition(this.playbackControl.min)
        this.applyPlaybackPosition(this.playbackControl.max)
      } finally {
        this.isLoadingInfo = false
      }
    },
    async save_labels () {
      // determine the labels which have been added / removed
      const toadd = this.labels.filter(e => !this.original_labels.includes(e))
      const toremove = this.original_labels.filter(e => !this.labels.includes(e))

      if (toadd.length === 0 && toremove.length === 0) {
        return
      }

      TestDriveRepository.updateLabels(this.testDriveId, toadd, toremove)

      this.original_labels = [...this.labels]
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
    async fetchRoute () {
      try {
        this.route.isLoading = true
        const { data } = await TestDriveRepository.getRoute(this.testDriveId)

        const points = []

        this.route.noRouteData = (data.points.length === 0)

        for (var i = 0; i < data.points.length; i++) {
          points.push([
            data.points[i].lat,
            data.points[i].lon,
            dayjs(data.points[i].timestamp).valueOf()
          ])
        }

        // update the existing array, or binding fails
        this.route.points = points
      } finally {
        this.route.isLoading = false
      }
    },
    async updateComputeTasks () {
      try
      {
        this.computeTasks.isLoading = true
        this.computeTasks.values = []

        const { data } = await TestDriveRepository.getComputingTasks(this.testDriveId)
        this.computeTasks.values = data

      } finally {
        this.computeTasks.isLoading = false
      }
    },
    applyPlaybackPosition (value) {
      this.playbackControl.position = value
    },

    applyPlaybackIsPlaying (value) {
      this.playbackControl.isPlaying = value
    },

    applyPlaybackSpeedCahnge (value) {
      this.playbackControl.speed = value
    },

    addChartForSensor (sensor) {
      const chart = {
        sensor: sensor
      }
      this.charts.push(chart)
    },

    async getAvailableComputeTasks(sensor) {
      try
      {
        this.dataProcessingModal.isLoading = true
        this.dataProcessingModal.selectedSensor = sensor

        const { data } = await ComputeTaskRepository.list()
        for (var i in data) {
          const task = data[i]

          if (task.supportedStreamTypes.includes(sensor.datatype))
          {
            this.dataProcessingModal.availableComputeTasks.push({
              "isSelected": false,
              "taskId": task.taskId,
              "description": task.description
            })
          }
        }
      } finally {
        this.dataProcessingModal.isLoading = false
      }
    },

    async runSelectedComputeTasks() {
        const selectedTasks = this.dataProcessingModal.availableComputeTasks.filter(x => x.isSelected)
        for(var taskIdx in selectedTasks) {
          const task = selectedTasks[taskIdx]
          await ComputeTaskRepository.run(this.testDriveId, this.dataProcessingModal.selectedSensor.id, task.taskId)
        }

        this.updateComputeTasks()
    },

    showProcessingTasksForSensor (sensor) {
      this.dataProcessingModal.availableComputeTasks = []
      this.getAvailableComputeTasks(sensor)
      this.$refs.processingModal.show()
    }
  }
}
</script>
