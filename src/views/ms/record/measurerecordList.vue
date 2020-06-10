<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/ms/msmeasurerecord" sort="create_date.desc" >
      <w-table-col name="recordId" label="流水号" width="200" sort query condition="like" align="left" handler="view"/>
      <w-table-col name="eqpId" label="设备号" align="center" query condition="like" />
      <w-table-col name="lotNo" label="批号" width="180" align="left" query condition="like" />
      <w-table-col name="waferId" label="晶圆ID" width="180" align="left" />
      <w-table-col name="timing" label="时机" width="80" align="center" />
      <w-table-col name="sampleCount" label="采样数" width="80" align="right" />
      <w-table-col name="status" label="状态" align="center" dict="RECORD_STATUS" />
      <w-table-col name="approveResult" label="判定结果" align="center" dict="JUDGE_RESULT" query condition="eq" />
      <w-table-col name="fileFlag" label="采样文件" width="80" align="center" dict="YNYW" />
      <w-table-col name="imgFlag" label="采样图片" width="80" align="center" dict="YNYW" />
      <w-table-col name="createDate" label="上报时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" url="views/ms/record/measurerecordEdit" hidden/>
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
