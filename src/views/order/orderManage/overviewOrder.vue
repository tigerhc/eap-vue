<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/rw/rwplanhis">
      <w-table-col name="id" label="工单号" align="center" query hidden condition="eq" />
      <w-table-col name="planId" label="（计划、报警）编号" align="center" />
      <w-table-col name="eqpId" label="设备编号" align="center" query querymode="select" />
      <w-table-col name="assignedUser" label="指派人" align="center" />
      <w-table-col name="designee" label="被指派人" align="center" />
      <w-table-col name="assignedTime" label="指派时间" align="center" query querymode="date" condition="between" />
      <w-table-col name="dealTime" label="处理时间" align="center" query querymode="date" condition="between" />
      <w-table-col
        name="planStatus"
        label="工单状态"
        align="center"
        query
        querymode="select"
        dict="PLAN_STATUS"
        condition="eq"
      />
      <w-table-col
        name="planType"
        label="工单类型"
        align="center"
        query
        querymode="select"
        dict="PLAN_TYPE"
        condition="eq"
      />
      <w-table-col name="flag" label="是否查询历史数据" align="center" query querymode="select" hidden dict="SFYN" />
      <w-table-col name="dealAdvice" label="处理意见" align="center" />
      <w-table-col name="dealDesc" label="处理描述" align="center" />
      <w-table-col name="endDate" label="归档时间" align="center" />
      <w-table-col name="officeId" label="组织机构" align="center" query dept hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="clean" hidden />
    </w-table>
  </div>
</template>

<script>
// import request from '@/utils/request'

export default {
  components: {},
  data() {
    return {
      table: {
        opHide: true
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style  scoped>
</style>
