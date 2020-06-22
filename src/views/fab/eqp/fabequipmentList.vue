<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/fab/fabequipment" sort="sortCode.asc" >
      <!--todo fixed属性导致当前列变为第一列-->
<!--      <w-table-col name="eqpId" label="设备号" sort fixed align="left" handler="view" query condition="in"/>-->
      <w-table-col name="eqpId" label="设备号" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="eqpName" label="设备说明" align="left"/>
      <w-table-col name="officeName" label="部门" width="100" align="left"/>
      <w-table-col name="modelName" label="设备型号" align="left" />
      <w-table-col name="bcCode" label="BC号" align="center" />
      <w-table-col name="ip" label="机台IP地址" align="center"/>
      <!--<w-table-col name="sortCode" label="排序号" sort/>-->
      <!-- todo filterable 属性-->
      <w-table-col name="modelId" label="设备型号" hidden query dict url="/fab/fabequipmentmodel/list" namekey="modelName" querymode="select" condition="eq" filterable />
      <w-table-col name="activeFlag" label="有效标志" width="80" align="center" dict="ACTIVE_FLAG" query condition="eq" />
      <!--todo date 点击查询后,时间控件值消失-->
      <!--<w-table-col name="updateDate" label="更新时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>-->

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <w-table-toolbar name="add" url="views/fab/eqp/fabequipmentEdit" />
      <w-table-toolbar name="initStatus" label="初始化所有状态" type="warning" />
      <!--hidden属性: 隐藏默认button url: 修改默认url-->
      <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
<!--      <w-table-button v-if="row.activeFlag == 0" name="enable" label="启用" tip="确认启用设备？" icon="el-icon-check" />-->
<!--      <w-table-button v-if="row.activeFlag == 1" name="diable" label="停用" tip="确认停用设备？" icon="el-icon-circle-close" type="warning" />-->

    </w-table>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'Eqp',
  data() {
    return {
      table: {
      }
    }
  },
  methods: {
    enable(row, table, ctx) {
      request({
        url: '/fab/fabequipment/active_flag/' + row.id + '/1',
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
        url: '/fab/fabequipment/active_flag/' + row.id + '/0',
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

    initStatus(row, table, ctx) {
      // debugger
      if (table.multipleSelection.length > 0) {
        this.$confirm('此操作将初始化设备状态数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = {
            ids: ''
          }
          const ids = []
          for (const item of table.multipleSelection) {
            ids.push(item.id)
          }
          obj.ids = ids.join(',')
          request({
            url: `/fab/fabequipmentstatus/batch/initstatus`,
            method: `post`,
            data: obj
          }).then(() => {
            this.getList()
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
            message: '已取消设备状态初始化',
            duration: 2000
          })
        })
      } else {
        this.$notify({
          showClose: true,
          message: '请选择至少一条数据删除',
          type: 'error',
          duration: 2000
        })
      }
    }

    // initStatus2(data) {
    //   return request({
    //     url: `${url}/batch/initstatus`,
    //     method: `post`,
    //     data
    //   })
    // }

  }
}
</script>
