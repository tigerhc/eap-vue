<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" :limit="15" url="rw/wodplanlog">
      <w-table-col name="wodId" label="工单号" align="center" />
      <w-table-col name="eqpId" label="设备号" align="center" query condition="eq" />
      <w-table-col name="planType" label="工单类型" align="center" />
      <w-table-col name="planStatus" label="工单状态" align="center" />
      <w-table-col name="dealType" label="处理方式" align="center" />
      <w-table-col name="remarks" label="备注" align="center" />
      <w-table-col name="createBy" label="创建者" align="center" />
      <w-table-col name="createDate" label="创建时间" align="center" query querymode="date" condition="between" />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="exports" hidden />
      <w-table-toolbar name="clean" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'OrderLog',
  data() {
    return {
      table: {
        opHide: true
      }
    }
  },
  methods: {}
}
</script>
