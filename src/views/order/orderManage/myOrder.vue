<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="">
      <w-table-col name="id" label="工单号" align="left" query querymode="select" />
      <w-table-col name="plan_id" label="（计划、报警）编号" align="left" />
      <w-table-col name="eqp_id" label="设备编号" align="left" query querymode="select" />
      <w-table-col name="assigned_user" label="指派人" align="left" />
      <w-table-col name="designee" label="被指派人" align="left" />
      <w-table-col name="assigned_time" label="指派时间" align="left" query querymode="date" condition="between" />
      <w-table-col name="deal_time" label="处理时间" align="left" query querymode="date" condition="between" />
      <w-table-col name="plan_status" label="工单状态" align="left" query querymode="select" />
      <w-table-col name="plan_type" label="工单类型" align="left" query querymode="select" />
      <w-table-col name="deal_advice" label="处理意见" align="left" />
      <w-table-col name="deal_desc" label="处理描述" align="left" />
      <w-table-col name="end_date" label="归档时间" align="left" />
      <w-table-button name="dispatch" icon="el-icon-document" label="派单" tip="派单" />
      <w-table-button name="receiveOrders" icon="el-icon-document-checked" label="接单" tip="接单" />
      <w-table-button name="endReport" icon="el-icon-document-delete" label="结束上报" tip="结束上报" />
      <w-table-button name="endOrders" icon="el-icon-document-delete" label="结束工单" tip="结束工单" />
      <w-table-button name="edit" hidden />
      <w-table-button name="delete" hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="clean" hidden />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  data() {
    return {
      table: {}
    }
  },
  mounted() {
    console.log('-------------------')
    console.log('username:' + this.$store.getters.roles)
  },
  methods: {}
}
</script>

<style  scoped>
</style>
