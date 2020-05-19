<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/dsk/edcdsklogproduction" sort="startTime.desc" >
      <w-table-col name="eqpId" label="设备号" sort fixed align="left" handler="view" query condition="eq"/>
      <w-table-col name="eqpModelName" label="设备型号" align="left" />
      <w-table-col name="lotNo" label="批号" align="center" query condition="like" />
      <w-table-col name="recipeCode" label="配方名" align="center" />
      <w-table-col name="dayYield" label="日产量" width="80" align="right"/>
      <w-table-col name="lotYield" label="批次产量" width="80" align="center"/>
      <w-table-col name="judgeResult" label="判定结果" width="80" align="right"/>
      <w-table-col name="startTime" label="发生时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" url="views/dsk/production/logproductionEdit" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
    </w-table>

  </div>
</template>

<script>
// import request from '@/utils/request'
export default {
  name: 'Edcdskproduction',
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
