<template>
<section class="content">
    <b-container v-if="isLoadingItems">
        <b-row class="text-center"><b-col>
        <b-spinner type="grow"></b-spinner>
        Loading...
        </b-col></b-row>
    </b-container>
    <div v-else>
      <b-card header="General properties" style="margin-bottom:10px">
        <b-container>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Id" label-cols-sm="2" label-align-sm="left"
                label-size="sm" label-for="field_id" class="mb-0">
            <b-input-group size="sm">
                <b-form-input readonly id="field_id" type="text" v-model="vehicleInfo.id"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Name" label-cols-sm="2" label-align-sm="left"
                label-size="sm" label-for="field_name" class="mb-0">
            <b-input-group size="sm">
                <b-form-input id="field_name" type="text" v-model="vehicleInfo.name"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="VIN" label-cols-sm="2" label-align-sm="left"
                label-size="sm" label-for="field_vin" class="mb-0">
            <b-input-group size="sm">
                <b-form-input id="field_vin" type="text" v-model="vehicleInfo.vin"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
          </b-container>
        </b-card>

        <b-card header="Attached sensors" style="margin-bottom:10px">
          <b-container>
              <b-row><b-col>
                  <b-table fixed :fields="columns_sensors" :items="attachedSensors">
                      <template v-slot:cell(actions)="row">
                      <b-button-toolbar>
                      <b-btn-group>
                          <b-button v-if="!row.item.toRemove && !row.item.isNew" variant="danger" v-on:click="removeSensor(row.item)"><fa-icon icon="trash"></fa-icon> Remove</b-button>
                          <b-button v-if="row.item.toRemove" variant="outline-danger" v-on:click="keepSensor(row.item)"><fa-icon icon="undo"></fa-icon> Undo remove</b-button>
                          <b-button v-if="row.item.isNew" variant="outline-warning" v-on:click="removeSensor(row.item)"><fa-icon icon="undo"></fa-icon> Undo add</b-button>
                      </b-btn-group>
                      </b-button-toolbar>
                  </template>
                  </b-table>
              </b-col></b-row>
              <b-row>
                  <b-col><autocomplete ref="sensorSearchField" :search="searchSensor" :get-result-value="getSensorDisplayValue" @submit="addSensor" autoSelect placeholder="Add sensor by name"></autocomplete ></b-col>
                  <!--<b-col><b-button variant="primary"><fa-icon icon="plus" style="margin-right:5px"></fa-icon>Add sensor</b-button></b-col>-->
              </b-row>
          </b-container>
        </b-card>
        <b-card header="Registered Tokens" style="margin-bottom:10px">
          <b-container>
              <b-row><b-col>
                  <b-table fixed :fields="columns_tokens" :items="registeredTokens">
                    <template v-slot:cell(actions)="row">
                      <b-button-toolbar>
                        <b-btn-group>
                           <b-button variant="primary" size="sm" @click="showToken(row.item.value)"> Show Token </b-button>
                          <b-button variant="primary" size="sm" @click="$router.replace(`/tokens/${row.item.id}/config`)"> <fa-icon icon="edit"></fa-icon> Configure </b-button>
                        </b-btn-group>
                      </b-button-toolbar>
                    </template>
                  </b-table>
              </b-col></b-row>
          </b-container>
        </b-card>

    <b-modal ref="show-token-modal" title="Token">
        <section class="content">
          <label class="control-label" for="Token_value"> Token : </label>
          <input readonly class="form-control" id="Token_Value" type="text" v-model="Tvalue">
        </section>

        <template v-slot:modal-footer>
          <button class="btn btn-secondary float-right" v-on:click="closeTokenDialog"> Cancel </button>
        </template>
    </b-modal>

        <b-container class="box" style="padding-top: 10px;padding-bottom: 10px;">
            <b-row>
              <b-col>
                <b-spinner v-if="isSaving" type="grow" variant="primary" />
                <b-button v-else variant="primary" @click="saveChanges">Save changes</b-button>

                <div v-if="!isSaving && saveResultMessage">
                  {{ saveResultMessage }}
                </div>
              </b-col>
            </b-row>
        </b-container>
    </div>
