<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/map/maptraychiplog" sort="begin_time.desc">
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col
        :formatter="colDateFormatter"
        name="beginTime"
        label="开始时间"
        width="180"
        align="left"
      />
      <w-table-col
        :formatter="colStateFormatter"
        name="resCode"
        label="状态"
        width="80"
        align="left"
      />
      <w-table-col
        :formatter="colDateFormatter"
        name="endTime"
        label="结束时间"
        width="180"
        align="left"
      />
      <w-table-col :formatter="colDurationFormatter" label="持续时长" width="100" align="left" />
      <w-table-col name="beginNo" label="开始Num" width="100" align="left" />
      <w-table-col name="endNo" label="结束Num" width="100" align="left" />
      <w-table-col
        :formatter="colNumberFormatter"
        name="procTotal"
        label="总数量"
        width="100"
        align="left"
      />
      <w-table-col
        :formatter="colNumberFormatter"
        name="procSuc"
        label="成功数"
        width="100"
        align="left"
      />
      <w-table-col
        :formatter="colNumberFormatter"
        name="procWarn"
        label="警告数"
        width="100"
        align="left"
      />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="search" hidden />
      <w-table-toolbar name="clean" hidden />
      <w-table-toolbar name="exports" hidden />
      <w-table-toolbar name="batchDelete" hidden />
    </w-table>
  </div>
</template>

<script>
import dateFormat from '@/utils/dateformat'
export default {
  name: 'TrayJobHistoryList',
  data() {
    return {
      table: {
        opHide: true
      }
    }
  },
  methods: {
    colDateFormatter(val) {
      if (val !== null) {
        return dateFormat(new Date(val))
      }
      return val
    },
    colDurationFormatter(val, col, con, row) {
      if (row.beginTime && row.endTime) {
        return Math.floor((row.endTime - row.beginTime) / 1000) + 's'
      }
      return '-'
    },
    colNumberFormatter(val) {
      if (!val) {
        return 0
      }
      return val
    },
    colStateFormatter(val) {
      if (val !== null) {
        if (val === '00') {
          return '成功'
        } else {
          return '失败'
        }
      }
      return val
    }
  }
}
</script>
