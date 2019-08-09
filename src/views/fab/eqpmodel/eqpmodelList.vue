<template>
  <div class="app-container calendar-list-container">
    <eap-table v-bind="table" url="/fab/fabequipmentmodel">
      <eap-table-column
        name="manufacturerName"
        label="设备厂家"
        handler="view"
        tip="确认查看"
        query="true"
        querymode="input"
        condition="like"
      />
      <eap-table-column name="updateDate" label="更新时间" />
      <!-- <eap-table-button name="stop" tip="确认终止？" label="终止" /> -->
      <!-- <eap-table-toolbar name="dowhat" label="干啥" tip="你想干啥？" icon="el-icon-delete" type="warning" /> -->
      <eap-table-toolbar name="add" url="views/fab/eqpmodel/eqpmodelAdd" />
      <eap-table-toolbar name="batchDelete" hidden />
    </eap-table>
  </div>
</template>

<script>
export default {
  name: 'Eqpmodel',
  data() {
    return {
      table: {
        columns: [
          // {
          //   name: 'manufacturerName',
          //   align: 'center',
          //   label: '设备厂家',
          //   handler: 'view', // view add edit  默认内置函数 自定义函数写在methods 里
          //   // tip: '确认点击吗',
          //   query: 'true',
          //   querymode: 'input',
          //   condition: 'like'
          // },
          {
            name: 'classCode',
            label: '设备类型',
            query: 'true',
            querymode: 'input',
            condition: 'like'
          },
          {
            name: 'activeFlag',
            label: '有效标志',
            'dict': 'ACTIVE_FLAG'
          }
        ]
      }
    }
  },
  methods: {
    stop(row, table) {
      console.info(row, table)
    },
    dowhat(table) {
      console.info(table)
    }
  }
}
</script>
