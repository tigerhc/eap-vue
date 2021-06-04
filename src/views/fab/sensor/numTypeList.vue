<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="">
      condition="eq"
      <w-table-col label="传感器型号" name="modelId" query querymode="select" dict condition="eq" />
      <w-table-col label="示数类型" name="numType" query querymode="select" dict="NUM_TYPE" condition="eq" />
      <w-table-col label="数据类型" name="dataType" />
      <w-table-col label="采集公式" name="collectionFormula" />
      <w-table-col label="计量单位" name="paramUnit" />
      <w-table-col label="创建日期" name="createDate" />
    </w-table>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      table: {
        handler: {
          add: 'views/fab/sensor/numTypeListEdit'
          // edit: 'views/fab/property/propertymodelEdit'
          // view: 'views/fab/eqpmodel/fabequipmentEdit'
        }
      }
    }
  },
  methods: {}
}
</script>

<style  scoped>
</style>
