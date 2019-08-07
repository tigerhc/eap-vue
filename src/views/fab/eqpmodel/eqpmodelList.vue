<template>
  <div class="app-container calendar-list-container">
    <eap-table v-bind="table">
      <eap-table-col name="updateDate" label="更新时间" />
    </eap-table>
  </div>
</template>

<script>
export default {
  name: 'Eqpmodel',
  data() {
    return {
      table: {
        url: '/fab/fabequipmentmodel',
        handler: {
          add: 'views/fab/eqpmodel/eqpmodelAdd'
          // edit: 'views/fab/eqpmodel/eqpmodelEdit',
          // view: 'views/fab/eqpmodel/eqpmodelEdit'
          // delete: true,
          // search: true,
          // batchDelete: true
        },
        sort: 'updateDate',
        columns: [
          {
            name: 'manufacturerName',
            align: 'center',
            label: '设备厂家',
            'formatter.handler': 'view', // view add edit
            query: 'true',
            queryMode: 'input',
            condition: 'like'
          },
          {
            name: 'classCode',
            label: '设备类型',
            query: 'true',
            queryMode: 'input',
            condition: 'like'
          },
          {
            name: 'activeFlag',
            label: '有效标志',
            'formatter.dict': 'ACTIVE_FLAG'
          }
        ]
      }
    }
  }
}
</script>
