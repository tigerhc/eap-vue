<template>
  <div class="app-container calendar-list-container">
    <eap-table v-bind="table">
      <!--<eap-table-col name="eqpId" label="设备号" align="left" />-->
      <!--<eap-table-col name="officeName" label="部门" align="left"/>-->
      <!--<eap-table-col name="bcCode" label="BC号" align="center"/>-->
      <!--<eap-table-col name="ip" label="机台IP地址" align="center"/>-->
      <!--<eap-table-col name="modelName" label="设备型号名称" align="left"/>-->
      <!--<eap-table-col name="location" label="位置号" align="center"/>-->
      <!--<eap-table-col name="activeFlag" label="有效标志" align="center"/>-->
      <!--<eap-table-col name="updateDate" label="更新时间" align="center"/>-->

    </eap-table>

  </div>
</template>

<script>
  export default {
    name: 'Eqpmodel',
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
          sort: 'updateDate',
          columns: [
            {name: 'eqpId',            label: '设备号',       align: 'left',  'formatter.handler': 'view', query: 'true', queryMode: 'input', condition: 'like'},
            {name: 'officeName',     label: '部门',         align: 'left'  },
            {name: 'bcCode',           label: 'BC号',         align: 'center' , query: 'true', queryMode: 'input', condition: 'like'},
            {name: 'ip',               label: '机台IP地址',   align: 'center'},
            {name: 'modelName',        label: '设备型号名称', align: 'left', query: 'true', queryMode: 'input', condition: 'like'},
            {name: 'location',         label: '位置号',       align: 'center'},
            {name: 'activeFlag',       label: '有效标志',     align: 'center', 'formatter.dict': 'ACTIVE_FLAG'},
            {name: 'updateDate',       label: '更新时间',     align: 'center'}
          ]
        }
      }
    }
  }
</script>
