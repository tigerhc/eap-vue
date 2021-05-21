<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="">
      <w-table-col name="" label="模板名称" align="left" query/>
      <w-table-col name="" label="模板组态" align="left"/>
      <w-table-col name="chuan" label="传感器" align="left" query querymode="select"/>
      <w-table-col name="numType" label="示数类型" align="left" query querymode="select" dict="NUM_TYPE"/>
      <w-table-col name="collectType" label="采集方式" align="left"/>
      <!-- <w-table-toolbar name="add" url="views/fab/eqp/fabequipmentEdit" /> -->
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
          add: 'views/fab/eqp/fabeqpTemplateAdd',
          edit: 'views/fab/eqpmodel/fabequipmentEdit'
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
