<template>
  <div class="app-container calendar-list-container">
    <w-form v-bind="formConf" :col="3" :model="model" :on-load-data="onFormLoadData">
      <el-input v-model="model.eqpId" label="设备号" />
      <el-input v-model="model.recipeCode" label="配方名" />
      <el-input v-model="model.happenDate" label="发生时间" />
    </w-form>

    <div style="border-top:1px solid #ddd;padding:5px 0;margin:10px 0" />

    <w-edt-table v-bind="table" url="111">
    <!--todo fixed属性导致当前列变为第一列-->
      <w-table-col name="paraCode" required label="参数CODE" sort />
      <w-table-col name="paraName" label="参数名称" align="left" />
      <w-table-col name="setValue" label="设定值" align="left" />
      <w-table-toolbar name="search" hidden/>
      <w-table-toolbar name="add" hidden/>
      <w-table-toolbar name="batchDelete" hidden />
      <w-table-button name="delete" hidden />
      <w-table-button name="edit" hidden />
      <w-table-toolbar name="uploadRecipe" label="查看变化参数" type="primary" tip="查看变化参数" icon="el-icon-circle-plus-outline" />
    </w-edt-table>
  </div>
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
    }
  }
}
</script>
<style scoped>
.btn {
  text-align: center;
  margin-top: 20px;
}
</style>

