<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" :limit="15" url="/rms/rmsrecipechecklog" sort="createDate.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="recipeCode" label="配方CODE" align="center" />
      <w-table-col name="recipeName" label="配方名" align="center" />
      <w-table-col name="versionType" label="版本类型" align="center" />
      <w-table-col name="versionNo" label="版本号" align="center" />
      <w-table-col name="paramCode" label="参数CODE" align="center" />
      <w-table-col name="paramName" label="参数名称" align="center" />
      <w-table-col name="checkResult" label="校验结果" align="center" />
      <w-table-col name="checkRemarks" label="校验信息" align="center" />
      <w-table-col name="checkDate" label="校验时间" width="250" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'RmsrecipechecklogList',
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
