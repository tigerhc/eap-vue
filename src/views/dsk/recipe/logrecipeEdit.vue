<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model" :on-load-data="onFormLoadData">
      <el-input v-model="model.eqpId" label="设备号" />
      <el-input v-model="model.recipeCode" label="配方名" />
      <el-input v-model="model.startTime" label="发生时间" />
    </w-form>

    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />

<!--    <w-edt-table v-bind="table" url="111" sort="sortNo.asc">-->
<!--      <w-table-col name="paraCode" required label="参数CODE" sort />-->
<!--      <w-table-col name="paraName" label="参数名称" align="left" />-->
<!--      <w-table-col name="setValue" label="设定值" align="left" />-->
<!--      <w-table-col name="preValue" label="设定旧值" align="left" />-->
<!--      <w-table-toolbar name="search" hidden/>-->
<!--      <w-table-toolbar name="add" hidden/>-->
<!--      <w-table-toolbar name="batchDelete" hidden />-->
<!--      <w-table-button name="delete" hidden />-->
<!--      <w-table-button name="edit" hidden />-->
<!--      <w-table-toolbar name="uploadRecipe" label="查看变化参数" type="primary" tip="查看变化参数" icon="el-icon-circle-plus-outline" />-->
<!--    </w-edt-table>-->
    <el-table
      v-loading="load"
      :data="table.datas"
      :row-class-name="tableRowClassName"
      :height="tableHeight"
      :cell-class-name="color"
      border
      fit
      style="width: 100%"
      highlight-current-row
      @row-click="rowClick"
      @row-dblclick="doubleClick"
    >
      <el-table-column type="index" label="序号" width="50px" align="center"/>
      <el-table-column prop="paraCode" label="参数CODE" align="center"/>
      <el-table-column prop="paraName" label="参数名称" align="center"/>
      <el-table-column label="设定值" align="center">
        <el-table-column prop="setValue" label="New Value" align="center"/>
        <el-table-column prop="preValue" label="Old Value" align="center"/>
      </el-table-column>
  </el-table></div>
</template>
<script>
export default {
  name: 'LogrecipeEdit',
  data() {
    return {
      model: {
        eqpId: '',
        officeIds: [],
        bcCode: '',
        ip: '',
        modelName: '',
        modelId: '',
        location: '',
        activeFlag: '',
        delFlag: 0,
        officeId: '',
        projectId: '2'
      },
      tableHeight: document.body.scrollHeight - 210,

      formConf: {
        url: '/dsk/edcdsklogrecipe/',
        title: {
          VIEW: '配方日志记录详情'
        },
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }]
        }
      },
      table: {
        rules: {
          eqpId: [{ required: true, message: '设备号必填', trigger: 'blur' }],
          modelName: [{ required: true, message: '设备类型必填', trigger: ['blur', 'change'] }],
          activeFlag: [{ required: true, message: '有效标志必选', trigger: 'change' }]
        },
        model: {
          alarmCode: ''
        },
        datas: []
      }
    }
  },
  activated() {
    this.fromInfo = this.$route.query.item || {}
    this.editFlag = this.$route.query.editFlag
  },
  methods: {
    onFormLoadData(data) {
      this.table.datas = data.edcDskLogRecipeBodyList
    },
    color({ row, column, rowIndex, columnIndex }) {
      if (row.minValue !== row.minValueOld && columnIndex === 5) {
        return 'warning-cell'
      }
      if (row.setValue !== row.setValueOld && columnIndex === 3) {
        return 'warning-cell'
      }
      if (row.maxValue !== row.maxValueOld && columnIndex === 7) {
        return 'warning-cell'
      }
      return ''
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    }
  }
}
</script>
<style lang="scss">

    .editForm {
      .el-select {
        width: 185px;
      }
    }
    .el-table thead.is-group th{
      background-color: #1e6abc;
    }
    .cell-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-table .warning-cell {
      background: yellow;
    }

</style>

