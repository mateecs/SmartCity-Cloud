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
        <b-table fixed striped hover responsive :fields="columns" :items="vehicles" primary-key="id" :busy="isLoadingItems"
                  :current-page="currentPage" :per-page="perPage" :filter="filter"
                  @filtered="onFiltered">

          <!-- template for the status row -->
          <template v-slot:cell(status)="row">
              <fa-icon icon="circle" style="color:green"></fa-icon>

              <!-- show this when vehicle is currently recording data -->
              <!--<b-spinner small type="grow" variant="warning"></b-spinner>-->
              {{row.item.status}}
          </template>
          <!-- template for the action column -->
          <template v-slot:cell(actions)="row">
            <b-button-toolbar>
              <b-btn-group>
                <b-button variant="primary" size="sm" @click="$router.push(`drives?vehicle=${row.item.id}`)"> <fa-icon icon="chart-area"></fa-icon> Drives </b-button>
                <b-button variant="primary" size="sm" @click="$router.push(`vehicles/${row.item.id}/config`)"> <fa-icon icon="edit"></fa-icon> Configure </b-button>
                <b-dropdown right variant="outline-primary">
                  <b-dropdown-item variant="danger" v-on:click="deleteVehicle(row)"><fa-icon icon="trash"></fa-icon> Delete</b-dropdown-item>
                </b-dropdown>
              </b-btn-group>
            </b-button-toolbar>
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
        <button class="btn btn-primary" v-on:click="showCreateVehicleDialog"><fa-icon icon="plus"></fa-icon> New vehicle </button>
      </b-col>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows"
                      :per-page="perPage" align="fill" size="sm"></b-pagination>
      </b-col>
    </b-row>
  </b-container>

    <b-modal ref="new-vehicle-modal" title="Add new vehicle">
      <section class="content">
        <label class="control-label" for="newVehicle_type"> Type: </label>
        <input class="form-control" id="newVehicle_type" placeholder="" type="text" v-model="newVehicle.type">
        <br>
        <label class="control-label" for="newVehicle_vin"> VIN / Identifier </label>
        <input class="form-control" id="newVehicle_vin" placeholder="" type="text" v-model="newVehicle.vin">
        <br>
        <label class="control-label" for="newVehicle_name"> Name </label>
        <input class="form-control" id="newVehicle_name" placeholder="" type="text" v-model="newVehicle.name">
      </section>

      <template v-slot:modal-footer>
        <button class="btn btn-primary float-right" v-on:click="createNewVehicle"> Add </button>
        <button class="btn btn-secondary float-right" v-on:click="closeCreateVehicleDialog"> Cancel </button>
      </template>
    </b-modal>
  </section>
</template>
<script>
import VehicleRepository from '../../repo/VehicleRepository'

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
          key: 'type',
          sortable: true
        },
        {
          key: 'vin',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }],
      vehicles: [],
      newVehicle: {
        type: '',
        vin: '',
        name: ''
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
      this.isLoadingItems = true
      const { data } = await VehicleRepository.list()

      this.vehicles = data
      this.totalRows = this.vehicles.length
      this.isLoadingItems = false
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async createNewVehicle () {
      const { data } = await VehicleRepository.createVehicle(this.newVehicle)
      // indicate the new row by changing its background color
      data._rowVariant = 'warning'
      // remove the filter so that the user can see
      // the new row
      this.filter = ''
      this.vehicles.unshift(data)
      this.totalRows++

      this.closeCreateVehicleDialog()
    },
    showCreateVehicleDialog () {
      // reset model
      this.newVehicle.type = ''
      this.newVehicle.vin = ''
      this.newVehicle.name = ''

      this.$refs['new-vehicle-modal'].show()
    },
    closeCreateVehicleDialog () {
      this.$refs['new-vehicle-modal'].hide()
    },
    async deleteVehicle (row) {
      // todo: should this be allowed at all?
      // at last ask the user with a prompt

      var id = row.item.id
      await VehicleRepository.deleteVehicle(id)

      var index = this.vehicles.map(x => {
        return x.Id
      }).indexOf(id)

      this.vehicles.splice(index, 1)
    }
  }
}
</script>
