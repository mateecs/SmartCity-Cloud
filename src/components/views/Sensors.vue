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
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-table fixed striped hover responsive :fields="columns" :items="sensors" primary-key="id" :busy="isLoadingItems"
                  :current-page="currentPage" :per-page="perPage" :filter="filter"
                  @filtered="onFiltered">

          <!-- template for the action row -->
          <template v-slot:cell(actions)="row">
            <div class="btn-toolbar" role="toolbar">
              <div class="btn-group mr-2" role="group">
                <button class="btn btn-primary btn-sm" @click="$router.push(`sensors/${row.item.id}/config`)"> <fa-icon icon="edit"></fa-icon> Edit </button>
              </div>
              <div class="btn-group" role="group">
                <button class="btn btn-danger btn-sm" v-on:click="deleteSensor(row)"> <fa-icon icon="trash"></fa-icon> Delete </button>
              </div>
            </div>
          </template>

          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner type="grow" class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <button class="btn btn-primary" v-on:click="showCreateSensorDialog"><fa-icon icon="plus"></fa-icon> New sensor </button>
      </b-col>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows"
                      :per-page="perPage" align="fill" size="sm"></b-pagination>
      </b-col>
    </b-row>
  </b-container>

    <b-modal ref="new-sensor-modal" title="Add new sensor">
      <section class="content">
        <label class="control-label" for="newSensor_description"> Name / Description </label>
        <input class="form-control" id="newSensor_description" placeholder="" type="text" v-model="newSensor.description">
        <br>
        <label class="control-label" for="newSensor_unit"> Unit </label>
        <input class="form-control" id="newSensor_unit" placeholder="" type="text" v-model="newSensor.unit">
        <br>
        <label class="control-label" for="newSensor_datatype"> Data type </label>
        <input class="form-control" id="newSensor_datatype" placeholder="" type="text" v-model="newSensor.datatype">
      </section>

      <template v-slot:modal-footer>
        <button class="btn btn-primary float-right" v-on:click="createNewSensor"> Add </button>
        <button class="btn btn-secondary float-right" v-on:click="closeCreateSensorDialog"> Cancel </button>
      </template>
    </b-modal>
  </section>
</template>
<script>
import SensorRepository from '../../repo/SensorRepository'

export default {
  name: 'Sensors',
  data: () => {
    return {
      isLoadingItems: false,
      columns: [
        {
          key: 'id',
          sortable: true
        },
        {
          key: 'description',
          sortable: true
        },
        {
          key: 'unit',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }],
      sensors: [],
      newSensor: {
        description: '',
        unit: ''
      },
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
    this.fetch()
  },
  methods: {
    async fetch () {
      try {
        this.isLoadingItems = true
        const { data } = await SensorRepository.list()

        this.sensors = data
        this.totalRows = this.sensors.length
      } finally {
        this.isLoadingItems = false
      }
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async createNewSensor () {
      const { data } = await SensorRepository.createSensor(this.newSensor)
      // indicate the new row by changing its background color
      data._rowVariant = 'warning'
      // remove the filter so that the user can see
      // the new row
      this.filter = ''
      this.sensors.unshift(data)
      this.totalRows++

      this.closeCreateSensorDialog()
    },
    showCreateSensorDialog () {
      // reset model
      this.newSensor.description = ''
      this.newSensor.unit = ''
      this.newSensor.datatype = 'FLOAT'

      this.$refs['new-sensor-modal'].show()
    },
    closeCreateSensorDialog () {
      this.$refs['new-sensor-modal'].hide()
    },
    async deleteSensor (row) {
      // todo: should this be allowed at all?
      // at least ask the user with a prompt

      var id = row.item.id
      await SensorRepository.deleteSensor(id)

      var index = this.sensors.map(x => {
        return x.Id
      }).indexOf(id)

      this.sensors.splice(index, 1)
    }
  }
}
</script>
