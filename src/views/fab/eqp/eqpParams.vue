<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{}" v-bind="table" url="/edc/edcparamdefinemodel">
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col
        name="paramCode"
        label="编码"
        width="120"
        sort
        fixed
        align="left"
        handler="view"
        query
        condition="like"
      />
      <w-table-col name="subEqpId" label="设备号" align="center" dict query condition="eq" />
      <w-table-col name="paramName" label="名称" align="left" />
      <w-table-col name="maxValue" label="最大值" width="100" align="center" />
      <w-table-col name="minValue" label="最小值" width="100" align="center" />
      <w-table-col name="setValue" label="设定值" width="100" align="center" />
      <w-table-col
        name="modelId"
        label="设备型号"
        hidden
        query
        dict
        url="/fab/fabequipmentmodel/list"
        namekey="classCode"
        condition="eq"
        filterable
      />
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
        handler: {
          add: 'views/fab/eqp/eqpParamsEdit',
          edit: 'views/fab/eqp/eqpParamsEdit'
          // edit: 'views/fab/eqpmodel/fabequipmentEdit',
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
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
