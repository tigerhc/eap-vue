<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/edc/edcamsrptrecord" sort="createDate.desc" >
      <!--todo fixed属性导致当前列变为第一列-->

      <w-table-col name="createDate" label="报警时间" width="180" align="center"/>
      <w-table-col name="eqpId" label="设备号" width="120" align="left"/>
      <w-table-col name="productionNo" label="品番" width="100" align="center" />
      <w-table-col name="lotNo" label="批次" width="80" align="center" dict="AMS_ALARM_TYPE" />
      <w-table-col name="alarmCode" label="报警" width="80" sort align="left" query condition="like"/>
      <w-table-col name="eqpModelName" label="设备类型" align="left"/>
      <w-table-col name="eqpModelId" label="设备型号" hidden query dict url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="dealUserName" label="处理人" width="80" align="left" />
      <w-table-col name="dealDate" label="处理时间" width="180" align="center"/>
      <w-table-col name="dealFlag" label="结果" align="center" width="50" />
      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" hidden url="111"/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <!--hidden属性: 隐藏默认button url: 修改默认url-->
      <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
      <!--<w-table-button v-if="row.dealFlag == 'N'" name="edit" label="处理"  url="views/ams/rpt/rptrecordEdit"  icon="el-icon-success" />-->
      <w-table-button v-if="row.dealFlag == 'N'" name="edit" label="处理" url="views/ams/rpt/rptrecordEdit" icon="el-icon-setting" />
      <w-table-button v-if="row.dealFlag == 'Y'" name="edit" hidden />
      <!-- type='danger'  -->
      <w-table-button v-if="row.dealFlag == 'Y'" name="diable" label="作为标准模式" tip="作为标准模式？" icon="el-icon-star-on" type="warning" />

    </w-table>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'AlarmDefine',
  data() {
    return {
      table: {
      }
    }
  },
  methods: {

    enable(row, table, ctx) {
      request({
        url: '/edc/edcamsdefine/active_flag/' + row.id + '/1',
        method: 'put'
      }).then(() => {
        ctx.refresh()
        this.$notify({
          title: '成功',
          message: '已禁用',
          type: 'success',
          duration: 2000
        })
      })
    },
    diable(row, table, ctx) {
      request({
        url: '/edc/edcamsdefine/active_flag/' + row.id + '/0',
        method: 'put'
      }).then(() => {
        ctx.refresh()
        this.$notify({
          title: '成功',
          message: '已禁用',
          type: 'success',
          duration: 2000
        })
      })
    }

  }
}
</script>
