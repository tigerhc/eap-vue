<template>
  <div class="app-container calendar-list-container">
    <w-table v-bind="table" url="fab/fabModeltemplate">
      <w-table-col
        name="name"
        label="模板名称"
        query
        namekey="name"
        condition="eq"
        url="fab/fabModeltemplate/ajaxList"
      />
      <w-table-col
        name="manufacturerName"
        label="厂家"
        query
        namekey="manufacturerName"
        condition="like"
        dict
        url="fab/fabequipmentmodel/manufacturerNameList"
      />
      <w-table-col
        name="classCode"
        label="设备类型"
        namekey="classCode"
        query
        condition="like"
        dict
        url="fab/fabequipmentmodel/classCodeList"
      />
      <w-table-col name="activeFlag" label="有效标志" namekey="activeFlag" />
      <w-table-col name="createDate" label="创建时间" namekey="createDate" />
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="clean" hidden />
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
          edit: 'views/fab/eqp/fabeqpTemplateEdit'
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
