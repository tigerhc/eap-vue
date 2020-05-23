<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/mes/meslottrack" sort="startTime.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" dict2 sort fixed align="center" query condition="in"/>
      <w-table-col name="lotNo" label="批次号" width="100" align="center" query condition="like" />
      <w-table-col name="productionName" label="品名" align="center" />
      <w-table-col name="productionNo" label="品番" width="100" align="center" />
      <w-table-col name="orderNo" label="订单号" width="120" align="center" />
      <w-table-col name="lotYield" label="批次产量" width="80" align="right"/>
      <w-table-col name="lotYieldEqp" label="设备产量" width="80" align="right"/>
      <w-table-col name="startTime" label="开始时间" width="180" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-col name="endTime" label="结束时间" width="180" align="center" />
      <w-table-toolbar name="add" url="views/dsk/operation/logoperationEdit" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
    </w-table>

  </div>
</template>

<script>
// import request from '@/utils/request'
export default {
  name: 'Meslottrack',
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
