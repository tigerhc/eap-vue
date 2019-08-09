<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="/fab/fabequipmentmodel">
      <w-table-col
        name="manufacturerName"
        label="设备厂家"
        handler="view"
        tip="确认查看"
        query="true"
        querymode="input"
        condition="like"
      />
      <w-table-col name="updateDate" label="更新时间" />
      <!-- <w-table-button name="stop" tip="确认终止？" label="终止" /> -->
      <!-- <w-table-toolbar name="dowhat" label="干啥" tip="你想干啥？" icon="el-icon-delete" type="warning" /> -->
      <w-table-toolbar name="add" url="views/fab/eqpmodel/eqpmodelAdd" />
      <w-table-toolbar name="batchDelete" hidden />
    </w-table>
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
<style>
</style>
