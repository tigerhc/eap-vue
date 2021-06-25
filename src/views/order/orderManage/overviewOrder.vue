<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/rw/rwplanhis/rwplanhislist">
      <w-table-col name="id" label="工单号" align="left" query hidden />
      <w-table-col name="planId" label="（计划、报警）编号" align="left" />
      <w-table-col name="eqpId" label="设备编号" align="left" query querymode="select" />
      <w-table-col name="assignedUser" label="指派人" align="left" />
      <w-table-col name="designee" label="被指派人" align="left" />
      <w-table-col name="assignedTime" label="指派时间" align="left" query querymode="date" condition="between" />
      <w-table-col name="dealTime" label="处理时间" align="left" query querymode="date" condition="between" />
      <w-table-col
        name="planStatus"
        label="工单状态"
        align="left"
        query
        querymode="select"
        dict="PLAN_STATUS"
        condition="eq"
      />
      <w-table-col
        name="planType"
        label="工单类型"
        align="left"
        query
        querymode="select"
        dict="PLAN_TYPE"
        condition="eq"
      />
      <w-table-col name="flag" label="是否查询历史数据" align="left" query querymode="select" hidden dict="SFYN" />
      <w-table-col name="dealAdvice" label="处理意见" align="left" />
      <w-table-col name="dealDesc" label="处理描述" align="left" />
      <w-table-col name="endDate" label="归档时间" align="left" />
      <w-table-col name="officeId" label="组织机构" align="left" query dept hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="clean" hidden />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      table: {}
    }
  },
  methods: {}
}
</script>

<style  scoped>
</style>
