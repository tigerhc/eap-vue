<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/dsk/edcdsklogrecipe" sort="startTime.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="recipeCode" label="配方名" width="150" align="center" />
      <w-table-col name="startTime" label="发生时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" url="views/dsk/recipe/logrecipeEdit" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
    </w-table>

  </div>
</template>

<script>
// import request from '@/utils/request'
export default {
  name: 'Edcdsklogoperation',
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
