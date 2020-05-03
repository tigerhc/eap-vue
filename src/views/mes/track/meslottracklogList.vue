<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/mes/meslottracklog" sort="startTime.desc" >
      <w-table-col name="lotNo" label="批次号" align="center" query condition="like" />
      <w-table-col name="eqpId" label="设备号" query condition="like"/>
      <w-table-col name="eventCode" label="动作"/>
      <w-table-col name="recipeCode" label="配方名" align="center" />
      <w-table-col name="lotYield" label="批次产量" align="right"/>
      <w-table-col name="startTime" label="开始时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
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
  name: 'Meslottracklog',
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
