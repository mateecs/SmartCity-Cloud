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
                <b-form-input readonly id="field_id" type="text" v-model="sensorInfo.id"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Name" label-cols-sm="2" label-align-sm="left"
                label-size="sm" label-for="field_name" class="mb-0">
            <b-input-group size="sm">
                <b-form-input id="field_name" type="text" v-model="sensorInfo.description"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Unit" label-cols-sm="2" label-align-sm="left" label-size="sm" label-for="field_unit" class="mb-0">
                    <b-input-group size="sm">
                        <b-form-input id="field_unit" type="text" v-model="sensorInfo.unit"></b-form-input>
                    </b-input-group>
                </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Data type" label-cols-sm="2" label-align-sm="left" label-size="sm" label-for="field_datatype" class="mb-0">
                    <b-input-group size="sm">
                        <b-form-input id="field_datatype" type="text" v-model="sensorInfo.datatype"></b-form-input>
                    </b-input-group>
                </b-form-group>
            </b-col></b-row>
            </b-container>
        </b-card>

         <b-container fluid class="box" style="padding-top: 10px;padding-bottom: 10px;">
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
import SensorRepository from 'repo/SensorRepository'

export default {
  name: 'SensorConfiguration',
  components: {

  },
  data: () => {
    return {
      isLoadingItems: true,
      sensorInfo: null,
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
      const { data } = await SensorRepository.get(this.sensorId)

      this.sensorInfo = data
      this.isLoadingItems = false
    },
    async saveChanges () {
      this.isSaving = true
      this.saveResultMessage = ''

      var data = {
        description: this.sensorInfo.description,
        unit: this.sensorInfo.unit,
        datatype: this.sensorInfo.datatype
      }

      try {
        await SensorRepository.update(this.sensorId, data)

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
    sensorId () {
      return this.$router.currentRoute.params.id
    }
  }
}
</script>
