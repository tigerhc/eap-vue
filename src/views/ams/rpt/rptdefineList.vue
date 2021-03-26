<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/edc/edcamsrptdefine" sort="update_date.desc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="alarmId" label="编码" width="120" sort fixed align="left" handler="view" query condition="like"/>
      <w-table-col name="repeatAlarmDesc" label="描述" width="200" align="center" />
      <w-table-col name="eqpModelName" label="设备类型" align="left"/>
      <w-table-col name="repeatCycle" label="周期" width="80" align="center" dict="AMS_ALARM_TYPE" />
      <w-table-col name="repeatNum" label="累计次数" width="80" align="center" />
      <w-table-col name="eqpModelId" label="设备型号" hidden query dict url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="activeFlag" label="激活状态" width="80" align="center" dict="MONITOR_FLAG" query condition="eq" />
      <w-table-col name="activeDate" label="激活时间" width="200" align="center" sort="1"/>
      <w-table-toolbar name="add" url="views/ams/rpt/rptdefineEdit" />
      <w-table-toolbar name="initDefine" label="初始化数据" type="warning" />
      <w-table-button v-if="row.activeFlag == 'N'" name="enable" label="启用" tip="确认启用？" icon="el-icon-bell" />
      <w-table-button v-if="row.activeFlag == 'Y'" name="diable" label="停用" tip="确认停用？" icon="el-icon-circle-close" type="warning" />

    </w-table>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'Amsrptdefine',
  data() {
    return {
      table: {
      }
    }
  },
  methods: {

    enable(row, table, ctx) {
      request({
        url: '/edc/edcamsrptdefine/active_flag/' + row.id + '/1',
        method: 'put'
      }).then(() => {
        ctx.refresh()
        this.$notify({
          title: '成功',
          message: '已启用',
          type: 'success',
          duration: 2000
        })
      })
    },
    diable(row, table, ctx) {
      request({
        url: '/edc/edcamsrptdefine/active_flag/' + row.id + '/0',
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
    initDefine(row, table, ctx) {
      // debugger
      this.$confirm('此操作将初始化报警管控数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: `/edc/edcamsrptdefine/initDefine`,
          method: `post`,
          data: ''
        }).then(() => {
          this.$notify({
            title: '成功',
            message: '初始化成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消报警管控初始化',
          duration: 2000
        })
      })
    }

  }
}
</script>
