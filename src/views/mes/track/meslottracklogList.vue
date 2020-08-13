<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/mes/meslottracklog" sort="createDate.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="productionName" label="品名" align="center" />
      <w-table-col name="productionNo" label="品番" align="center" />
      <w-table-col name="lotNo" label="批次号" align="center" query condition="like" />
      <w-table-col name="eventCode" label="动作" width="120"/>
      <!--<w-table-col name="recipeCode" label="配方名" align="center" />-->
      <w-table-col name="lotYield" label="批次产量" width="90" align="right"/>
      <w-table-col name="createDate" label="发生时间" width="180" align="center" sort="1" query querymode="date" condition="between"/>
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
