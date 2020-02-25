<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/edc/edcamsdefine" sort="updateDate.asc" >
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="alarmCode" label="编码" sort fixed align="left" handler="view" query condition="like"/>
      <w-table-col name="eqpModelName" label="设备类型" align="left"/>
      <w-table-col name="alarmName" label="名称" align="left" />
      <w-table-col name="alarmCategory" label="种类" align="center" />
      <!--<w-table-col name="sortCode" label="排序号" sort/>-->
      <!-- todo filterable 属性-->
      <w-table-col name="modelId" label="设备型号" hidden query dict url="/fab/fabequipmentmodel/list" namekey="modelName" condition="eq" filterable />
      <w-table-col name="monitorFlag" label="监控标记" align="center" dict="MONITOR_FLAG" query condition="eq" />
      <!--todo date 点击查询后,时间控件值消失-->
      <!--<w-table-col name="updateDate" label="更新时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>-->

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" url="views/ams/define/alarmdefineEdit" />
      <!--hidden属性: 隐藏默认button url: 修改默认url-->
      <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
      <w-table-button name="enable" label="启用" tip="确认启用报警？" icon="el-icon-close" />
      <w-table-button name="diable" label="停用" tip="确认停用报警？" icon="el-icon-close" />

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
          method: 'post'
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
          method: 'post'
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
