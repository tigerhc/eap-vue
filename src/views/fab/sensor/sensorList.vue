<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{}" v-bind="table" url="fab/fabSensor" sort="">
      <w-table-col
        name="sorId"
        label="传感器号"
        fixed
        align="left"
        query
        namekey="sorId"
        condition="in"
        querymode="select"
      />
      <w-table-col name="sorName" label="传感器名称" align="left" />
      <w-table-col name="officeId" label="部门" width="100" align="left" />
      <w-table-col name="bcCode" label="BC号" align="center" />
      <w-table-col name="ip" label="机台IP地址" align="center" />
      <w-table-col
        name="modelId"
        label="设备型号"
        query
        dict
        url="/fab/fabequipmentmodel/list"
        namekey="modelName"
        querymode="select"
        condition="eq"
        filterable
      />
      <w-table-col
        name="activeFlag"
        label="有效标志"
        width="100"
        align="center"
        dict="ACTIVE_FLAG"
        query
        condition="eq"
      />
      <w-table-toolbar name="initStatus" label="初始化所有状态" type="warning" />
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
        handler: {
          add: 'views/fab/sensor/sensorListEdit'
          // edit: 'views/fab/property/propertymodelEdit'
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
      }
    }
  },
  methods: {
    enable(row, table, ctx) {
      request({
        url: '/fab/fabequipment/active_flag/' + row.id + '/Y',
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
        url: '/fab/fabequipment/active_flag/' + row.id + '/N',
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
        })
          .then(() => {
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
          })
          .catch(() => {
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
