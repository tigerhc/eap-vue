<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="">
      <w-table-col name="id" label="ID" align="left" />
      <w-table-col name="eqp_id" label="设备编号" align="left" />
      <w-table-col name="collect_type" label="采集方式" align="left" />
      <w-table-col name="collect_type" label="采集方式" align="left" />
      <w-table-col name="last_num" label="上次示数" align="left" />
      <w-table-col name="this_num" label="本次示数" align="left" />
      <w-table-col name="num_multiple" label="计数比" align="left" />
      <w-table-col name="num_type" label="示数类型" align="left" />
      <w-table-col name="alarm_flag" label="是否警报" align="left" />
      <w-table-col name="alarm_code" label="警报类型" align="left" />
      <w-table-col name="end_date" label="归档时间" align="left" />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style  scoped>
</style>
