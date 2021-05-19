<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="">
      <w-table-col name="id" label="ID" align="left" />
      <w-table-col name="eqpId" label="设备编号" align="left" />
      <w-table-col name="collectType" label="采集方式" align="left" />
      <w-table-col name="collectType" label="采集方式" align="left" />
      <w-table-col name="lastNum" label="上次示数" align="left" />
      <w-table-col name="thisNum" label="本次示数" align="left" />
      <w-table-col name="numMultiple" label="计数比" align="left" />
      <w-table-col name="numType" label="示数类型" align="left" />
      <w-table-col name="alarmFlag" label="是否警报" align="left" />
      <w-table-col name="alarmCode" label="警报类型" align="left" />
      <w-table-col name="endDate" label="归档时间" align="left" />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return { table: {}}
  },
  methods: {}
}
</script>

<style  scoped>
</style>
