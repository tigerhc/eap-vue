<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/rms/rmsrecipelog" sort="createDate.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" query condition="like"/>
      <w-table-col name="eqpModelId" label="设备型号" width="150" align="center" />
      <w-table-col name="eqpModelName" label="设备类型名称" width="150" align="center" />
      <w-table-col name="recipeCode" label="配方CODE" width="150" align="center" />
      <w-table-col name="recipeName" label="配方名" width="150" align="center" />
      <w-table-col name="versionType" label="版本类型" width="150" align="center" />
      <w-table-col name="versionNo" label="版本号" width="150" align="center" />
      <w-table-col name="lotId" label="批次号" width="150" align="center" />
      <w-table-col name="param" label="参数信息" width="150" align="center" />
      <w-table-col name="createDate" label="创建时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'RmsrecipeLogList',
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
