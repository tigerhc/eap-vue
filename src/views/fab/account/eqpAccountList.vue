<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/ms/fabequipmentaccount" sort="date.desc" >
      <w-table-col name="eqpId" label="设备号" sort fixed align="center" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="eqpName" label="设备名称" align="left" />
      <w-table-col name="projectName" label="内容" align="left" />
      <w-table-col name="lotNo" label="批次" align="center" />
      <w-table-col name="number" label="片数" align="center" />
      <w-table-col name="startTime" label="开始时间" align="center" sort="1"/>
      <w-table-col name="endTime" label="结束时间" align="center" sort="1"/>
      <w-table-col name="date" label="日期" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-col name="person" label="操作员" align="center" sort />
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'FabEqptAccountList',
  data() {
    return {
      table: {
        opHide: true
      }
    }
  },
  methods: {
  }
}
</script>
