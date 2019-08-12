<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table">
      <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="eqpId" label="设备号" sort="2" fixed align="left" handler="view" query condition="like"/>
      <w-table-col name="officeName" label="部门" align="left"/>
      <w-table-col name="modelName" label="设备型号" align="left" />
      <w-table-col name="bcCode" label="BC号" align="center" />
      <w-table-col name="ip" label="机台IP地址" align="center"/>
      <w-table-col name="sortCode" label="排序号" hidden sort/>
      <!-- todo filterable 属性-->
      <w-table-col name="modelId" label="设备型号" hidden query dict url="/fab/fabequipmentmodel" namekey="manufacturerName" condition="eq" filterable />
      <w-table-col name="location" label="位置号" align="center"/>
      <w-table-col name="activeFlag" label="有效标志" align="center" dict="ACTIVE_FLAG"/>
      <!--todo date 点击查询后,时间控件值消失-->
      <w-table-col name="updateDate" label="更新时间" align="center" query querymode="date" condition="between"/>

      <!--hidden属性: 隐藏默认button url: 修改默认url 没有url,则默认调用属性name值的方法-->
      <!--<w-table-toolbar name="add" hidden url="views/fab/eqpmodel/eqpmodelAdd" />-->
      <!--hidden属性: 隐藏默认button url: 修改默认url-->
      <!--<w-table-toolbar name="exportExcel" label="导出Excel" tip="你想干啥111？" icon="fa-download" type="success" />-->
      <w-table-button name="stop" label="停用设备" tip="确认停用设备？" icon="el-icon-close"  />

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
        url: '/fab/fabequipment',
        handler: {
          add: 'views/fab/eqp/fabequipmentEdit',
          // edit: 'views/fab/eqpmodel/fabequipmentEdit',
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
          // delete: true,
          // search: true,
          batchDelete: true
        }
//        sort: 'updateDate'
        //          columns: [
        //            {name: 'eqpId',            label: '设备号',       align: 'left',  'formatter.handler': 'view', query: 'true', queryMode: 'input', condition: 'like'},
        //            {name: 'officeName',     label: '部门',         align: 'left'  },
        //            {name: 'bcCode',           label: 'BC号',         align: 'center' , query: 'true', queryMode: 'input', condition: 'like'},
        //            {name: 'ip',               label: '机台IP地址',   align: 'center'},
        //            {name: 'modelName',        label: '设备型号名称', align: 'left', query: 'true', queryMode: 'input', condition: 'like'},
        //            {name: 'location',         label: '位置号',       align: 'center'},
        //            {name: 'activeFlag',       label: '有效标志',     align: 'center', 'formatter.dict': 'ACTIVE_FLAG'},
        //            {name: 'updateDate',       label: '更新时间',     align: 'center'}
        //          ]
      }
    }
  },
  methods: {

    stop(row, table) {
      request({
        url: '/fab/fabequipment/' + row.id + '/inactiveeqp',
        method: 'post'
      }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
//    })

    }
  }
}
</script>
