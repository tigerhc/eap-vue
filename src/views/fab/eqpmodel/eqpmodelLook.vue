<template>
  <div class="app-container calendar-list-container">
    <w-table url="/fab/fabequipmentmodel">
      <w-table-col name="manufacturerName" label="设备厂家" width="150" query condition="like"/>
      <w-table-col name="classCode" label="设备类型" width="150" query condition="like"/>
      <w-table-col name="activeFlag"  label="有效标志" width="100" dict="ACTIVE_FLAG" />
      <w-table-col name="modelName" label="设备类型全称"  width="100" formatter="combineModelName"/>
    </w-table>
  </div>
</template>

<script>
  export default {
    name: 'EqpmodelLook',
    data() {
      return {
        table: {
        }
      }
    },
    methods: {
      combineModelName(row, table) {
        alert(row);
        return row.manufacturerName+"-"+row.classCode
      },
    }
  }
</script>
<style>
</style>
