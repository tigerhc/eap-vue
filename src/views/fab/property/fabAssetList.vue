<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table1" url="/fab/fabequipment" sort="sortNo.asc">
      <w-table-col
        name="eqpId"
        label="设备号"
        sort
        fixed
        align="left"
        handler="view"
        query
        eqp
        multiple
        namekey="id"
        condition="in"
      />
      <w-table-col
        name="modelId"
        label="设备型号"
        hidden
        query
        dict
        url="/fab/fabequipmentmodel/list"
        namekey="modelName"
        querymode="select"
        condition="eq"
        filterable
      />
      <w-table-col
        name="parentType"
        label="设备大类"
        align="left"
        query
        namekey="parentType"
        querymode="select"
        dict
        condition="eq"
      />
      <w-table-col name="eqpName" label="设备说明" align="left" />
      <w-table-col name="officeName" label="部门" width="100" align="left" />
      <w-table-col name="modelName" label="设备型号" align="left" />
      <w-table-col name="bcCode" label="BC号" align="center" />
      <w-table-col name="ip" label="机台IP地址" align="center" />
      <!--<w-table-col name="sortNo" label="排序号" sort/>-->
      <!-- todo filterable 属性-->

      <w-table-col
        name="activeFlag"
        label="有效标志"
        width="100"
        align="center"
        dict="ACTIVE_FLAG"
        query
        condition="eq"
      />

      <w-table-toolbar name="add" url="views/fab/property/fabAssetListEdit" />
      <w-table-toolbar name="initStatus" label="初始化所有状态" type="warning" />
    </w-table>
  </div>
</template>

<script>
import request from '@/utils/request'
// import { Loading } from 'element-ui'
export default {
  name: 'Eqp',
  data() {
    return {
      isLoading: false,
      detail: {
        opHide: true,
        model: {
          alarmCode: ''
        },
        datas: []
      },
      table1: {},
      showVisiable: false, // 控制显隐
      editIndex: -1 // 当前编辑行index
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
    },

    // initStatus2(data) {
    //   return request({
    //     url: `${url}/batch/initstatus`,
    //     method: `post`,
    //     data
    //   })
    // }

    editCurrRow(rowId, str) {
      this.editIndex = rowId // 不加editIndex,整个列都会一块变成可编辑
      this.showVisiable = true
      const id = rowId + str
      // 也可以用this.$nextTick，个人感觉加个0.01秒的延时比下次渲染灵活一点
      setTimeout(() => {
        document.getElementById(id).focus()
      }, 100)
    },
    addSensor() {
      console.log(this.tableData)
    }
  }
}
</script>
<style scoped>
.editCell:hover {
  cursor: pointer;
}
</style>
