<template>
  <div class="app-container calendar-list-container">
    <w-table ref="ref" v-bind="table" url="/dsk/edcdsklogrecipe" sort="startTime.desc" >
      <w-table-col name="eqpId" label="设备号" width="120" sort fixed align="left" handler="view" query eqp multiple namekey="id" condition="in"/>
      <w-table-col name="recipeCode" label="配方名" width="150" align="center" />
      <w-table-col name="startTime" label="发生时间" width="200" align="center" sort="1" query querymode="date" condition="between"/>
      <w-table-toolbar name="add" url="views/dsk/recipe/logrecipeEdit" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-toolbar name="finddetail" label="导出选中的Excel" icon="fa-download" />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
      <w-table-button name="edit" hidden />
    </w-table>
<!--    <el-button @click="re">aaaa</el-button>-->
    <a href="http://localhost:81/dsk/edcdsklogrecipe/selectExport" >百度</a>
  </div>
</template>

<script>
import api from './fetch'
export default {
  name: 'Edcdsklogoperation',
  data() {
    return {
      table: {
        opHide: true
      },
      isLoading: false,
      colSet: [],
      query: {
        id: ''
      },
      total: 0,
      list: [],
      tableKey: Math.random(),
      api: api('/dsk/edcdsklogrecipe/exportLogRecipe'),
      multipleSelection: [],
      sortQuery: { ascs: [], descs: [] },
      defaultSortQuery: { ascs: [], descs: [] },
      toolbarStatus: {
        exportsLoading: false
      },
      single: null,
      searchOnly: null
    }
  },
  methods: {
    finddetail() {
      var param = this.$refs.ref.fdis()
      this.query.id = param
      // eslint-disable-next-line no-undef
      if (this.toolbarStatus.exportsLoading) {
        return
      }
      this.toolbarStatus.exportsLoading = true
      const q = (this.query)
      // alert(q)
      this.api
        .export(q)
        .then((response) => {
          if (response.code === 0) {
            return import('./Export2Excel').then((excel) => {
              excel.export_byte_to_excel(response.bytes, response.title)
              this.toolbarStatus.exportsLoading = false
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: (response && response.errmsg) || '导出失败!',
              duration: 2000
            })
            this.toolbarStatus.exportsLoading = false
          }
        })
        .catch((e) => {
          this.toolbarStatus.exportsLoading = false
        })
    }

  }
}
</script>
