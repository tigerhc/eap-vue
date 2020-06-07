<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/ms/msmeasurerecord" sort="create_date.desc" >
      <w-table-col name="recordId" label="流水号" sort fixed align="left" handler="view"/>
      <w-table-col name="eqpId" label="设备号" align="left"/>
      <w-table-col name="lotNo" label="批号" width="100" align="left"/>
      <w-table-col name="waferId" label="晶圆ID" align="left" />
      <w-table-col name="timing" label="时机" align="center" />
      <w-table-col name="sampleCount" label="采样数" align="center" />
      <w-table-col name="status" label="状态" align="center"/>
      <w-table-col name="approveResult" label="判定结果" />
      <w-table-col name="fileFlag" label="采样文件" width="80" align="center" dict="ACTIVE_FLAG" query condition="eq" />
      <w-table-toolbar name="add" url="views/ms/record/measurerecordEdit" />
      <w-table-toolbar name="batchDelete" hidden/>
      <w-table-button name="delete" hidden/>
      <w-table-button name="edit" hidden/>

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'MeasurerecordList',
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
