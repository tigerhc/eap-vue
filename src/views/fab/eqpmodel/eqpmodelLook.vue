<template>
  <div>
    <w-table url="/fab/fabequipmentmodel">
      <w-table-col name="manufacturerName" label="设备厂家" query condition="like" />
      <w-table-col name="classCode" label="设备类型" query condition="like" />
      <w-table-col name="activeFlag" label="有效标志" dict="ACTIVE_FLAG" />
      <w-table-col :formatter="combineModelName" name="modelName" label="设备类型全称" />
      <w-table-toolbar name="add" hidden />
      <w-table-toolbar name="delete" hidden />
      <w-table-toolbar name="exports" hidden />
      <w-table-toolbar name="add" hidden />
    </w-table>
  </div>
</template>

<script>
export default {
  name: 'EqpmodelLook',
  data() {
    return {
      table: {}
    }
  },
  methods: {
    combineModelName(val, col, table, row) {
      // alert(row)
      // table.modelName  = row.manufacturerName + '-' + row.classCode;
      return row.manufacturerName + '-' + row.classCode
    }
  }
}
</script>
<style scoped lang="scss"></style>
