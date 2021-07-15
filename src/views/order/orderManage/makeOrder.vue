<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="">
      <w-table-col name="eqpId" label="设备编号" align="center" />
      <w-table-col name="planType" label="工单类型" align="center" />
      <w-table-col name="planCycle" label="工单周期" align="center" dict="PLAN_CYCLE" />
      <w-table-col name="planCycle" label="工单周期" align="center" />
      <w-table-col name="effectDate" label="生效时间" align="center" />
      <w-table-col name="remarks" label="备注" align="center" />
      <w-table-col name="createBy" label="创建人" align="center" />
      <w-table-col name="createDate" label="创建时间" align="center" />
      <w-table-col name="updateBy" label="更新人" align="center" />
      <w-table-col name="updateDate" label="更新时间" align="center" />
      <!-- <w-table-toolbar name="add" hidden /> -->
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="exports" hidden />
      <w-table-toolbar name="clean" hidden />
    </w-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      table: {
        handler: {
          add: 'views/order/orderManage/makeOrderEdit',
          edit: 'views/order/orderManage/makeOrderEdit'
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
      }
    }
  },
  methods: {}
}
</script>

<style  scoped>
</style>
