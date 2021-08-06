<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/fab/fabequipment" sort="sortNo.asc">
      <w-table-col name="eqpId" label="设备号" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in" />
      <w-table-col name="modelId" label="设备型号" hidden query dict url="/fab/fabequipmentmodel/list" namekey="modelName" querymode="select" condition="eq" filterable />
      <w-table-col name="eqpName" label="设备说明" align="left" />
      <w-table-col name="officeName" label="部门" width="100" align="left" />
      <w-table-col name="modelName" label="设备型号" align="left" />
      <w-table-col name="bcCode" label="BC号" align="center" />
      <w-table-col name="ip" label="机台IP地址" align="center" />
      <!--<w-table-col name="sortNo" label="排序号" sort/>-->
      <!-- todo filterable 属性-->
      <w-table-col name="activeFlag" label="有效标志" width="100" align="center" dict="ACTIVE_FLAG" query condition="eq" />
      <w-table-toolbar name="initStatus" label="初始化所有状态" type="warning" />
    </w-table>
    <!--设备列表组件-->
<!--    <eap-eqpt/>-->
  </div>
</template>

<script>
import request from '@/utils/request'
import EapEqpt from '../../../components/eap-eqpt/index'
// import { Loading } from 'element-ui'
export default {
  name: 'Eqp',
  components: { EapEqpt },
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
      table: {
        handler: {
          add: 'views/fab/eqp/fabequipmentAdd',
          edit: 'views/fab/eqp/fabequipmentEdit'
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
      },
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
<style scoped>
.editCell:hover {
  cursor: pointer;
}
.el-select--medium{width: 320px!important;}
</style>
<style>

</style>
