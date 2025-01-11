<template>
  <div class="info-box">
    <span :class="['info-box-icon', colorClass]">
      <fa-icon :icon="iconName"></fa-icon>
    </span>
    <div class="info-box-content">
      <span class="info-box-text">{{text}}</span>
      <b-spinner small v-if="!number" type="grow"></b-spinner>
      <span v-else class="info-box-number">{{number | formatWithThousandSep}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoBox',
  props: {
    text: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      default: null
    },
    iconName: {
      type: String,
      default: ''
    },
    colorClass: {
      type: String,
      default: 'bg-default'
    }
  }
}
</script>
<style scoped>
.info-box {
  cursor: pointer;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
</style>
