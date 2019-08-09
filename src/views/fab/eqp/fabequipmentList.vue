<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table">
      <w-table-col name="eqpId" label="设备号" align="left" formatter.handler="view" query="true" query-mode="input" condition="like"/>
      <w-table-col name="officeName" label="部门" align="left"/>
      <w-table-col name="bcCode" label="BC号" align="center" query="true" query-mode="input" condition="like" />
      <w-table-col name="ip" label="机台IP地址" align="center"/>
      <w-table-col name="modelName" label="设备型号名称" align="left" query="true" query-mode="input" condition="like" />
      <w-table-col name="location" label="位置号" align="center"/>
      <w-table-col name="activeFlag" label="有效标志" align="center" formatter.dict="ACTIVE_FLAG"/>
      <w-table-col name="updateDate" label="更新时间" align="center"/>

    </w-table>

  </div>
</template>

<script>
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
        },
        sort: 'updateDate'
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
  }
}
</script>
