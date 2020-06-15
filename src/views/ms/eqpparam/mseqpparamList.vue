<template>
  <div class="app-container calendar-list-container">
    <w-table v-slot="{row}" v-bind="table" url="/ms/mseqpparam" sort="create_date.desc" >
      <w-table-col name="eqpModelName" label="设备型号" sort fixed align="left" handler="view"/>
      <w-table-col name="msGetType" label="取值方式" align="left"/>
      <w-table-col name="param1" label="参数1" width="100" align="left"/>
      <w-table-col name="param2" label="参数2" width="100" align="left" />
      <w-table-col name="param3" label="参数3" width="100" align="left" />
      <w-table-col name="param4" label="参数4" width="100" align="left" />
      <w-table-col name="param4" label="参数5" width="100" align="left"/>
      <w-table-toolbar name="add" url="views/ms/eqpparam/mseqpparamEdit" />

    </w-table>

  </div>
</template>

<script>
export default {
  name: 'MseqpparamList',
  data() {
    return {
      table: {
      }
    }
  },
  methods: {
  }
}
</script>
