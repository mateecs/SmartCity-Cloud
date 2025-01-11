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
        <b-table fixed striped hover responsive :fields="columns" :items="tokens" primary-key="id" :busy="isLoadingItems"
                  :current-page="currentPage" :per-page="perPage" :filter="filter"
                  @filtered="onFiltered">

<!--          <template v-slot:cell(value)="row">
            <b-button-toolbar>
              <b-btn-group>
                <b-button variant="primary" size="sm" @click="showToken(row.item.value)"> Show Token </b-button>-->
               <!-- <b-dropdown right variant="outline-primary">
                  <b-dropdown-item variant="danger" v-on:click="deleteToken(row)"><fa-icon icon="trash"></fa-icon> Delete</b-dropdown-item>
                </b-dropdown> -->
<!--              </b-btn-group>
            </b-button-toolbar>
          </template>-->

          <!-- template for the action column -->
          <template v-slot:cell(actions)="row">
            <b-button-toolbar>
              <b-btn-group>
                <b-button variant="primary" size="sm" @click="showToken(row.item.value)"> Show Token </b-button>
                <b-button variant="primary" size="sm" @click="$router.replace(`vehicles/${row.item.vhl_id}/config`)"> Show Vehicle </b-button>
                <b-button variant="primary" size="sm" @click="$router.push(`tokens/${row.item.id}/config`)"> <fa-icon icon="edit"></fa-icon> Configure </b-button>
               <b-dropdown right variant="outline-primary">
                  <b-dropdown-item variant="danger" v-on:click="deleteToken(row)"><fa-icon icon="trash"></fa-icon> Delete</b-dropdown-item>
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

    <b-modal ref="show-token-modal" title="Token">
      <section class="content">
        <label class="control-label" for="Token_value"> Token : </label>
        <input readonly class="form-control" id="Token_Value" type="text" v-model="Tvalue">
      </section>

      <template v-slot:modal-footer>
        <button class="btn btn-secondary float-right" v-on:click="closeTokenDialog"> Cancel </button>
      </template>
    </b-modal>

    <b-row>
      <b-col>
        <button class="btn btn-primary" v-on:click="showCreateTokenDialog"><fa-icon icon="plus"></fa-icon> New token </button>
      </b-col>
      <b-col>
        <b-pagination v-model="currentPage" :total-rows="totalRows"
                      :per-page="perPage" align="fill" size="sm"></b-pagination>
      </b-col>
    </b-row>
  </b-container>

    <b-modal ref="new-token-modal" title="Add new token">
      <section class="content">
        <label class="control-label" for="newToken_id"> Name / VIN: </label>
        <autocomplete ref="VehicleSearchField" :search="searchVehicle" :get-result-value="getVehicleDisplayValue" autoSelect placeholder="Add vehicle by name or VIN"></autocomplete >
        <!-- <input class="form-control" id="newToken_vin" placeholder="" type="text" v-model="newToken.vin"> -->
        <br>
        <label class="control-label" for="newToken_comment"> Comment : </label>
        <input class="form-control" id="newToken_comment" placeholder="" type="text" v-model="newToken.comment">
        <br>
        <label class="control-label" for="newToken_expires"> Expiration Date (double click input field): </label>
        <datepicker id="new_token_expires" v-model="newToken.expires" lang="en" />
      </section>

      <template v-slot:modal-footer>
        <button class="btn btn-primary float-right" v-on:click="createNewToken"> Add </button>
        <button class="btn btn-secondary float-right" v-on:click="closeCreateTokenDialog"> Cancel </button>
      </template>
    </b-modal>
  </section>
</template>
<script>

import TokenRepository from 'repo/TokenRepository'
import VehicleRepository from 'repo/VehicleRepository'

import 'assets/css/vuedatepickerui-custom.css'
import VueDatepickerUi from 'vue-datepicker-ui'

import autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

import dayjs from 'dayjs'

export default {
  name: 'Tokens',
  components: {
    datepicker: VueDatepickerUi,
    autocomplete
  },
  data: () => {
    return {
      isLoadingItems: false,
      columns: [
        {
          key: 'vin',
          sortable: true
        },
        {
          key: 'comment',
          sortable: false
        },
        {
          key: 'expires',
          sortable: true,
          formatter: value => {
            return dayjs(value).format('YYYY/MM/DD')
          }
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }],
      tokens: [],
      Tvalue: null,
      newToken: {
        vhl_id: '',
        comment: '',
        expires: null
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
      const { data } = await TokenRepository.list()

      this.tokens = data
      this.totalRows = this.tokens.length
      this.isLoadingItems = false
    },
    async showToken (tokenValue) {
      this.Tvalue = tokenValue
      this.$refs['show-token-modal'].show()
    },
    async closeTokenDialog () {
      this.$refs['show-token-modal'].hide()
    },
    async searchVehicle (input) {
      if (input.length < 1) { return [] }
      const { data } = await VehicleRepository.search(input)
      return data
    },
    getVehicleDisplayValue (v) {
      this.newToken.vhl_id = v.id
      return 'Name: ' + v.name + ' VIN: ' + v.vin + ' (' + v.id + ')'
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async createNewToken () {
      const tokenInfo = {
        vhl_id: this.newToken.vhl_id,
        comment: this.newToken.comment,
        expires: dayjs(this.newToken.expires).format('YYYY-MM-DD')
      }

      const { data } = await TokenRepository.createToken(tokenInfo)
      // indicate the new row by changing its background color
      data._rowVariant = 'warning'
      // remove the filter so that the user can see
      // the new row
      this.filter = ''
      this.tokens.unshift(data)
      this.totalRows++

      this.closeCreateTokenDialog()
    },
    showCreateTokenDialog () {
      // reset model
      this.newToken.vhl_id = ''
      this.newToken.comment = ''
      this.newToken.expires = null

      this.$refs['new-token-modal'].show()
    },
    closeCreateTokenDialog () {
      this.$refs['new-token-modal'].hide()
    },
    async deleteToken (row) {
      // todo: should this be allowed at all?
      // at last ask the user with a prompt

      var id = row.item.id
      await TokenRepository.deleteToken(id)

      var index = this.tokens.map(x => {
        return x.id
      }).indexOf(id)

      this.tokens.splice(index, 1)
    }
  }
}
</script>
