<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/edc/edcamsrecord" sort="startDate.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="alarmCode" label="报警编码" width="120" align="left" query condition="like"/>
      <w-table-col name="alarmName" label="报警名称" align="left" />
      <w-table-col name="lotNo" label="批次" align="center" width="100" />
      <w-table-col name="lotYield" label="批次产量" width="80" align="center" />
      <w-table-col name="startDate" label="报警开始时间" width="200" align="center" sort="1" query querymode="date" condition="gt"/>
      <w-table-col name="endDate" label="报警结束时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
    </w-table>
  </div>
</template>

<script>
// import request from '@/utils/request'
export default {
  name: 'Edcamsrecord',
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
