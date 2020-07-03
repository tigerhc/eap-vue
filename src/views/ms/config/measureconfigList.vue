<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/ms/msmeasureconfig" sort="create_date.asc" >
      <w-table-col name="eqpModelName" label="设备型号" sort fixed align="left" handler="view"/>
      <w-table-col name="productionNo" label="产品" align="left"/>
      <w-table-col name="timing" label="时机" width="100" align="left"/>
      <w-table-col name="status" label="状态" align="left" />
      <w-table-col name="sampleCount" label="采样数" align="center" />
      <w-table-col name="fileFlag" label="采样文件" width="80" align="center" dict="ACTIVE_FLAG" query condition="eq" />
      <w-table-col name="imgFlag" label="采样图片" />
      <w-table-toolbar name="add" url="views/ms/config/measureconfigEdit" />
      <w-table-toolbar name="batchDelete" hidden/>
      <!--<w-table-button name="delete" hidden/>-->
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'MeasureconfigList',
  data() {
    return {
      table: {
      }
    }
  },
  methods: {
  }
}
</script>
