<template>
  <div class="app-container calendar-list-container">
    <eap-table v-bind="table" />
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
          create: 'views/fab/eqpmodel/addDevice',
          update: 'views/fab/eqpmodel/editDevice'
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
            'formatter.handler': 'update',
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
          },
          {
            name: 'updateDate',
            label: '更新时间'
          }
        ]
      }
    }
  }
}
</script>
