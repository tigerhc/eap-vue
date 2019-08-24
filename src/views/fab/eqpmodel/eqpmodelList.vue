<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" :onloadsuccess="deal" url="/fab/fabequipmentmodel" >
      <!--tip="确认查看"-->
      <w-table-col name="manufacturerName" label="设备厂家" width="300" query condition="like" fixed handler="view"/>
      <w-table-col name="classCode" label="设备类型" width="300" query condition="like"/>
      <w-table-col name="activeFlag" label="有效标志" width="200" dict="ACTIVE_FLAG" />
      <w-table-col name="updateDate" label="更新时间" width="200" sort query querymode="date" condition ="between" />
      <!--<w-table-col name="op" fixed width="200" />-->
      <!--<w-table-toolbar name="add" url="views/fab/eqpmodel/eqpmodelAdd" />-->
       <!--<w-table-toolbar hidden name="batchDelete" />-->
      <w-table-toolbar name="dowhat" label="干啥" tip="你想干啥？" icon="el-icon-setting" type="warning" />
      <w-table-button name="stop" icon="el-icon-setting" tip="确认终止？" label="终止" />
      <w-table-button name="test" icon="el-icon-setting" fold label="终止(fold)" />

    </w-table>
  </div>
</template>

<script>
export default {
  name: 'Eqpmodel',
  data() {
    return {
      table: {
        handler: {
          add: 'views/fab/eqpmodel/eqpmodelEdit',
          // edit: 'views/fab/eqpmodel/fabequipmentEdit',
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
          // delete: true,
          // search: true,
          batchDelete: false
        }
      }
    }
  },
  methods: {
    stop(row, table) {
      console.info(row, table)
    },
    dowhat(table) {
      console.info(table)
    },
    deal(row) {
      console.info(row)
      return { ...row, addfield: row.manufacturerName + '-' + row.classCode }
    }
  }
}
</script>
<style>
</style>
