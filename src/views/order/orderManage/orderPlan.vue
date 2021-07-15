<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="rw/wodplanday">
      <w-table-col name="eqpId" label="设备编号" align="center" query condition="eq" />
      <w-table-col name="planType" label="工单类型" align="center" query condition="eq" />
      <w-table-col name="planCycle" label="工单周期" align="center" dict="PLAN_CYCLE" />
      <w-table-col name="effectDate" label="生效时间" align="center" query condition="eq" />
      <w-table-col name="remarks" label="备注" align="center" />
      <w-table-col name="createBy" label="创建人" align="center" />
      <w-table-col name="createDate" label="创建时间" align="center" />
      <w-table-col name="updateBy" label="更新人" align="center" />
      <w-table-col name="updateDate" label="更新时间" align="center" />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      table: {
        handler: {
          add: 'views/order/orderManage/orderPlanAdd',
          edit: 'views/order/orderManage/orderPlanAdd'
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
