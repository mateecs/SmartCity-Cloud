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
        <b-table fixed striped hover responsive :fields="columns" :items="drvsetups" primary-key="id" :busy="isLoadingItems"
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
                <b-button variant="primary" size="sm" @click="$router.push(`setting/${row.item.id}/config`)"> <fa-icon icon="edit"></fa-icon> Configure </b-button>
                <b-dropdown right variant="outline-primary">
                  <b-dropdown-item variant="danger" v-on:click="deleteSetup(row)"><fa-icon icon="trash"></fa-icon> Delete</b-dropdown-item>
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
        <button class="btn btn-primary" v-on:click="showCreateSetupDialog"><fa-icon icon="plus"></fa-icon> New Drive Setup </button>
      </b-col>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows"
                      :per-page="perPage" align="fill" size="sm"></b-pagination>
      </b-col>
    </b-row>
  </b-container>

    <b-modal ref="new-setup-modal" title="Add new Drive Setup">
      <section class="content">
        <label class="control-label" for="newSetup_type"> Name: </label>
        <input class="form-control" id="newSetup_type" placeholder="" type="text" v-model="newSetup.name">
        <br>
        <label class="control-label" for="newSetup_interval"> Interval: </label>
        <input class="form-control" id="newSetup_interval" placeholder="" type="text" v-model="newSetup.interval">
      </section>

      <template v-slot:modal-footer>
        <button class="btn btn-primary float-right" v-on:click="createNewSetup"> Add </button>
        <button class="btn btn-secondary float-right" v-on:click="closeCreateSetupDialog"> Cancel </button>
      </template>
    </b-modal>
  </section>
</template>
<script>
import DriveSetupRepository from 'repo/DriveSetupRepository'

export default {
  name: 'DriveSetups',
  data: () => {
    return {
      isLoadingItems: false,
      columns: [
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'interval',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }],
      drvsetups: [],
      newSetup: {
        name: '',
        interval: ''
      },
      filter: '',
      // pagination
      currentPage: 1,
      totalRows: 1,
      perPage: 5
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
      const { data } = await DriveSetupRepository.list()

      this.drvsetups = data
      this.totalRows = this.drvsetups.length
      this.isLoadingItems = false
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async createNewSetup () {
      const { data } = await DriveSetupRepository.createSetup(this.newSetup)
      // indicate the new row by changing its background color
      data._rowVariant = 'warning'
      // remove the filter so that the user can see
      // the new row
      this.filter = ''
      this.drvsetups.unshift(data)
      this.totalRows++

      this.closeCreateSetupDialog()
    },
    showCreateSetupDialog () {
      // reset model
      this.newSetup.name = ''
      this.newSetup.interval = ''

      this.$refs['new-setup-modal'].show()
    },
    closeCreateSetupDialog () {
      this.$refs['new-setup-modal'].hide()
    },
    async deleteSetup (row) {
      // todo: should this be allowed at all?
      // at last ask the user with a prompt

      var id = row.item.id
      await DriveSetupRepository.deleteSetup(id)

      var index = this.vehicles.map(x => {
        return x.Id
      }).indexOf(id)

      this.drvsetups.splice(index, 1)
    }
  }
}
</script>
