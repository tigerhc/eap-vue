<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{ row }" v-bind="table" :limit="15" url="/rms/rmsrecipelog" sort="createDate.desc">
      <w-table-col
        name="eqpId"
        label="设备号"
        width="120"
        sort
        align="left"
        handler="view"
        query
        eqp
        multiple
        namekey="id"
        condition="in"
      />
      <w-table-col name="eventCode" label="事件" align="center" />
      <w-table-col name="eqpModelName" width="200" label="设备类型" align="center" />
      <w-table-col name="recipeCode" label="配方CODE" align="center" />
      <w-table-col name="recipeName" label="配方名" align="center" />
      <w-table-col name="versionType" label="版本类型" align="center" />
      <w-table-col name="versionNo" label="版本号" align="center" />
      <w-table-col name="lotId" label="批次号" align="center" />
      <w-table-col name="param" label="参数信息" align="center" />
      <w-table-col name="createBy" label="创建人" align="center" />
      <w-table-col
        name="createDate"
        label="创建时间"
        width="250"
        align="center"
        sort="1"
        query
        querymode="date"
        condition="between"
      />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="batchDelete" hidden />
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
  methods: {}
}
</script>