</section>

</template>
<script>

import VehicleRepository from 'repo/VehicleRepository'
import SensorRepository from 'repo/SensorRepository'

import autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

export default {
  name: 'VehicleConfiguration',
  components: {
    autocomplete
  },
  data: () => {
    return {
      isLoadingItems: true,
      columns_sensors: [
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
      columns_tokens: [
        {
          key: 'comment',
          sortable: true
        },
        {
          key: 'expires',
          sortable: true
        },
        {
          key: 'actions',
          label: '',
          sortable: false
        }],
      vehicleInfo: null,
      attachedSensors: [],
      Tvalue: null,
      isSaving: false,
      saveResultMessage: ''
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    async fetch () {
      this.isLoadingItems = true
      const { data } = await VehicleRepository.getConfiguration(this.vehicleId)

      this.vehicleInfo = data.vehicle
      this.attachedSensors = data.attached_sensors
      this.registeredTokens = data.tokens
      Array.prototype.forEach.call(this.attachedSensors, element => {
        element.isNew = false
        element.toRemove = false
        element._rowVariant = ''
      })

      this.isLoadingItems = false
    },
    async searchSensor (input) {
      if (input.length < 1) { return [] }
      const { data } = await SensorRepository.search(input)
      return data
    },
    addSensor (sensor) {
      const newSensor = {}
      Object.assign(newSensor, sensor)
      newSensor._rowVariant = 'warning'
      newSensor.isNew = true
      this.attachedSensors.push(newSensor)
      // reset the search field
      this.$refs.sensorSearchField.setValue('')
    },
    removeSensor (sensor) {
      if (sensor.isNew) {
        // remove directly because it is not in the database yet
        var index = this.attachedSensors.indexOf(sensor)
        this.attachedSensors.splice(index, 1)
      } else {
        // mark sensor for removal
        sensor._rowVariant = 'danger'
        sensor.toRemove = true

        this.$forceUpdate()
      }
    },
    keepSensor (sensor) {
      // delete the remove flag form the sensor
      sensor._rowVariant = ''
      sensor.toRemove = false

      this.$forceUpdate()
    },
    getSensorDisplayValue (s) {
      return s.description + ' (' + s.id + ')'
    },
    async showToken (tokenValue) {
      this.Tvalue = tokenValue
      this.$refs['show-token-modal'].show()
    },
    async closeTokenDialog () {
      this.$refs['show-token-modal'].hide()
    },
    async saveChanges () {
      this.isSaving = true
      this.saveResultMessage = ''

      var data = {
        name: this.vehicleInfo.name,
        vin: this.vehicleInfo.vin,
        sensors: {
          to_add: [],
          to_remove: []
        }
      }
      // sensors to add
      this.attachedSensors.filter(s => s.isNew).forEach(s => data.sensors.to_add.push(s.id))
      // sensors to remove
      this.attachedSensors.filter(s => s.toRemove).forEach(s => data.sensors.to_remove.push(s.id))

      try {
        await VehicleRepository.updateConfiguration(this.vehicleInfo.id, data)

        this.attachedSensors.filter(s => s.isNew).forEach(s => {
          s.isNew = false
          s._rowVariant = ''
        })
        this.attachedSensors.filter(s => s.toRemove).forEach(s => {
          s.isNew = true
          this.removeSensor(s)
        })

        this.saveResultMessage = 'Changes saved successfully'
        this.$forceUpdate()
      } catch (error) {
        this.saveResultMessage = 'Changes could not be saved'
      } finally {
        this.isSaving = false
      }
    }
  },
  computed: {
    vehicleId () {
      return this.$router.currentRoute.params.id
    }
  }
}
</script>
<style scoped>

</style>
