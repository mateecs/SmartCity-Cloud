<template>
<section class="content">
  <b-container fluid class="box">
    <b-row align-h="end">
      <b-col cols="6" style="padding-top:5px">
        <b-form-group
          label="Filter"
          label-cols-sm="2"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
        <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder=""
              @keydown.enter.native="search(filter)"
            ></b-form-input>
            <b-input-group-append>
              <b-button @click="search(filter)">Show</b-button>
              <b-button :disabled="!filter" @click="search('')">Clear</b-button>
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
                <b-button variant="primary" size="sm" @click="$router.push(`export/${row.item.id}`)"> <fa-icon icon="chart-area"></fa-icon> Choose Sensors </b-button>
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
import TestDriveRepository from 'repo/TestDriveRepository'
import { formatDateTime } from 'src/filters'

export default {
  name: 'Vehicles',
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
      const { data } = await TestDriveRepository.list(page, this.perPage, this.filter)

      this.drives = data.drives
      this.totalRows = data.drive_count
      this.isLoadingItems = false
    },
    search (filter) {
      this.filter = filter
      this.fetch(1)
    },
    pageChanged (page) {
      this.fetch(page)
    }
  }
}
</script>
