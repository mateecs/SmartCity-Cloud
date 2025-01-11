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
                <b-form-input readonly id="field_id" type="text" v-model="tokenInfo.id"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Comment" label-cols-sm="2" label-align-sm="left"
                label-size="sm" label-for="field_comment" class="mb-0">
            <b-input-group size="sm">
                <b-form-input id="field_comment" type="text" v-model="tokenInfo.comment"></b-form-input>
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
            <b-row style="padding-bottom:10px;"><b-col>
                <b-form-group label="Expires" label-cols-sm="2" label-align-sm="left"
                label-size="sm" label-for="field_expires" class="mb-0">
            <b-input-group size="sm">
                <datepicker id="field_expires" v-model="tokenInfo.expires" lang="en" />
                <!--<b-form-input id="field_expires" type="text" v-model="tokenInfo.expires"></b-form-input> -->
            </b-input-group>
            </b-form-group>
            </b-col></b-row>
          </b-container>
        </b-card>

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
import TokenRepository from 'repo/TokenRepository'
import 'assets/css/vuedatepickerui-custom.css'
import VueDatepickerUi from 'vue-datepicker-ui'
import dayjs from 'dayjs'

export default {
  name: 'TokenConfiguration',
  components: {
    datepicker: VueDatepickerUi
  },
  data: () => {
    return {
      isLoadingItems: true,
      tokenInfo: null,
      isSaving: false,
      saveResultMessage: ''
      // date: '2019-01-01'
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    async fetch () {
      this.isLoadingItems = true
      const { data } = await TokenRepository.getConfiguration(this.tokenId)

      this.tokenInfo = data.token

      this.isLoadingItems = false
    },
    async saveChanges () {
      this.isSaving = true
      this.saveResultMessage = ''

      var data = {
        comment: this.tokenInfo.comment,
        expires: dayjs(this.tokenInfo.expires).format('YYYY-MM-DD')
      }
      try {
        await TokenRepository.updateConfiguration(this.tokenInfo.id, data)

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
    tokenId () {
      return this.$router.currentRoute.params.id
    }
  }
}
</script>
<style scoped>

</style>
