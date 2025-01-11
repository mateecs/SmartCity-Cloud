<template>
<section class="content">
  <b-container fluid class="box">
    <b-row align-h="end"  style="padding-top:5px;padding-bottom:5px">
      <b-col cols="12" align-self="center">
        <b-form-group
          label="Filter"
          label-cols-sm="2"
          label-align-sm="right"
          label-size="sm"
          label-for="filterGroup"
          class="mb-0"
        >

        <b-input-group size="sm" id="filterGroup">
            <b-form-select v-model="state_filter" :options="state_options" />
            <datepicker v-model="dateRange" lang="en" :range=true placeholder="Filter by date range" style="margin-left:5px" />
            <b-form-input
              v-model="filter"
              type="search"
              placeholder="Filter by text"
              @keydown.enter.native="search()"
              style="margin-left:5px"
            ></b-form-input>
            <b-input-group-append>
              <b-button @click="search"><fa-icon icon="filter"></fa-icon> Show</b-button>
              <b-button @click="clearFilter"><fa-icon icon="trash"></fa-icon> Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-table fixed striped hover responsive :fields="columns" :items="drives" primary-key="id">

          <!-- template for the status row -->
          <template v-slot:cell(status)="row">
              <fa-icon v-if="row.item.status == 'unknown'" icon="circle" style="color:red"></fa-icon>
              <b-spinner v-if="row.item.status == 'running'" small type="grow" variant="warning"></b-spinner>
              <fa-icon v-if="row.item.status == 'finished'" icon="circle" style="color:green"></fa-icon>

              <!-- show this when test drive is currently recording data -->
              <!--<b-spinner small type="grow" variant="warning"></b-spinner>-->
              {{row.item.status}}
          </template>
          <!-- template for the action column -->
          <template v-slot:cell(actions)="row">
            <b-button-toolbar>
              <b-btn-group>
                <b-button variant="primary" size="sm" @click="$router.push(`drives/${row.item.id}`)"> <fa-icon icon="chart-area"></fa-icon> Show data </b-button>
              </b-btn-group>
            </b-button-toolbar>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-row>
      <b-col><div v-if="isLoadingItems" class="text-center my-2">
              <b-spinner type="grow" class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div></b-col>
      <b-col>
        <b-pagination align="fill" size="sm"
                      v-model="currentPage" :total-rows="totalRows"
                      :per-page="perPage" @change="pageChanged"
                      first-number last-number></b-pagination>
      </b-col>
    </b-row>
  </b-container>
  </section>
</template>
<script>
import TestDriveRepository from 'src/repo/TestDriveRepository'
import { formatDateTime } from 'src/filters'

import 'assets/css/vuedatepickerui-custom.css'
import VueDatepickerUi from 'vue-datepicker-ui'

export default {
  name: 'TestDrives',
  components: {
    datepicker: VueDatepickerUi
  },
  data: () => {
    return {
      isLoadingItems: false,
      columns: [
        {
          key: 'status',
          sortable: true
        },
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'vehicle_name',
          label: 'Vehicle',
          sortable: true
        },
        {
          key: 'started',
          sortable: true,
          formatter: (value, key, item) => {
            return formatDateTime(value, 'YYYY/MM/DD HH:mm:ss')
          }
        },
        {
          key: 'ended',
          sortable: true,
          formatter: (value, key, item) => {
            return formatDateTime(value, 'YYYY/MM/DD HH:mm:ss')
          }
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }],
      drives: [],
      state_filter: 'all',
      state_options: [
        { value: 'all', text: 'All recordings' },
        { value: 'finished', text: 'Only finished recordings' },
        { value: 'running', text: 'Only running recordings' }
      ],
      dateRange: [],
      filter: '',
      // pagination
      currentPage: 1,
      totalRows: 1,
      perPage: 10
    }
  },
  mounted () {

  },
  created () {
    this.fetch(1)
  },
  methods: {
    async fetch (page) {
      this.isLoadingItems = true
      const { data } = await TestDriveRepository.list(page, this.perPage, this.state_filter, this.filter, this.dateRange)

      this.drives = data.drives
      this.totalRows = data.drive_count
      this.isLoadingItems = false
    },
    search () {
      this.fetch(1)
    },
    clearFilter () {
      this.filter = ''
      this.dateRange = []
      this.search()
    },
    pageChanged (page) {
      this.fetch(page)
    }
  }
}
</script>

<style scoped>
  .v-calendar .input-field input {
    height: calc(1.5em + 0.5rem + 2px)
  }
</style>
